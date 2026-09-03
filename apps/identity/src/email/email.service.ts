import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

interface SendMailInput {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter | null = null;
  private readonly from: string;

  constructor(private readonly config: ConfigService) {
    const host = this.config.get<string>('SMTP_HOST');
    const port = Number(this.config.get<string>('SMTP_PORT') ?? 587);
    const user = this.config.get<string>('SMTP_USER');
    const pass = this.config.get<string>('SMTP_PASS');
    this.from = this.config.get<string>('SMTP_FROM') ?? user ?? 'no-reply@matoshreecabs.local';

    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });
    }
  }

  /**
   * Sends an email if SMTP is configured (SMTP_HOST/USER/PASS in .env);
   * otherwise logs it so nothing is silently lost in local development.
   */
  async send(input: SendMailInput): Promise<void> {
    if (!this.transporter) {
      this.logger.warn(
        `SMTP not configured — email NOT sent. To: ${input.to} | Subject: ${input.subject}\n${input.text}`,
      );
      return;
    }
    try {
      await this.transporter.sendMail({
        from: this.from,
        to: input.to,
        subject: input.subject,
        text: input.text,
        html: input.html,
      });
    } catch (err) {
      // Email failing should never break the booking/driver-creation flow itself.
      this.logger.error(`Failed to send email to ${input.to}: ${(err as Error).message}`);
    }
  }
}
