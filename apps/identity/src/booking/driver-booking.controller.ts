import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { BookingService } from './booking.service';
import { tripCancelSchema, recordPaymentSchema, ROLES } from '@matoshreecabs/shared';
import type { TripCancelInput, RecordPaymentInput, JwtPayload } from '@matoshreecabs/shared';

@Controller('driver/trips')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(ROLES.DRIVER)
export class DriverBookingController {
  constructor(private readonly bookings: BookingService) {}

  @Get()
  async list(@CurrentUser() user: JwtPayload) {
    const driverProfileId = await this.bookings.driverProfileIdForUser(user.sub);
    return this.bookings.listAssigned(driverProfileId);
  }

  @Post(':id/start')
  async start(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const driverProfileId = await this.bookings.driverProfileIdForUser(user.sub);
    return this.bookings.start(driverProfileId, id);
  }

  @Post(':id/complete')
  async complete(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(recordPaymentSchema)) body: RecordPaymentInput,
    @CurrentUser() user: JwtPayload,
  ) {
    const driverProfileId = await this.bookings.driverProfileIdForUser(user.sub);
    return this.bookings.complete(driverProfileId, id, body);
  }

  @Post(':id/cancel')
  async cancel(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(tripCancelSchema)) body: TripCancelInput,
    @CurrentUser() user: JwtPayload,
  ) {
    const driverProfileId = await this.bookings.driverProfileIdForUser(user.sub);
    return this.bookings.driverCancel(driverProfileId, id, body.reason);
  }
}
