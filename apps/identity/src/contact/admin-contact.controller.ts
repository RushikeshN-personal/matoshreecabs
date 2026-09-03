import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ContactService } from './contact.service';
import { ROLES } from '@matoshreecabs/shared';

@Controller('admin/contact')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(ROLES.ADMIN, ROLES.DEVELOPER)
export class AdminContactController {
  constructor(private readonly contact: ContactService) {}

  @Get()
  list() {
    return this.contact.list();
  }

  @Patch(':id/read')
  read(@Param('id') id: string) {
    return this.contact.markStatus(id, 'READ');
  }

  @Patch(':id/resolve')
  resolve(@Param('id') id: string) {
    return this.contact.markStatus(id, 'RESOLVED');
  }
}