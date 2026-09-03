import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DriverService } from '../catalogue/driver.service';
import type { DriverApplicationInput } from '@matoshreecabs/shared';

@Injectable()
export class DriverApplicationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly drivers: DriverService,
  ) {}

  create(input: DriverApplicationInput) {
    return this.prisma.driverApplication.create({
      data: {
        name: input.name,
        mobile: input.mobile,
        email: input.email || null,
        city: input.city,
        licenceNo: input.licenceNo,
        licenceExpiry: input.licenceExpiry,
        experienceYrs: input.experienceYrs,
        ownsVehicle: input.ownsVehicle,
        vehicleType: input.vehicleType || null,
        vehicleNumber: input.vehicleNumber || null,
        preferredTrips: input.preferredTrips,
        notes: input.notes || null,
      },
    });
  }

  list() {
    return this.prisma.driverApplication.findMany({
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
  }

  async setStatus(id: string, status: 'NEW' | 'REVIEWING' | 'APPROVED' | 'REJECTED') {
    if (status !== 'APPROVED') {
      return this.prisma.driverApplication.update({ where: { id }, data: { status } });
    }
    return this.approve(id);
  }

  // Approving creates the real driver account (with an emailed temporary
  // password) — re-approving an already-approved application is a no-op.
  private async approve(id: string) {
    const application = await this.prisma.driverApplication.findUnique({ where: { id } });
    if (!application) throw new NotFoundException('Application not found');

    if (application.createdDriverUserId) {
      return this.prisma.driverApplication.update({
        where: { id },
        data: { status: 'APPROVED' },
      });
    }

    if (!application.email) {
      throw new BadRequestException(
        'This application has no email on file — a driver account needs one to log in and to receive their password. Ask the applicant for an email before approving.',
      );
    }

    const driver = await this.drivers.create({
      name: application.name,
      email: application.email,
      mobile: application.mobile,
      location: application.city,
      licenceNo: application.licenceNo,
      languages: [],
      experienceYrs: application.experienceYrs,
    });

    return this.prisma.driverApplication.update({
      where: { id },
      data: { status: 'APPROVED', createdDriverUserId: driver.id },
    });
  }
}
