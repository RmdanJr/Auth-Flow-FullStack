import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

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
    await expect(authService.verifyPassword('Secure1!', hash)).resolves.toBe(true);
    await expect(authService.verifyPassword('WrongPass1!', hash)).resolves.toBe(false);
  });

  it('signs JWT payload', () => {
    const token = authService.signToken({ sub: 'user-id', email: 'user@example.com' });
    expect(token).toBe('signed-token');
    expect(jwtServiceMock.sign).toHaveBeenCalledWith({
      sub: 'user-id',
      email: 'user@example.com',
    });
  });

  it('rejects signin with invalid password', async () => {
    const passwordHash = await bcrypt.hash('Secure1!', 12);
    usersServiceMock.findByEmailWithPassword.mockResolvedValue({
      _id: { toString: () => 'user-id' },
      email: 'user@example.com',
      name: 'Jane',
      password: passwordHash,
    });

    const response = {
      cookie: jest.fn(),
      clearCookie: jest.fn(),
    };

    await expect(
      authService.signin(
        { email: 'user@example.com', password: 'WrongPass1!' },
        response as never,
      ),
    ).rejects.toThrow('Invalid credentials');
  });
});
