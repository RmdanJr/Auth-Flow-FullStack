import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configureApp } from './config/app.config';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  configureApp(app);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);
  await app.listen(port, '0.0.0.0');
  logger.log(`Auth Flow API listening on 0.0.0.0:${port}`);
  logger.log(`Swagger UI available at /api/docs`);
}

void bootstrap();
