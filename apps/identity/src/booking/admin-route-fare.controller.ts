import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { RouteFareService } from './route-fare.service';
import { routeFareUpsertSchema, ROLES } from '@matoshreecabs/shared';
import type { RouteFareUpsertInput, JwtPayload } from '@matoshreecabs/shared';

@Controller('admin/route-fares')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(ROLES.ADMIN, ROLES.DEVELOPER)
export class AdminRouteFareController {
  constructor(private readonly routeFares: RouteFareService) {}

  @Get()
  list() {
    return this.routeFares.list();
  }

  @Post()
  upsert(
    @Body(new ZodValidationPipe(routeFareUpsertSchema)) body: RouteFareUpsertInput,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.routeFares.upsert(body, user.sub);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.routeFares.remove(id);
  }
}
