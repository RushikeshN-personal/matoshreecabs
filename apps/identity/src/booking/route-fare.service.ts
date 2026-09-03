import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { RouteFareUpsertInput } from '@matoshreecabs/shared';

export interface FareBreakdown {
  baseFare: number;
  tollCharge: number;
  gstPercent: number;
  gstAmount: number;
  total: number;
}

@Injectable()
export class RouteFareService {
  constructor(private readonly prisma: PrismaService) {}

  // The one thing every route-priced booking goes through: look up a fixed
  // fare for this vehicle/mode/city-pair. LOCAL trips stay within one city,
  // so fromCity/toCity are the same value there. Returns null when there's
  // no mapped route — callers fall back to a WhatsApp quote, never a guess.
  async findFare(
    vehicleId: string,
    mode: string,
    fromCity: string,
    toCity: string,
  ): Promise<FareBreakdown | null> {
    const row = await this.prisma.routeFare.findFirst({
      where: { vehicleId, mode: mode as any, fromCity, toCity, active: true },
    });
    if (!row) return null;

    const baseFare = Number(row.baseFare);
    const tollCharge = Number(row.tollCharge);
    const gstPercent = Number(row.gstPercent);
    const subtotal = baseFare + tollCharge;
    const gstAmount = Math.round(subtotal * (gstPercent / 100) * 100) / 100;
    const total = Math.round((subtotal + gstAmount) * 100) / 100;

    return { baseFare, tollCharge, gstPercent, gstAmount, total };
  }

  list() {
    return this.prisma.routeFare.findMany({
      orderBy: [{ mode: 'asc' }, { fromCity: 'asc' }, { toCity: 'asc' }],
      include: { vehicle: { select: { name: true } } },
    });
  }

  upsert(input: RouteFareUpsertInput, updatedBy: string) {
    return this.prisma.routeFare.upsert({
      where: {
        vehicleId_mode_fromCity_toCity: {
          vehicleId: input.vehicleId,
          mode: input.mode as any,
          fromCity: input.fromCity,
          toCity: input.toCity,
        },
      },
      update: {
        baseFare: input.baseFare,
        tollCharge: input.tollCharge,
        gstPercent: input.gstPercent,
        active: input.active,
        updatedBy,
      },
      create: {
        vehicleId: input.vehicleId,
        mode: input.mode as any,
        fromCity: input.fromCity,
        toCity: input.toCity,
        baseFare: input.baseFare,
        tollCharge: input.tollCharge,
        gstPercent: input.gstPercent,
        active: input.active,
        updatedBy,
      },
    });
  }

  remove(id: string) {
    return this.prisma.routeFare.delete({ where: { id } });
  }
}
