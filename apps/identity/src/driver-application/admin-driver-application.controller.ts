import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { DriverApplicationService } from './driver-application.service';
import { driverApplicationStatusSchema, ROLES } from '@matoshreecabs/shared';
import type { DriverApplicationStatusInput } from '@matoshreecabs/shared';

@Controller('admin/driver-applications')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(ROLES.ADMIN, ROLES.DEVELOPER)
export class AdminDriverApplicationController {
  constructor(private readonly applications: DriverApplicationService) {}

  @Get()
  list() {
    return this.applications.list();
  }

  @Patch(':id/status')
  setStatus(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(driverApplicationStatusSchema)) body: DriverApplicationStatusInput,
  ) {
    return this.applications.setStatus(id, body.status);
  }
}
