import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RbacModule } from './rbac/rbac.module';
import { CatalogueModule } from './catalogue/catalogue.module';
import { ReviewsModule } from './reviews/reviews.module';
import { BookingModule } from './booking/booking.module';
import { ContactModule } from './contact/contact.module';
import { DriverApplicationModule } from './driver-application/driver-application.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UsersModule,
    RbacModule,
    AuthModule,
    CatalogueModule,
    ReviewsModule,
    BookingModule,
    ContactModule,
    DriverApplicationModule,
  ],
})
export class AppModule {}

