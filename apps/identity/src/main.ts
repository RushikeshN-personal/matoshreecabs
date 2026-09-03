  import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // WEB_ORIGIN may be a comma-separated list (prod domain, www, vercel.app).
  const allowedOrigins = (process.env.WEB_ORIGIN ?? 'http://localhost:3000')
    .split(',')
    .map((o) => o.trim())
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

