import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomInt } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { OTP_LENGTH, OTP_TTL_MINUTES, OTP_MAX_ATTEMPTS } from '@matoshreecabs/shared';

@Injectable()
export class OtpService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly email: EmailService,
  ) {}

  private generateCode(): string {
    const code = randomInt(0, 10 ** OTP_LENGTH);
    return code.toString().padStart(OTP_LENGTH, '0');
  }

  /** Create and store a fresh OTP for the email (stored in Postgres, not Redis). */
  async issue(email: string): Promise<string> {
    const code = this.generateCode();
    const ttl = Number(this.config.get('OTP_TTL_MINUTES') ?? OTP_TTL_MINUTES);
    const expiresAt = new Date(Date.now() + ttl * 60_000);

    await this.prisma.otpToken.deleteMany({ where: { email } });
    await this.prisma.otpToken.create({ data: { email, code, expiresAt } });
    await this.email.send({
      to: email,
      subject: 'Your Matoshree Cabs login code',
      text: `Your one-time login code is ${code}. It expires in ${ttl} minutes.`,
    });
    return code;
  }

  /** Validate the latest OTP for the email; throws on any failure. */
  async verify(email: string, code: string): Promise<void> {
    const token = await this.prisma.otpToken.findFirst({
      where: { email },
      orderBy: { createdAt: 'desc' },
    });
    if (!token) throw new BadRequestException('No OTP requested');
    if (token.expiresAt < new Date()) {
      throw new BadRequestException('OTP expired');
    }
    if (token.attempts >= OTP_MAX_ATTEMPTS) {
      throw new BadRequestException('Too many attempts; request a new OTP');
    }
    if (token.code !== code) {
      await this.prisma.otpToken.update({
        where: { id: token.id },
        data: { attempts: { increment: 1 } },
      });
      throw new BadRequestException('Invalid OTP');
    }
    await this.prisma.otpToken.delete({ where: { id: token.id } });
  }
}

