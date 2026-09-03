import { Controller, Get, Param } from '@nestjs/common';
import { CatalogueService } from './catalogue.service';

@Controller('cabs')
export class CatalogueController {
  constructor(private readonly catalogue: CatalogueService) {}

  @Get()
  list() {
    return this.catalogue.listVehicles();
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.catalogue.getVehicle(id);
  }
}