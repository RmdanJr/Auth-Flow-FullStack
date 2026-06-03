import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { configureApp } from './app.config';
import { setupSwagger } from './swagger.config';

jest.mock('./swagger.config', () => ({
  setupSwagger: jest.fn(),
}));

describe('configureApp', () => {
  it('registers global middleware, pipes, filters, cors, and swagger', () => {
    const configService = {
      get: jest.fn().mockReturnValue(undefined),
      getOrThrow: jest.fn().mockReturnValue('http://localhost:5173'),
    };
    const app = {
      get: jest.fn().mockReturnValue(configService),
      set: jest.fn(),
      use: jest.fn(),
      useGlobalPipes: jest.fn(),
      useGlobalFilters: jest.fn(),
      useGlobalInterceptors: jest.fn(),
      enableCors: jest.fn(),
    };

    configureApp(app as unknown as INestApplication);

    expect(app.get).toHaveBeenCalledWith(ConfigService);
    expect(app.use).toHaveBeenCalled();
    expect(app.useGlobalPipes).toHaveBeenCalled();
    expect(app.useGlobalFilters).toHaveBeenCalled();
    expect(app.useGlobalInterceptors).toHaveBeenCalled();
    expect(app.enableCors).toHaveBeenCalledWith({
      origin: 'http://localhost:5173',
      credentials: true,
    });
    expect(setupSwagger).toHaveBeenCalledWith(app);
  });
});
