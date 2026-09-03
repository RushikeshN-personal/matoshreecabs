import { Body, Controller, Post } from '@nestjs/common';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { DriverApplicationService } from './driver-application.service';
import { driverApplicationSchema } from '@matoshreecabs/shared';
import type { DriverApplicationInput } from '@matoshreecabs/shared';

@Controller('driver-applications')
export class DriverApplicationController {
  constructor(private readonly applications: DriverApplicationService) {}

  @Post()
  submit(@Body(new ZodValidationPipe(driverApplicationSchema)) body: DriverApplicationInput) {
    return this.applications.create(body).then(() => ({ ok: true }));
  }
}
