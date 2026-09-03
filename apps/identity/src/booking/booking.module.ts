import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { AdminBookingController } from './admin-booking.controller';
import { DriverBookingController } from './driver-booking.controller';
import { DriverDashboardController } from './driver-dashboard.controller';
import { RouteFareController } from './route-fare.controller';
import { AdminRouteFareController } from './admin-route-fare.controller';
import { BookingService } from './booking.service';
import { RouteFareService } from './route-fare.service';

@Module({
  controllers: [
    BookingController,
    AdminBookingController,
    DriverBookingController,
    DriverDashboardController,
    RouteFareController,
    AdminRouteFareController,
  ],
  providers: [BookingService, RouteFareService],
})
export class BookingModule {}
