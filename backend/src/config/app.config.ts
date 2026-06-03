import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import { MongoExceptionFilter } from '../common/filters/mongo-exception.filter';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { setupSwagger } from '../config/swagger.config';

export function configureApp(app: INestApplication): void {
  const configService = app.get(ConfigService);
  const isProduction = configService.get<string>('NODE_ENV') === 'production';

  if (isProduction) {
    (app as NestExpressApplication).set('trust proxy', 1);
  }

  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new MongoExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  app.enableCors({
    origin: configService.getOrThrow<string>('FRONTEND_URL'),
    credentials: true,
  });

  setupSwagger(app);
}
