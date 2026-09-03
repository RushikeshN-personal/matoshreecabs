  import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // WEB_ORIGIN may be a comma-separated list (prod domain, www, vercel.app),
  // or "*" to allow any origin. The API is stateless (JWT in the
  // Authorization header, no cookies), so reflecting any origin is safe.
  const originConfig = (process.env.WEB_ORIGIN ?? 'http://localhost:3000').trim();
  const allowedOrigins =
    originConfig === '*'
      ? true
      : originConfig
          .split(',')
          .map((o) => o.trim().replace(/\/$/, ''))
          .filter(Boolean);
  app.enableCors({ origin: allowedOrigins });
  app.setGlobalPrefix('api');
  const config = app.get(ConfigService);
  const port = Number(
    process.env.PORT ?? config.get('IDENTITY_PORT') ?? 4001,
  );
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`[identity] listening on http://localhost:${port}/api`);
}
bootstrap();

