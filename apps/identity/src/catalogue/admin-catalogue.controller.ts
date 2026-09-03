import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { VehicleAdminService } from './vehicle-admin.service';
import {
  vehicleCreateSchema,
  vehicleUpdateSchema,
  rateCardSchema,
  ROLES,
} from '@matoshreecabs/shared';
import type {
  VehicleCreateInput,
  VehicleUpdateInput,
  RateCardInput,
  JwtPayload,
} from '@matoshreecabs/shared';

@Controller('admin/cabs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(ROLES.ADMIN, ROLES.DEVELOPER)
export class AdminCatalogueController {
  constructor(private readonly vehicles: VehicleAdminService) {}

  @Get()
  list() {
    return this.vehicles.listAll();
  }

  @Post()
  create(@Body(new ZodValidationPipe(vehicleCreateSchema)) body: VehicleCreateInput) {
    return this.vehicles.create(body);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(vehicleUpdateSchema)) body: VehicleUpdateInput,
  ) {
    return this.vehicles.update(id, body);
  }

  @Patch(':id/deactivate')
  deactivate(@Param('id') id: string) {
    return this.vehicles.setStatus(id, 'DISABLED');
  }

  @Patch(':id/activate')
  activate(@Param('id') id: string) {
    return this.vehicles.setStatus(id, 'ACTIVE');
  }

  @Post(':id/rate-card')
  rateCard(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(rateCardSchema)) body: RateCardInput,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.vehicles.upsertRateCard(id, body, user.sub);
  }
}