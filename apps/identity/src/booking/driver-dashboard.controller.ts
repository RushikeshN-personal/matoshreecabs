import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { BookingService } from './booking.service';
import { ROLES } from '@matoshreecabs/shared';
import type { JwtPayload } from '@matoshreecabs/shared';

@Controller('driver')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(ROLES.DRIVER)
export class DriverDashboardController {
  constructor(private readonly bookings: BookingService) {}

  @Get('stats')
  async stats(@CurrentUser() user: JwtPayload) {
    const driverProfileId = await this.bookings.driverProfileIdForUser(user.sub);
    return this.bookings.stats(driverProfileId);
  }

  @Get('history')
  async history(@CurrentUser() user: JwtPayload) {
    const driverProfileId = await this.bookings.driverProfileIdForUser(user.sub);
    return this.bookings.listHistory(driverProfileId);
  }
}
