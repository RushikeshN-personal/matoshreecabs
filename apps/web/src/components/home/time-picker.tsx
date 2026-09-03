"use client";

import { useEffect, useRef, useState } from "react";

const HOURS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const MINUTES = [0, 15, 30, 45];
const PERIODS = ["AM", "PM"] as const;

function toHour24(hour12: number, period: "AM" | "PM"): number {
  if (period === "AM") return hour12 === 12 ? 0 : hour12;
  return hour12 === 12 ? 12 : hour12 + 12;
}

function toHour12(hour24: number): { hour12: number; period: "AM" | "PM" } {
  const period: "AM" | "PM" = hour24 >= 12 ? "PM" : "AM";
  let hour12 = hour24 % 12;
  if (hour12 === 0) hour12 = 12;
  return { hour12, period };
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

interface TimePickerProps {
  value: string; // "HH:mm" 24-hour, "" if unset
  onChange: (value: string) => void;
  date: string; // paired "YYYY-MM-DD" — determines whether "today" restrictions apply
  placeholder?: string;
}

export function TimePicker({ value, onChange, date, placeholder = "Select time" }: TimePickerProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const parsed = value ? value.split(":").map(Number) : null;
  const initial = parsed ? toHour12(parsed[0]) : null;
  const [hour12, setHour12] = useState<number | null>(initial?.hour12 ?? null);
  const [minute, setMinute] = useState<number | null>(parsed ? parsed[1] : null);
  const [period, setPeriod] = useState<"AM" | "PM">(initial?.period ?? "AM");

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const todayStr = new Date().toISOString().slice(0, 10);
  const isToday = date === todayStr;
  const now = new Date();

  function isHourFullyPast(hour12Val: number, periodVal: "AM" | "PM"): boolean {
    if (!isToday) return false;
    const hour24 = toHour24(hour12Val, periodVal);
    return hour24 < now.getHours();
  }

  function isMinutePast(hour12Val: number, minuteVal: number, periodVal: "AM" | "PM"): boolean {
    if (!isToday) return false;
    const hour24 = toHour24(hour12Val, periodVal);
    if (hour24 < now.getHours()) return true;
    if (hour24 === now.getHours() && minuteVal <= now.getMinutes()) return true;
    return false;
  }

  function isPeriodFullyPast(periodVal: "AM" | "PM"): boolean {
    if (!isToday) return false;
    return HOURS.every((h) => isHourFullyPast(h, periodVal));
  }

  function commit(h: number, m: number, p: "AM" | "PM") {
    onChange(`${pad(toHour24(h, p))}:${pad(m)}`);
  }

  function selectHour(h: number) {
    if (isHourFullyPast(h, period)) return;
    setHour12(h);
    if (minute !== null && !isMinutePast(h, minute, period)) commit(h, minute, period);
  }

  function selectMinute(m: number) {
    if (hour12 === null || isMinutePast(hour12, m, period)) return;
    setMinute(m);
    commit(hour12, m, period);
  }

  function selectPeriod(p: "AM" | "PM") {
    if (isPeriodFullyPast(p)) return;
    setPeriod(p);
    if (hour12 !== null && minute !== null && !isMinutePast(hour12, minute, p)) {
      commit(hour12, minute, p);
    }
  }

  const display =
    hour12 !== null && minute !== null ? `${pad(hour12)}:${pad(minute)} ${period}` : "";

  const btnBase = "rounded-lg px-2.5 py-1.5 text-sm font-semibold transition-colors";
  const btnEnabled = "bg-orange-50 text-orange-700 hover:bg-orange-100";
  const btnSelected = "bg-orange-600 text-white";
  const btnDisabled = "cursor-not-allowed bg-gray-50 text-gray-300";

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 text-left text-sm text-gray-900 outline-none focus:border-orange-500"
      >
        <span className={display ? "" : "text-gray-400"}>{display || placeholder}</span>
        <svg viewBox="0 0 24 24" className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-20 mt-1 w-72 rounded-2xl border border-gray-100 bg-white p-4 shadow-2xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Hour</p>
          <div className="grid grid-cols-6 gap-1.5">
            {HOURS.map((h) => {
              const disabled = isHourFullyPast(h, period);
              const selected = hour12 === h;
              return (
                <button
                  key={h}
                  type="button"
                  disabled={disabled}
                  onClick={() => selectHour(h)}
                  className={`${btnBase} ${disabled ? btnDisabled : selected ? btnSelected : btnEnabled}`}
                >
                  {h}
                </button>
              );
            })}
          </div>

          <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Minutes
          </p>
          <div className="grid grid-cols-4 gap-1.5">
            {MINUTES.map((m) => {
              const disabled = hour12 === null || isMinutePast(hour12, m, period);
              const selected = minute === m;
              return (
                <button
                  key={m}
                  type="button"
                  disabled={disabled}
                  onClick={() => selectMinute(m)}
                  className={`${btnBase} ${disabled ? btnDisabled : selected ? btnSelected : btnEnabled}`}
                >
                  :{pad(m)}
                </button>
              );
            })}
          </div>

          <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Period
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            {PERIODS.map((p) => {
              const disabled = isPeriodFullyPast(p);
              const selected = period === p;
              return (
                <button
                  key={p}
                  type="button"
                  disabled={disabled}
                  onClick={() => selectPeriod(p)}
                  className={`${btnBase} ${disabled ? btnDisabled : selected ? btnSelected : btnEnabled}`}
                >
                  {p}
                </button>
              );
            })}
          </div>

          {display && (
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-4 w-full rounded-lg bg-orange-50 px-3 py-2 text-sm font-semibold text-orange-700 hover:bg-orange-100"
            >
              🕐 {display} — Done
            </button>
          )}
        </div>
      )}
    </div>
  );
}
