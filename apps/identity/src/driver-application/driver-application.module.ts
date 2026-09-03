import { Module } from '@nestjs/common';
import { DriverApplicationController } from './driver-application.controller';
import { AdminDriverApplicationController } from './admin-driver-application.controller';
import { DriverApplicationService } from './driver-application.service';
import { CatalogueModule } from '../catalogue/catalogue.module';

@Module({
  imports: [CatalogueModule],
  controllers: [DriverApplicationController, AdminDriverApplicationController],
  providers: [DriverApplicationService],
})
export class DriverApplicationModule {}
