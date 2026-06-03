import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { ACCESS_TOKEN_COOKIE } from './constants';

describe('AuthService', () => {
  let authService: AuthService;

  const usersServiceMock = {
    findByEmail: jest.fn(),
    findByEmailWithPassword: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
  };

  const jwtServiceMock = {
    sign: jest.fn().mockReturnValue('signed-token'),
  };

  const configServiceMock = {
    get: jest.fn((key: string, defaultValue?: string) => {
      const values: Record<string, string> = {
        JWT_EXPIRES_IN: '1d',
        NODE_ENV: 'test',
      };
      return values[key] ?? defaultValue;
    }),
    getOrThrow: jest.fn(),
  };

  const createResponse = () => ({
    cookie: jest.fn(),
    clearCookie: jest.fn(),
  });

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersServiceMock },
        { provide: JwtService, useValue: jwtServiceMock },
        { provide: ConfigService, useValue: configServiceMock },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('hashes and verifies passwords', async () => {
    const hash = await authService.hashPassword('Secure1!');
    expect(hash).not.toBe('Secure1!');
    await expect(authService.verifyPassword('Secure1!', hash)).resolves.toBe(
      true,
    );
    await expect(authService.verifyPassword('WrongPass1!', hash)).resolves.toBe(
      false,
    );
  });

  it('signs JWT payload', () => {
    const token = authService.signToken({
      sub: 'user-id',
      email: 'user@example.com',
    });
    expect(token).toBe('signed-token');
    expect(jwtServiceMock.sign).toHaveBeenCalledWith({
      sub: 'user-id',
      email: 'user@example.com',
    });
  });

  it('registers a new user without setting auth cookie', async () => {
    usersServiceMock.findByEmail.mockResolvedValue(null);
    usersServiceMock.create.mockResolvedValue({
      _id: { toString: () => 'user-id' },
      email: 'user@example.com',
      name: 'Jane',
    });

    const result = await authService.signup({
      email: 'User@Example.com',
      name: 'Jane',
      password: 'Secure1!',
    });

    expect(result).toEqual({
      id: 'user-id',
      email: 'user@example.com',
      name: 'Jane',
    });
    expect(usersServiceMock.create).toHaveBeenCalledWith(
      expect.objectContaining({ email: 'user@example.com', name: 'Jane' }),
    );
    expect(jwtServiceMock.sign).not.toHaveBeenCalled();
  });

  it('rejects signup when email is already registered', async () => {
    usersServiceMock.findByEmail.mockResolvedValue({
      email: 'user@example.com',
    });

    await expect(
      authService.signup({
        email: 'user@example.com',
        name: 'Jane',
        password: 'Secure1!',
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('signs in with valid credentials', async () => {
    const passwordHash = await bcrypt.hash('Secure1!', 12);
    usersServiceMock.findByEmailWithPassword.mockResolvedValue({
      _id: { toString: () => 'user-id' },
      email: 'user@example.com',
      name: 'Jane',
      password: passwordHash,
    });

    const response = createResponse();
    const result = await authService.signin(
      { email: 'user@example.com', password: 'Secure1!' },
      response as never,
    );

    expect(result.email).toBe('user@example.com');
    expect(response.cookie).toHaveBeenCalled();
  });

  it('rejects signin when user is not found', async () => {
    usersServiceMock.findByEmailWithPassword.mockResolvedValue(null);

    await expect(
      authService.signin(
        { email: 'missing@example.com', password: 'Secure1!' },
        createResponse() as never,
      ),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('rejects signin with invalid password', async () => {
    const passwordHash = await bcrypt.hash('Secure1!', 12);
    usersServiceMock.findByEmailWithPassword.mockResolvedValue({
      _id: { toString: () => 'user-id' },
      email: 'user@example.com',
      name: 'Jane',
      password: passwordHash,
    });

    await expect(
      authService.signin(
        { email: 'user@example.com', password: 'WrongPass1!' },
        createResponse() as never,
      ),
    ).rejects.toThrow('Invalid credentials');
  });

  it('clears auth cookie on logout', () => {
    const response = createResponse();

    authService.logout(response as never);

    expect(response.clearCookie).toHaveBeenCalledWith(
      ACCESS_TOKEN_COOKIE,
      expect.objectContaining({ httpOnly: true }),
    );
  });

  it('sets secure cookie in production on signin', async () => {
    configServiceMock.get.mockImplementation((key: string) => {
      if (key === 'NODE_ENV') return 'production';
      if (key === 'JWT_EXPIRES_IN') return '2h';
      return undefined;
    });

    const passwordHash = await bcrypt.hash('Secure1!', 12);
    usersServiceMock.findByEmailWithPassword.mockResolvedValue({
      _id: { toString: () => 'user-id' },
      email: 'user@example.com',
      name: 'Jane',
      password: passwordHash,
    });

    const response = createResponse();
    await authService.signin(
      { email: 'user@example.com', password: 'Secure1!' },
      response as never,
    );

    expect(response.cookie).toHaveBeenCalledWith(
      ACCESS_TOKEN_COOKIE,
      'signed-token',
      expect.objectContaining({
        secure: true,
        sameSite: 'none',
        maxAge: 2 * 60 * 60 * 1000,
      }),
    );
  });
});
