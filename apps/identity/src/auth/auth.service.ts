import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { OtpService } from './otp.service';
import { ROLES } from '@matoshreecabs/shared';
import type {
  AuthResult,
  RegisterInput,
  PasswordLoginInput,
  VerifyOtpInput,
} from '@matoshreecabs/shared';

const BCRYPT_ROUNDS = 10;

interface UserRecord {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: string;
  passwordHash: string | null;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly otp: OtpService,
    private readonly jwt: JwtService,
  ) {}

  async register(input: RegisterInput): Promise<{ id: string }> {
    const existing = await this.users.findByEmail(input.email);
    if (existing) throw new ConflictException('Email already registered');

    const passwordHash = input.password
      ? await bcrypt.hash(input.password, BCRYPT_ROUNDS)
      : null;

    const user = await this.users.create({
      name: input.name,
      email: input.email,
      mobile: input.mobile,
      role: ROLES.CUSTOMER,
      passwordHash,
    });
    return { id: user.id };
  }

  async requestOtp(
    email: string,
  ): Promise<{ sent: boolean; devCode?: string }> {
    const code = await this.otp.issue(email);
    const isProd = process.env.NODE_ENV === 'production';
    return { sent: true, devCode: isProd ? undefined : code };
  }

  async loginWithOtp(input: VerifyOtpInput): Promise<AuthResult> {
    await this.otp.verify(input.email, input.otp);
    const user = await this.users.findByEmail(input.email);
    if (!user) throw new UnauthorizedException('Account not found');
    return this.buildResult(user);
  }

  async loginWithPassword(input: PasswordLoginInput): Promise<AuthResult> {
    const user = await this.users.findByEmail(input.email);
    if (!user?.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const ok = await bcrypt.compare(input.password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    return this.buildResult(user);
  }

  private buildResult(user: UserRecord): AuthResult {
    const accessToken = this.jwt.sign({
      sub: user.id,
      role: user.role,
      email: user.email,
    });
    return {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role as never,
      },
    };
  }
}

