"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BOOKING_MODES,
  BOOKING_MODE_LABELS,
  PICKUP_LOCATIONS,
  DEFAULT_PICKUP_LOCATION_ID,
  formatPickupLocation,
  DESTINATION_STOPS,
  findDestinationStop,
} from "@matoshreecabs/shared";
import { fetchCabs, type Vehicle } from "@/lib/api/cabs";
import { createBooking, type Booking } from "@/lib/api/bookings";
import { quoteFare, type FareQuoteResult } from "@/lib/api/route-fares";
import { useAuth } from "@/lib/auth/use-auth";
import { SITE } from "@/lib/constants/site.constants";
import { TimePicker } from "./time-picker";

const TODAY_STR = new Date().toISOString().slice(0, 10);
const OTHER_STOP = "OTHER";

// Rental is retired from the booking form — no rate/route data is
// maintained for it anymore, though the mode still exists historically.
const MODE_ORDER = [BOOKING_MODES.PICK_DROP, BOOKING_MODES.OUTSTATION, BOOKING_MODES.LOCAL];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Group destination stops by their parent city for <optgroup> rendering.
const DESTINATION_GROUPS: Array<{ city: string; stops: typeof DESTINATION_STOPS }> = (() => {
  const order: string[] = [];
  const byCity = new Map<string, typeof DESTINATION_STOPS>();
  for (const stop of DESTINATION_STOPS) {
    if (!byCity.has(stop.city)) {
      byCity.set(stop.city, []);
      order.push(stop.city);
    }
    byCity.get(stop.city)!.push(stop);
  }
  return order.map((city) => ({ city, stops: byCity.get(city)! }));
})();

function CarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8 text-gray-400" fill="currentColor" aria-hidden>
      <path d="M5 11l1.5-4.5A2 2 0 0 1 8.4 5h7.2a2 2 0 0 1 1.9 1.5L19 11h1a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-1v1a1 1 0 0 1-2 0v-1H7v1a1 1 0 0 1-2 0v-1H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h1Zm2.2 0h9.6l-1-3H8.2l-1 3ZM7 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm10 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
    </svg>
  );
}

function StepDots({ step }: { step: 1 | 2 }) {
  return (
    <div className="mb-4 flex items-center gap-2 text-xs font-semibold text-gray-400">
      <span className={step === 1 ? "text-orange-600" : ""}>1. Trip details</span>
      <span className="h-px w-6 bg-gray-200" />
      <span className={step === 2 ? "text-orange-600" : ""}>2. Contact details</span>
    </div>
  );
}

export function BookingForm() {
  const { user } = useAuth();
  const [step, setStep] = useState<1 | 2>(1);

  // Step 1 — trip
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [mode, setMode] = useState<string>(BOOKING_MODES.PICK_DROP);
  const [pickupLocationId, setPickupLocationId] = useState(DEFAULT_PICKUP_LOCATION_ID);
  const [destinationStopId, setDestinationStopId] = useState("");
  const [customDestination, setCustomDestination] = useState("");
  const [tripType, setTripType] = useState<"ONE_WAY" | "ROUND_TRIP">("ONE_WAY");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [returnTime, setReturnTime] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [cab, setCab] = useState<string>("");

  // Live fare quote for the current mode/pickup/destination/cab combination.
  const [quote, setQuote] = useState<FareQuoteResult | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);

  // Step 2 — contact
  const [riderName, setRiderName] = useState("");
  const [riderMobile, setRiderMobile] = useState("");
  const [riderEmail, setRiderEmail] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [flightNumber, setFlightNumber] = useState("");
  const [trainNumber, setTrainNumber] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    fetchCabs()
      .then((list) => {
        setVehicles(list);
        if (list[0]) setCab(list[0].id);
      })
      .catch(() => setError("Couldn't load cabs. Try again shortly."));
  }, []);

  // Prefill from the logged-in profile — still editable, and still sent even
  // when logged in, since it's the contact the driver/ops will use.
  useEffect(() => {
    if (user) {
      setRiderName((prev) => prev || user.name);
      setRiderMobile((prev) => prev || user.mobile);
      setRiderEmail((prev) => prev || user.email);
    }
  }, [user]);

  const isOutstation = mode === BOOKING_MODES.OUTSTATION;
  const isLocal = mode === BOOKING_MODES.LOCAL;
  const pickupCity = PICKUP_LOCATIONS.find((l) => l.id === pickupLocationId)?.city;

  // For Local trips, only in-city stops are offered as the destination.
  const destinationGroups = isLocal
    ? [{ city: pickupCity ?? "", stops: DESTINATION_STOPS.filter((s) => s.city === pickupCity) }]
    : DESTINATION_GROUPS;

  // Reset the destination whenever it would no longer be a valid option
  // (mode switched, or pickup city changed under a Local selection).
  useEffect(() => {
    setDestinationStopId("");
    setCustomDestination("");
  }, [mode, pickupLocationId]);

  // Live fare lookup — runs whenever enough is chosen to price a route.
  useEffect(() => {
    setQuote(null);
    if (!cab || !pickupCity || !destinationStopId || destinationStopId === OTHER_STOP) return;
    const stop = findDestinationStop(destinationStopId);
    if (!stop) return;

    let cancelled = false;
    setQuoteLoading(true);
    quoteFare({ vehicleId: cab, mode, fromCity: pickupCity, toCity: stop.city })
      .then((result) => {
        if (!cancelled) setQuote(result);
      })
      .catch(() => {
        if (!cancelled) setQuote({ found: false });
      })
      .finally(() => {
        if (!cancelled) setQuoteLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [cab, mode, pickupCity, destinationStopId]);

  const selectedVehicle = vehicles.find((v) => v.id === cab);
  const destinationLabel =
    destinationStopId === OTHER_STOP
      ? customDestination.trim()
      : findDestinationStop(destinationStopId)?.label;

  function handleContinue() {
    setError(null);
    if (!cab || !date || !time) {
      setError("Please fill in the pickup date, time, and cab.");
      return;
    }
    if (!destinationStopId) {
      setError(isLocal ? "Please select a drop point." : "Please select a destination.");
      return;
    }
    if (destinationStopId === OTHER_STOP && !customDestination.trim()) {
      setError("Please type your destination.");
      return;
    }
    if (isOutstation && tripType === "ROUND_TRIP" && (!returnDate || !returnTime)) {
      setError("Please enter your return date and time.");
      return;
    }
    if (selectedVehicle && passengers > selectedVehicle.seating) {
      setError(
        `${selectedVehicle.name} seats up to ${selectedVehicle.seating} passengers — choose a bigger cab or reduce passengers.`,
      );
      return;
    }
    setStep(2);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!riderName.trim() || !/^[6-9]\d{9}$/.test(riderMobile.trim())) {
      setError("Please enter your name and a valid 10-digit mobile number.");
      return;
    }
    if (riderEmail.trim() && !EMAIL_REGEX.test(riderEmail.trim())) {
      setError("Please enter a valid email address, or leave it blank.");
      return;
    }

    const dateTime = new Date(`${date}T${time}`).toISOString();
    const returnDateTime =
      isOutstation && tripType === "ROUND_TRIP" && returnDate && returnTime
        ? new Date(`${returnDate}T${returnTime}`).toISOString()
        : undefined;
    const destinationStop = findDestinationStop(destinationStopId);

    setSubmitting(true);
    try {
      const result = await createBooking({
        mode,
        vehicleId: cab,
        pickupLocationId,
        destination: destinationLabel,
        destinationCity: destinationStop?.city,
        tripType: isOutstation ? tripType : undefined,
        dateTime,
        returnDateTime,
        passengers,
        riderName: riderName.trim(),
        riderMobile: riderMobile.trim(),
        riderEmail: riderEmail.trim() || undefined,
        gstNumber: gstNumber.trim() || undefined,
        flightNumber: flightNumber.trim() || undefined,
        trainNumber: trainNumber.trim() || undefined,
      });
      setBooking(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit booking.");
    } finally {
      setSubmitting(false);
    }
  }

  if (booking) {
    const farePending = Number(booking.total) <= 0;
    const confirmMessage =
      `Hi, I've just booked a cab (Ref: ${booking.ref}) — ${BOOKING_MODE_LABELS[booking.mode] ?? booking.mode} ` +
      `from ${booking.pickup} to ${booking.destination ?? "—"}, ${new Date(booking.dateTime).toLocaleString()}, ` +
      `${booking.passengers} passenger(s) in a ${booking.vehicle?.name ?? "cab"}. ` +
      `Please confirm the charges for this trip.`;
    const confirmHref = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(confirmMessage)}`;

    return (
      <div className="w-full rounded-2xl bg-white p-6 shadow-2xl">
        <h3 className="text-lg font-bold text-gray-900">Ride requested!</h3>
        <p className="mt-1 text-sm text-gray-600">
          Reference <span className="font-mono font-semibold">{booking.ref}</span>. We'll confirm
          your driver shortly — pay them directly (cash or UPI) at the end of the trip.
        </p>
        <dl className="mt-4 space-y-1 text-sm text-gray-700">
          <div className="flex justify-between">
            <dt>Trip</dt>
            <dd>{BOOKING_MODE_LABELS[booking.mode]}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Route</dt>
            <dd>
              {booking.pickup} → {booking.destination ?? "—"}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt>Cab</dt>
            <dd>{booking.vehicle?.name ?? "—"}</dd>
          </div>
          <div className="flex justify-between font-semibold text-gray-900">
            <dt>{farePending ? "Fare" : "Estimated fare"}</dt>
            <dd>{farePending ? "To be confirmed" : `₹${booking.total}`}</dd>
          </div>
        </dl>

        <a
          href={confirmHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-green-700"
        >
          {farePending ? "Confirm charges on WhatsApp" : "Confirm on WhatsApp"}
        </a>

        <Link
          href={user ? "/my-bookings" : `/track-booking?ref=${booking.ref}`}
          className="mt-2 inline-block w-full rounded-lg border border-gray-200 px-4 py-2.5 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          {user ? "View my bookings" : "Track this booking"}
        </Link>
        {!user && (
          <p className="mt-2 text-center text-xs text-gray-500">
            Save your reference — you can look it up anytime with your mobile number.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
      <StepDots step={step} />

      {step === 1 && (
        <div className="space-y-4">
          {/* Mode tabs */}
          <div className="flex flex-wrap gap-2">
            {MODE_ORDER.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={
                  "rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors " +
                  (mode === m
                    ? "bg-orange-600 text-white"
                    : "bg-orange-50 text-orange-700 hover:bg-orange-100")
                }
              >
                {BOOKING_MODE_LABELS[m]}
              </button>
            ))}
          </div>

          {/* Pickup (choose from serviceable cities) + destination */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">Pickup</label>
              <select
                value={pickupLocationId}
                onChange={(e) => setPickupLocationId(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-orange-500"
              >
                {PICKUP_LOCATIONS.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {formatPickupLocation(loc)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">
                {isLocal ? "Drop point (within the city)" : "Destination"}
              </label>
              <select
                value={destinationStopId}
                onChange={(e) => setDestinationStopId(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-orange-500"
              >
                <option value="" disabled>
                  {isLocal ? "Where to, in the city?" : "Where to?"}
                </option>
                {destinationGroups.map((group) => (
                  <optgroup key={group.city} label={group.city}>
                    {group.stops.map((stop) => (
                      <option key={stop.id} value={stop.id}>
                        {stop.label}
                      </option>
                    ))}
                  </optgroup>
                ))}
                <option value={OTHER_STOP}>Other — not in this list</option>
              </select>
            </div>
          </div>

          {destinationStopId === OTHER_STOP && (
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">
                Type your destination
              </label>
              <input
                value={customDestination}
                onChange={(e) => setCustomDestination(e.target.value)}
                placeholder="Where exactly are you headed?"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-orange-500"
              />
            </div>
          )}

          {/* Live fare */}
          {quoteLoading && (
            <p className="text-xs text-gray-500">Checking the fare for this route…</p>
          )}
          {!quoteLoading && quote?.found && (
            <div className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-800">
              <span className="font-bold">₹{quote.fare.total}</span> estimated
              {quote.fare.tollCharge > 0 && ` (incl. ₹${quote.fare.tollCharge} toll)`}
              {quote.fare.gstAmount > 0 && ` + GST`}
              {" — pay the driver directly."}
            </div>
          )}
          {isOutstation && (
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">Trip type</label>
              <div className="flex gap-2">
                {(["ONE_WAY", "ROUND_TRIP"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTripType(t)}
                    className={
                      "rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors " +
                      (tripType === t
                        ? "bg-orange-600 text-white"
                        : "bg-orange-50 text-orange-700 hover:bg-orange-100")
                    }
                  >
                    {t === "ONE_WAY" ? "One-way" : "Round-trip"}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Date + time */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">Date</label>
              <input
                type="date"
                value={date}
                min={TODAY_STR}
                onChange={(e) => {
                  setDate(e.target.value);
                  // dropping an already-picked time that's now in the past
                  if (e.target.value === TODAY_STR) setTime("");
                }}
                required
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">Time</label>
              <TimePicker value={time} onChange={setTime} date={date || TODAY_STR} />
            </div>
          </div>

          {isOutstation && tripType === "ROUND_TRIP" && (
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">
                  Return date
                </label>
                <input
                  type="date"
                  value={returnDate}
                  min={date || TODAY_STR}
                  onChange={(e) => {
                    setReturnDate(e.target.value);
                    if (e.target.value === TODAY_STR) setReturnTime("");
                  }}
                  required
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">
                  Return time
                </label>
                <TimePicker
                  value={returnTime}
                  onChange={setReturnTime}
                  date={returnDate || TODAY_STR}
                />
              </div>
            </div>
          )}

          <div className="w-32">
            <label className="mb-1 block text-xs font-medium text-gray-500">Passengers</label>
            <input
              type="number"
              min={1}
              max={50}
              value={passengers}
              onChange={(e) => setPassengers(Math.max(1, Number(e.target.value) || 1))}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-orange-500"
            />
          </div>

          {/* Cab selector */}
          <div>
            <label className="mb-2 block text-xs font-medium text-gray-500">Choose a cab</label>
            <div className="grid grid-cols-3 gap-2">
              {vehicles.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setCab(v.id)}
                  className={
                    "flex flex-col items-center gap-1 rounded-xl border p-2 transition-colors " +
                    (cab === v.id
                      ? "border-orange-600 ring-2 ring-orange-200"
                      : "border-gray-200 hover:border-orange-300")
                  }
                >
                  <span className="flex h-12 w-full items-center justify-center overflow-hidden rounded-md bg-gray-50">
                    {v.images?.[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={v.images[0]}
                        alt={v.name}
                        className="h-full w-full object-cover"
                        onError={(e) => (e.currentTarget.style.display = "none")}
                      />
                    ) : (
                      <CarIcon />
                    )}
                  </span>
                  <span className="text-xs font-semibold text-gray-800">{v.name}</span>
                  <span className="text-[10px] text-gray-500">{v.seating} seats</span>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          )}

          <button
            type="button"
            onClick={handleContinue}
            disabled={!cab}
            className="w-full rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-orange-700 disabled:opacity-60"
          >
            Continue
          </button>
        </div>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">Your name</label>
            <input
              value={riderName}
              onChange={(e) => setRiderName(e.target.value)}
              placeholder="Full name"
              required
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-orange-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">Mobile number</label>
            <input
              value={riderMobile}
              onChange={(e) => setRiderMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
              placeholder="10-digit mobile"
              inputMode="numeric"
              required
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-orange-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">
              Email <span className="text-gray-400">(optional)</span>
            </label>
            <input
              type="email"
              value={riderEmail}
              onChange={(e) => setRiderEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-orange-500"
            />
          </div>

          {/* Optional trip details — none of these are required to book */}
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">
                GST number <span className="text-gray-400">(optional)</span>
              </label>
              <input
                value={gstNumber}
                onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                placeholder="For a business invoice"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">
                Flight number <span className="text-gray-400">(optional)</span>
              </label>
              <input
                value={flightNumber}
                onChange={(e) => setFlightNumber(e.target.value.toUpperCase())}
                placeholder="e.g. AI 2801"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">
                Train number <span className="text-gray-400">(optional)</span>
              </label>
              <input
                value={trainNumber}
                onChange={(e) => setTrainNumber(e.target.value.toUpperCase())}
                placeholder="e.g. 12123"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-orange-500"
              />
            </div>
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-orange-700 disabled:opacity-60"
            >
              {submitting ? "Requesting…" : "Request Ride"}
            </button>
          </div>
          <p className="text-center text-xs text-gray-500">
            No account needed — pay the driver directly (cash or UPI) at the end of the trip.
          </p>
        </form>
      )}
    </div>
  );
}
