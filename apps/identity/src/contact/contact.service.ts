import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { ContactInput } from '@matoshreecabs/shared';

@Injectable()
export class ContactService {
  constructor(private readonly prisma: PrismaService) {}

  create(input: ContactInput) {
    return this.prisma.contactEnquiry.create({
      data: {
        name: input.name,
        mobile: input.mobile,
        email: input.email || null,
        subject: input.subject,
        message: input.message,
      },
    });
  }

  list() {
    return this.prisma.contactEnquiry.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  markStatus(id: string, status: 'NEW' | 'READ' | 'RESOLVED') {
    return this.prisma.contactEnquiry.update({ where: { id }, data: { status } });
  }
}