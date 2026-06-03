import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { setupSwagger } from './swagger.config';

jest.mock('@nestjs/swagger', () => {
  const builder = {
    setTitle: jest.fn().mockReturnThis(),
    setDescription: jest.fn().mockReturnThis(),
    setVersion: jest.fn().mockReturnThis(),
    addCookieAuth: jest.fn().mockReturnThis(),
    build: jest.fn().mockReturnValue({ openapi: '3.0.0' }),
  };

  return {
    DocumentBuilder: jest.fn(() => builder),
    SwaggerModule: {
      createDocument: jest.fn().mockReturnValue({ paths: {} }),
      setup: jest.fn(),
    },
  };
});

describe('setupSwagger', () => {
  it('builds and mounts the swagger document', () => {
    const app = {} as INestApplication;

    setupSwagger(app);

    expect(DocumentBuilder).toHaveBeenCalled();
    expect(SwaggerModule.createDocument).toHaveBeenCalledWith(
      app,
      expect.objectContaining({ openapi: '3.0.0' }),
    );
    expect(SwaggerModule.setup).toHaveBeenCalledWith(
      'api/docs',
      app,
      expect.objectContaining({ paths: {} }),
      expect.objectContaining({ jsonDocumentUrl: 'api/docs-json' }),
    );
  });
});
