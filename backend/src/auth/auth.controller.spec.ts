import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  const authServiceMock = {
    signup: jest.fn(),
    signin: jest.fn(),
    logout: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('delegates signup to AuthService', async () => {
    const dto = {
      email: 'user@example.com',
      name: 'Jane',
      password: 'Secure1!',
    };
    const response = { cookie: jest.fn() } as never;
    authServiceMock.signup.mockResolvedValue({ id: '1', ...dto });

    await controller.signup(dto, response);

    expect(authServiceMock.signup).toHaveBeenCalledWith(dto, response);
  });

  it('delegates signin to AuthService', async () => {
    const dto = { email: 'user@example.com', password: 'Secure1!' };
    const response = { cookie: jest.fn() } as never;
    authServiceMock.signin.mockResolvedValue({
      id: '1',
      email: dto.email,
      name: 'Jane',
    });

    await controller.signin(dto, response);

    expect(authServiceMock.signin).toHaveBeenCalledWith(dto, response);
  });

  it('delegates logout to AuthService', () => {
    const response = { clearCookie: jest.fn() } as never;

    controller.logout(response);

    expect(authServiceMock.logout).toHaveBeenCalledWith(response);
  });
});
