import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { MongoExceptionFilter } from '../src/common/filters/mongo-exception.filter';
import { LoggingInterceptor } from '../src/common/interceptors/logging.interceptor';

describe('Auth Flow (e2e)', () => {
  let app: INestApplication<App>;

  const uniqueEmail = (label: string) =>
    `${label}-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`;

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
    app.useGlobalInterceptors(new LoggingInterceptor());
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
    const email = uniqueEmail('e2e');
    const agent = request.agent(app.getHttpServer());

    const signupResponse = await agent.post('/auth/signup').send({
      email,
      name: 'E2E User',
      password: 'Secure1!',
    });

    expect(signupResponse.status).toBe(201);
    expect(signupResponse.body).toMatchObject({
      email,
      name: 'E2E User',
    });

    const meResponse = await agent.get('/users/me');
    expect(meResponse.status).toBe(200);
    expect(meResponse.body).toMatchObject({ email });
  });

  it('POST /auth/signin with valid credentials', async () => {
    const email = uniqueEmail('signin');
    await request(app.getHttpServer()).post('/auth/signup').send({
      email,
      name: 'Sign In User',
      password: 'Secure1!',
    });

    const agent = request.agent(app.getHttpServer());
    const signinResponse = await agent.post('/auth/signin').send({
      email,
      password: 'Secure1!',
    });

    expect(signinResponse.status).toBe(200);
    expect(signinResponse.body).toMatchObject({ email });

    const meResponse = await agent.get('/users/me');
    expect(meResponse.status).toBe(200);
  });

  it('POST /auth/signin with wrong password returns 401', async () => {
    const email = uniqueEmail('wrongpass');
    await request(app.getHttpServer()).post('/auth/signup').send({
      email,
      name: 'Wrong Pass User',
      password: 'Secure1!',
    });

    const response = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email, password: 'WrongPass1!' });

    expect(response.status).toBe(401);
  });

  it('POST /auth/logout clears session', async () => {
    const agent = request.agent(app.getHttpServer());

    await agent.post('/auth/signup').send({
      email: uniqueEmail('logout'),
      name: 'Logout User',
      password: 'Secure1!',
    });

    await agent.post('/auth/logout').expect(204);
    await agent.get('/users/me').expect(401);
  });

  it('GET /users/me without cookie returns 401', async () => {
    const response = await request(app.getHttpServer()).get('/users/me');
    expect(response.status).toBe(401);
  });

  it('POST /auth/signup duplicate email returns 409', async () => {
    const email = uniqueEmail('duplicate');
    const payload = {
      email,
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

  it('POST /auth/signup rejects invalid payload', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: 'not-an-email', name: 'X', password: 'short' });

    expect(response.status).toBe(400);
  });
});
