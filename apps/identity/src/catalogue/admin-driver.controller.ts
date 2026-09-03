import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { DriverService } from './driver.service';
import { driverCreateSchema, driverUpdateSchema, ROLES } from '@matoshreecabs/shared';
import type { DriverCreateInput, DriverUpdateInput } from '@matoshreecabs/shared';

@Controller('admin/drivers')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(ROLES.ADMIN, ROLES.DEVELOPER)
export class AdminDriverController {
  constructor(private readonly drivers: DriverService) {}

  @Get()
  list() {
    return this.drivers.list();
  }

  @Post()
  create(@Body(new ZodValidationPipe(driverCreateSchema)) body: DriverCreateInput) {
    return this.drivers.create(body);
  }

  @Patch(':userId')
  update(
    @Param('userId') userId: string,
    @Body(new ZodValidationPipe(driverUpdateSchema)) body: DriverUpdateInput,
  ) {
    return this.drivers.update(userId, body);
  }

  @Patch(':userId/deactivate')
  deactivate(@Param('userId') userId: string) {
    return this.drivers.deactivate(userId);
  }
}