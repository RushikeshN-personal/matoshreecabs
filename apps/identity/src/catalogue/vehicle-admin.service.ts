import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type {
  VehicleCreateInput,
  VehicleUpdateInput,
  RateCardInput,
} from '@matoshreecabs/shared';

@Injectable()
export class VehicleAdminService {
  constructor(private readonly prisma: PrismaService) {}

  listAll() {
    return this.prisma.vehicle.findMany({
      orderBy: { seating: 'asc' },
      include: { rateCards: true },
    });
  }

  create(input: VehicleCreateInput) {
    return (this.prisma as any).vehicle.create({ data: input });
  }

  async update(id: string, input: VehicleUpdateInput) {
    await this.ensureExists(id);
    return (this.prisma.vehicle.update({ where: { id }, data: input }));
  }

  async setStatus(id: string, status: 'ACTIVE' | 'DISABLED') {
    await this.ensureExists(id);
    return this.prisma.vehicle.update({ where: { id }, data: { status } });
  }

  async upsertRateCard(vehicleId: string, input: RateCardInput, updatedBy: string) {
    await this.ensureExists(vehicleId);
    return this.prisma.rateCard.upsert({
      where: { vehicleId_mode: { vehicleId, mode: input.mode } },
      update: { ...input, updatedBy, version: { increment: 1 } },
      create: { vehicleId, ...input, updatedBy },
    });
  }

  private async ensureExists(id: string) {
    const v = await this.prisma.vehicle.findUnique({ where: { id } });
    if (!v) throw new NotFoundException('Vehicle not found');
  }
}