import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CatalogueService {
  constructor(private readonly prisma: PrismaService) {}

  listVehicles() {
    return (this.prisma as any).vehicle.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { seating: 'asc' },
      // RENTAL (home page "Rent a Car" section) + OUTSTATION (public price
      // catalog) — not every rate card, to keep the public list lean.
      include: { rateCards: { where: { mode: { in: ['RENTAL', 'OUTSTATION'] } } } },
    });
  }

  async getVehicle(id: string) {
    const vehicle = await (this.prisma as any).vehicle.findUnique({
      where: { id },
      include: { rateCards: true },
    });
    if (!vehicle || vehicle.status !== 'ACTIVE') {
      throw new NotFoundException('Vehicle not found');
    }
    return vehicle;
  }
}