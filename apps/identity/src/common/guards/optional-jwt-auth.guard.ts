import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

// Decodes the bearer token when present (so a logged-in customer's booking
// is linked to their account) but never rejects the request — booking does
// not require login.
@Injectable()
export class OptionalJwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest();
    const header: string | undefined = req.headers['authorization'];
    if (header?.startsWith('Bearer ')) {
      try {
        req.user = this.jwt.verify(header.slice(7), {
          secret: this.config.get('JWT_SECRET'),
        });
      } catch {
        // ignore — treat as a guest request
      }
    }
    return true;
  }
}
