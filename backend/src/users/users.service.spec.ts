import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';

describe('UsersService', () => {
  let usersService: UsersService;

  const execMock = jest.fn();
  const selectMock = jest.fn().mockReturnValue({ exec: execMock });
  const findOneMock = jest.fn().mockReturnValue({
    select: selectMock,
    exec: execMock,
  });
  const findByIdMock = jest.fn().mockReturnValue({ exec: execMock });
  const createMock = jest.fn();

  const userModelMock = {
    create: createMock,
    findOne: findOneMock,
    findById: findByIdMock,
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getModelToken(User.name), useValue: userModelMock },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
  });

  it('creates a user', async () => {
    const user = { email: 'user@example.com', name: 'Jane', password: 'hash' };
    createMock.mockResolvedValue(user);

    await expect(usersService.create(user)).resolves.toEqual(user);
    expect(createMock).toHaveBeenCalledWith(user);
  });

  it('finds user by email (lowercased)', async () => {
    execMock.mockResolvedValue({ email: 'user@example.com' });

    await usersService.findByEmail('User@Example.com');

    expect(findOneMock).toHaveBeenCalledWith({ email: 'user@example.com' });
  });

  it('finds user by email with password field', async () => {
    execMock.mockResolvedValue({ email: 'user@example.com', password: 'hash' });

    await usersService.findByEmailWithPassword('User@Example.com');

    expect(findOneMock).toHaveBeenCalledWith({ email: 'user@example.com' });
    expect(selectMock).toHaveBeenCalledWith('+password');
  });

  it('finds user by id', async () => {
    execMock.mockResolvedValue({ _id: 'abc123' });

    await usersService.findById('abc123');

    expect(findByIdMock).toHaveBeenCalledWith('abc123');
  });
});
