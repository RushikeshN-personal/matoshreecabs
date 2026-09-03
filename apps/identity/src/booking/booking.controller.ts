import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../common/guards/optional-jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { BookingService } from './booking.service';
import {
  bookingCreateSchema,
  bookingCancelSchema,
  bookingTrackSchema,
  ROLES,
} from '@matoshreecabs/shared';
import type {
  BookingCreateInput,
  BookingCancelInput,
  BookingTrackInput,
  JwtPayload,
} from '@matoshreecabs/shared';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookings: BookingService) {}

  // Login is not required to book — a signed-in customer is linked to the
  // booking automatically; a guest supplies name/mobile in the body instead.
  @Post()
  @UseGuards(OptionalJwtAuthGuard)
  create(
    @Body(new ZodValidationPipe(bookingCreateSchema)) body: BookingCreateInput,
    @CurrentUser() user: JwtPayload | undefined,
  ) {
    return this.bookings.create(user?.sub, body);
  }

  // Guest self-service: look up / cancel a booking with ref + mobile, no login.
  @Get('track')
  track(@Query(new ZodValidationPipe(bookingTrackSchema)) query: BookingTrackInput) {
    return this.bookings.track(query.ref, query.mobile);
  }

  @Post('track/cancel')
  cancelAsGuest(
    @Body(new ZodValidationPipe(bookingTrackSchema.merge(bookingCancelSchema)))
    body: BookingTrackInput & BookingCancelInput,
  ) {
    return this.bookings.cancelGuest(body.ref, body.mobile, body.reason);
  }

  // Below: requires a logged-in customer account.
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.CUSTOMER)
  listOwn(@CurrentUser() user: JwtPayload) {
    return this.bookings.listOwn(user.sub);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.CUSTOMER)
  getOwn(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.bookings.getOwn(user.sub, id);
  }

  @Post(':id/cancel')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.CUSTOMER)
  cancel(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(bookingCancelSchema)) body: BookingCancelInput,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.bookings.cancelOwn(user.sub, id, body.reason);
  }
}
