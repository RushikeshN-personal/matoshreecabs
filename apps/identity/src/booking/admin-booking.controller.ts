import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { BookingService } from './booking.service';
import { bookingAssignDriverSchema, bookingCancelSchema, ROLES } from '@matoshreecabs/shared';
import type { BookingAssignDriverInput, BookingCancelInput } from '@matoshreecabs/shared';

@Controller('admin/bookings')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(ROLES.ADMIN, ROLES.DEVELOPER)
export class AdminBookingController {
  constructor(private readonly bookings: BookingService) {}

  @Get()
  list(@Query('status') status?: string) {
    return this.bookings.listAll(status);
  }

  @Post(':id/assign-driver')
  assign(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(bookingAssignDriverSchema)) body: BookingAssignDriverInput,
  ) {
    return this.bookings.assignDriver(id, body.driverId);
  }

  @Post(':id/confirm')
  confirm(@Param('id') id: string) {
    return this.bookings.confirm(id);
  }

  @Post(':id/cancel')
  cancel(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(bookingCancelSchema)) body: BookingCancelInput,
  ) {
    return this.bookings.adminCancel(id, body.reason);
  }
}
