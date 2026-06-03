import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { MongoExceptionFilter } from '../src/common/filters/mongo-exception.filter';

describe('Auth Flow (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
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
      origin: process.env.FRONTEND_URL ?? 'http://localhost:5173',
      credentials: true,
    });
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /auth/signup then GET /users/me with cookie', async () => {
    const agent = request.agent(app.getHttpServer());

    const signupResponse = await agent.post('/auth/signup').send({
      email: 'e2e@example.com',
      name: 'E2E User',
      password: 'Secure1!',
    });

    expect(signupResponse.status).toBe(201);
    expect(signupResponse.body).toMatchObject({
      email: 'e2e@example.com',
      name: 'E2E User',
    });

    const meResponse = await agent.get('/users/me');
    expect(meResponse.status).toBe(200);
    expect(meResponse.body).toMatchObject({ email: 'e2e@example.com' });
  });

  it('GET /users/me without cookie returns 401', async () => {
    const response = await request(app.getHttpServer()).get('/users/me');
    expect(response.status).toBe(401);
  });

  it('POST /auth/signup duplicate email returns 409', async () => {
    const payload = {
      email: 'duplicate@example.com',
      name: 'Duplicate User',
      password: 'Secure1!',
    };

    await request(app.getHttpServer())
      .post('/auth/signup')
      .send(payload)
      .expect(201);
    const duplicate = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(payload);
    expect(duplicate.status).toBe(409);
  });
});
