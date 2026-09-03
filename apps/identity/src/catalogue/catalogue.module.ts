import { Module } from '@nestjs/common';
import { CatalogueController } from './catalogue.controller';
import { CatalogueService } from './catalogue.service';
import { VehicleAdminService } from './vehicle-admin.service';
import { DriverService } from './driver.service';
import { AdminCatalogueController } from './admin-catalogue.controller';
import { AdminDriverController } from './admin-driver.controller';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [EmailModule],
  controllers: [
    CatalogueController,
    AdminCatalogueController,
    AdminDriverController,
  ],
  providers: [CatalogueService, VehicleAdminService, DriverService],
  exports: [DriverService],
})
export class CatalogueModule {}