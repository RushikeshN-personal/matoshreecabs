import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateUserData {
  name: string;
  email: string;
  mobile: string;
  role: string;
  passwordHash: string | null;
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  create(data: CreateUserData) {
    return this.prisma.user.create({
      data: { ...data, role: data.role as never },
    });
  }
}

