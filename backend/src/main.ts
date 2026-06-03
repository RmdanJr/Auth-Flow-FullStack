import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { MongoExceptionFilter } from './common/filters/mongo-exception.filter';
import { ACCESS_TOKEN_COOKIE } from './auth/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new MongoExceptionFilter());

  app.enableCors({
    origin: configService.getOrThrow<string>('FRONTEND_URL'),
    credentials: true,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Auth Flow API')
    .setDescription(
      'Authentication API. Sign up or sign in to receive an httpOnly JWT cookie (`access_token`). ' +
        'The cookie is sent automatically by the browser on subsequent requests to protected endpoints.',
    )
    .setVersion('1.0')
    .addCookieAuth(ACCESS_TOKEN_COOKIE, {
      type: 'apiKey',
      in: 'cookie',
      name: ACCESS_TOKEN_COOKIE,
    })
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    jsonDocumentUrl: 'api/docs-json',
  });

  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);
}

void bootstrap();
