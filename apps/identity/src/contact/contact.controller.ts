import { Body, Controller, Post } from '@nestjs/common';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { ContactService } from './contact.service';
import { contactSchema } from '@matoshreecabs/shared';
import type { ContactInput } from '@matoshreecabs/shared';

@Controller('contact')
export class ContactController {
  constructor(private readonly contact: ContactService) {}

  @Post()
  submit(@Body(new ZodValidationPipe(contactSchema)) body: ContactInput) {
    return this.contact.create(body).then(() => ({ ok: true }));
  }
}