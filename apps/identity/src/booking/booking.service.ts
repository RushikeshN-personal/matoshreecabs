import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BOOKING_STATUS_TRANSITIONS, findPickupLocation, formatPickupLocation } from '@matoshreecabs/shared';
import type {
  BookingCreateInput,
  RecordPaymentInput,
} from '@matoshreecabs/shared';
import { generateBookingRef } from './fare.util';
import { RouteFareService } from './route-fare.service';

@Injectable()
export class BookingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly routeFares: RouteFareService,
  ) {}

  // ---------------- customer / guest ----------------

  // customerId is undefined for a guest (no login required to book); the
  // rider's name/mobile are always captured directly on the booking.
  async create(customerId: string | undefined, input: BookingCreateInput) {
    const vehicle = await this.prisma.vehicle.findUnique({ where: { id: input.vehicleId } });
    if (!vehicle) {
      throw new BadRequestException('Vehicle not found');
    }
    if (input.passengers > vehicle.seating) {
      throw new BadRequestException(
        `This cab seats up to ${vehicle.seating} passengers — choose a bigger cab or reduce passengers.`,
      );
    }

    const pickupLocation = findPickupLocation(input.pickupLocationId);
    // LOCAL trips are single-city — price by pickup city regardless of the
    // chosen in-city drop stop's own city label.
    const toCity = input.mode === 'LOCAL' ? pickupLocation.city : input.destinationCity;

    const fare = toCity
      ? await this.routeFares.findFare(input.vehicleId, input.mode, pickupLocation.city, toCity)
      : null;
    // No mapped route is fine — the booking is still created and stored so
    // ops has the full request on file; the customer confirms the charge
    // with us on WhatsApp instead of seeing a computed number. total stays
    // 0 (a real fare is always >0) until that's settled or an admin sets it.

    const pickup = formatPickupLocation(pickupLocation);

    return this.prisma.booking.create({
      data: {
        ref: generateBookingRef(),
        customerId: customerId ?? null,
        guestName: customerId ? undefined : input.riderName,
        guestMobile: customerId ? undefined : input.riderMobile,
        guestEmail: customerId ? undefined : input.riderEmail || undefined,
        mode: input.mode,
        pickup,
        destination: input.destination,
        tripType: input.tripType,
        dateTime: input.dateTime,
        returnDateTime: input.returnDateTime,
        vehicleId: input.vehicleId,
        passengers: input.passengers,
        gstNumber: input.gstNumber || undefined,
        flightNumber: input.flightNumber || undefined,
        trainNumber: input.trainNumber || undefined,
        fareBreakdown: (fare as any) ?? undefined,
        total: fare?.total ?? 0,
      },
      include: { vehicle: true },
    });
  }

  listOwn(customerId: string) {
    return this.prisma.booking.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
      include: { vehicle: true, driver: { include: { user: true } }, payment: true },
    });
  }

  async getOwn(customerId: string, id: string) {
    const booking = await this.getOrThrow(id);
    if (booking.customerId !== customerId) throw new ForbiddenException();
    return booking;
  }

  async cancelOwn(customerId: string, id: string, reason?: string) {
    const booking = await this.getOrThrow(id);
    if (booking.customerId !== customerId) throw new ForbiddenException();
    return this.transition(booking, 'CANCELLED', { cancelReason: reason, cancelledBy: 'CUSTOMER' });
  }

  // Guest self-service: look up a single booking by reference + the mobile
  // number it was booked with — no account needed.
  async track(ref: string, mobile: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { ref },
      include: { vehicle: true, driver: { include: { user: true } }, payment: true },
    });
    if (!booking || booking.guestMobile !== mobile) {
      throw new NotFoundException('No booking found for that reference and mobile number');
    }
    return booking;
  }

  // Cancel as a guest — same reference+mobile check as track().
  async cancelGuest(ref: string, mobile: string, reason?: string) {
    const booking = await this.track(ref, mobile);
    return this.transition(booking, 'CANCELLED', { cancelReason: reason, cancelledBy: 'CUSTOMER' });
  }

  // ---------------- admin ----------------

  listAll(status?: string) {
    return this.prisma.booking.findMany({
      where: status ? { status: status as any } : undefined,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: { select: { name: true, mobile: true, email: true } },
        vehicle: true,
        driver: { include: { user: true } },
        payment: true,
      },
    });
  }

  async assignDriver(id: string, driverProfileId: string) {
    const booking = await this.getOrThrow(id);
    const driver = await this.prisma.driverProfile.findUnique({ where: { id: driverProfileId } });
    if (!driver) throw new NotFoundException('Driver not found');

    const updated = await this.transition(booking, 'DRIVER_ASSIGNED', { driverId: driverProfileId });
    return updated;
  }

  async confirm(id: string) {
    const booking = await this.getOrThrow(id);
    if (!booking.driverId) throw new BadRequestException('Assign a driver before confirming');
    return this.transition(booking, 'CONFIRMED');
  }

  async adminCancel(id: string, reason?: string) {
    const booking = await this.getOrThrow(id);
    return this.transition(booking, 'CANCELLED', { cancelReason: reason, cancelledBy: 'ADMIN' });
  }

  // ---------------- driver ----------------

  async driverProfileIdForUser(userId: string): Promise<string> {
    const profile = await this.prisma.driverProfile.findUnique({ where: { userId } });
    if (!profile) throw new ForbiddenException('No driver profile for this user');
    return profile.id;
  }

  async listAssigned(driverProfileId: string) {
    return this.prisma.booking.findMany({
      where: { driverId: driverProfileId, status: { in: ['CONFIRMED', 'ONGOING'] } },
      orderBy: { dateTime: 'asc' },
      include: { customer: { select: { name: true, mobile: true } }, vehicle: true },
    });
  }

  async listHistory(driverProfileId: string) {
    return this.prisma.booking.findMany({
      where: { driverId: driverProfileId, status: { in: ['COMPLETED', 'CLOSED'] } },
      orderBy: { dateTime: 'desc' },
      take: 100,
      include: {
        customer: { select: { name: true, mobile: true } },
        vehicle: true,
        payment: true,
      },
    });
  }

  async stats(driverProfileId: string) {
    const [total, completed, ongoing, upcoming, needsReassignment, payments] = await Promise.all([
      this.prisma.booking.count({ where: { driverId: driverProfileId } }),
      this.prisma.booking.count({
        where: { driverId: driverProfileId, status: { in: ['COMPLETED', 'CLOSED'] } },
      }),
      this.prisma.booking.count({ where: { driverId: driverProfileId, status: 'ONGOING' } }),
      this.prisma.booking.count({ where: { driverId: driverProfileId, status: 'CONFIRMED' } }),
      this.prisma.booking.count({
        where: { driverId: driverProfileId, status: 'NEEDS_REASSIGNMENT' },
      }),
      this.prisma.payment.findMany({
        where: { recordedBy: driverProfileId },
        select: { amount: true },
      }),
    ]);
    const totalCollected = payments.reduce((sum, p) => sum + Number(p.amount), 0);

    return {
      totalTrips: total,
      completedTrips: completed,
      ongoingTrips: ongoing,
      upcomingTrips: upcoming,
      cancelledByMe: needsReassignment,
      totalCollected,
    };
  }

  async start(driverProfileId: string, id: string) {
    const booking = await this.getOwnedByDriver(driverProfileId, id);
    return this.transition(booking, 'ONGOING');
  }

  async complete(driverProfileId: string, id: string, payment: RecordPaymentInput) {
    const booking = await this.getOwnedByDriver(driverProfileId, id);
    const updated = await this.transition(booking, 'COMPLETED');
    await this.prisma.payment.upsert({
      where: { bookingId: id },
      update: { amount: payment.amount, method: payment.method, recordedBy: driverProfileId },
      create: {
        bookingId: id,
        amount: payment.amount,
        method: payment.method,
        recordedBy: driverProfileId,
      },
    });
    return this.transition(updated, 'CLOSED');
  }

  async driverCancel(driverProfileId: string, id: string, reason: string) {
    const booking = await this.getOwnedByDriver(driverProfileId, id);
    return this.transition(booking, 'NEEDS_REASSIGNMENT', {
      cancelReason: reason,
      cancelledBy: 'DRIVER',
      driverId: null,
    });
  }

  // ---------------- shared ----------------

  private async getOrThrow(id: string) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }

  private async getOwnedByDriver(driverProfileId: string, id: string) {
    const booking = await this.getOrThrow(id);
    if (booking.driverId !== driverProfileId) throw new ForbiddenException();
    return booking;
  }

  private transition(booking: { id: string; status: string }, to: string, extra: Record<string, unknown> = {}) {
    const allowed = BOOKING_STATUS_TRANSITIONS[booking.status] ?? [];
    if (!allowed.includes(to)) {
      throw new BadRequestException(`Cannot move booking from ${booking.status} to ${to}`);
    }
    return this.prisma.booking.update({
      where: { id: booking.id },
      data: { status: to as any, ...extra },
      include: { vehicle: true, driver: { include: { user: true } }, payment: true },
    });
  }
}
