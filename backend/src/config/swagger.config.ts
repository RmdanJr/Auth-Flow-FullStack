import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ACCESS_TOKEN_COOKIE } from '../auth/constants';

export function setupSwagger(app: INestApplication): void {
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
}
