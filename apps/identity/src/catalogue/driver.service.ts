import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { ROLES, APP_NAME } from '@matoshreecabs/shared';
import type { DriverCreateInput, DriverUpdateInput } from '@matoshreecabs/shared';

// Readable-ish random password: mixed case + digits, no ambiguous chars.
function generatePassword(length = 10): string {
  const alphabet = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  const bytes = randomBytes(length);
  let out = '';
  for (let i = 0; i < length; i++) out += alphabet[bytes[i] % alphabet.length];
  return out;
}

@Injectable()
export class DriverService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly email: EmailService,
  ) {}

  list() {
    return this.prisma.driverProfile.findMany({
      include: {
        user: { select: { name: true, email: true, mobile: true, status: true } },
      },
    });
  }

  // Creates the driver's account with a freshly generated password, emailed
  // to them — admin never sees or types the password.
  async create(input: DriverCreateInput) {
    const existing = await this.prisma.user.findUnique({
      where: { email: input.email },
    });
    if (existing) throw new ConflictException('Email already in use');

    const tempPassword = generatePassword();
    const passwordHash = await bcrypt.hash(tempPassword, 10);
    const user = await this.prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        mobile: input.mobile,
        role: ROLES.DRIVER,
        passwordHash,
        driverProfile: {
          create: {
            licenceNo: input.licenceNo,
            location: input.location,
            languages: input.languages,
            experienceYrs: input.experienceYrs,
            assignedCabId: input.assignedCabId,
          },
        },
      },
      include: { driverProfile: true },
    });

    await this.sendWelcomeEmail(input.name, input.email, tempPassword);

    const { passwordHash: _omit, ...safe } = user;
    return safe;
  }

  private async sendWelcomeEmail(name: string, email: string, tempPassword: string) {
    await this.email.send({
      to: email,
      subject: `Your ${APP_NAME} driver account is ready`,
      text:
        `Hi ${name},\n\n` +
        `Your driver account has been created.\n\n` +
        `Login email: ${email}\n` +
        `Temporary password: ${tempPassword}\n\n` +
        `Please log in and change your password as soon as you can.\n\n` +
        `— ${APP_NAME}`,
    });
  }

  async update(userId: string, input: DriverUpdateInput) {
    await this.ensureExists(userId);
    return this.prisma.driverProfile.update({ where: { userId }, data: input });
  }

  async deactivate(userId: string) {
    await this.ensureExists(userId);
    await this.prisma.user.update({
      where: { id: userId },
      data: { status: 'DISABLED' },
    });
    return this.prisma.driverProfile.update({
      where: { userId },
      data: { status: 'DISABLED' },
    });
  }

  private async ensureExists(userId: string) {
    const p = await this.prisma.driverProfile.findUnique({ where: { userId } });
    if (!p) throw new NotFoundException('Driver not found');
  }
}
