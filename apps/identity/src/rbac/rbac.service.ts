import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RbacService {
  constructor(private readonly prisma: PrismaService) {}

  async can(role: string, capability: string): Promise<boolean> {
    const rule = await this.prisma.rolePermission.findUnique({
      where: { role_capability: { role: role as never, capability } },
    });
    return rule?.allowed ?? false;
  }

  list(role: string) {
    return this.prisma.rolePermission.findMany({
      where: { role: role as never },
    });
  }
}

