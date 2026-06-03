import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../users/users.service';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  const usersServiceMock = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: { getOrThrow: jest.fn().mockReturnValue('test-secret') },
        },
        { provide: UsersService, useValue: usersServiceMock },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  it('returns user profile when user exists', async () => {
    usersServiceMock.findById.mockResolvedValue({
      _id: { toString: () => 'user-id' },
      email: 'user@example.com',
      name: 'Jane',
    });

    await expect(
      strategy.validate({ sub: 'user-id', email: 'user@example.com' }),
    ).resolves.toEqual({
      id: 'user-id',
      email: 'user@example.com',
      name: 'Jane',
    });
  });

  it('throws when user no longer exists', async () => {
    usersServiceMock.findById.mockResolvedValue(null);

    await expect(
      strategy.validate({ sub: 'missing-id', email: 'user@example.com' }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
