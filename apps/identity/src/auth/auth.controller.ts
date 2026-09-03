import { Body, Controller, Get, Post, UseGuards, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthService } from './auth.service';
import {
  registerSchema,
  requestOtpSchema,
  verifyOtpSchema,
  passwordLoginSchema,
} from '@matoshreecabs/shared';
import type {
  RegisterInput,
  RequestOtpInput,
  VerifyOtpInput,
  PasswordLoginInput,
  JwtPayload,
} from '@matoshreecabs/shared';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  @UsePipes(new ZodValidationPipe(registerSchema))
  register(@Body() body: RegisterInput) {
    return this.auth.register(body);
  }

  @Post('otp/request')
  @UsePipes(new ZodValidationPipe(requestOtpSchema))
  requestOtp(@Body() body: RequestOtpInput) {
    return this.auth.requestOtp(body.email);
  }

  @Post('otp/verify')
  @UsePipes(new ZodValidationPipe(verifyOtpSchema))
  verifyOtp(@Body() body: VerifyOtpInput) {
    return this.auth.loginWithOtp(body);
  }

  @Post('login')
  @UsePipes(new ZodValidationPipe(passwordLoginSchema))
  login(@Body() body: PasswordLoginInput) {
    return this.auth.loginWithPassword(body);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: JwtPayload) {
    return user;
  }
}

