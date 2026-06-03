import { INestApplication } from '@nestjs/common';
import { DocumentBuilder } from '@nestjs/swagger';
import { setupSwagger } from './swagger.config';

const mockCreateDocument = jest.fn().mockReturnValue({ paths: {} });
const mockSetup = jest.fn();

jest.mock('@nestjs/swagger', () => ({
  DocumentBuilder: jest.fn(() => ({
    setTitle: jest.fn().mockReturnThis(),
    setDescription: jest.fn().mockReturnThis(),
    setVersion: jest.fn().mockReturnThis(),
    addCookieAuth: jest.fn().mockReturnThis(),
    build: jest.fn().mockReturnValue({ openapi: '3.0.0' }),
  })),
  SwaggerModule: {
    get createDocument() {
      return mockCreateDocument;
    },
    get setup() {
      return mockSetup;
    },
  },
}));

describe('setupSwagger', () => {
  it('builds and mounts the swagger document', () => {
    const app = {} as INestApplication;

    setupSwagger(app);

    expect(DocumentBuilder).toHaveBeenCalled();
    expect(mockCreateDocument).toHaveBeenCalledWith(
      app,
      expect.objectContaining({ openapi: '3.0.0' }),
    );
    expect(mockSetup).toHaveBeenCalledWith(
      'api/docs',
      app,
      expect.objectContaining({ paths: {} }),
      expect.objectContaining({ jsonDocumentUrl: 'api/docs-json' }),
    );
  });
});
