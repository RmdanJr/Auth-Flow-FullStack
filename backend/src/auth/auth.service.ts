import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { UsersService } from '../users/users.service';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { ACCESS_TOKEN_COOKIE } from './constants';
import { SigninDto } from './dto/signin.dto';
import { SignupDto } from './dto/signup.dto';
import { JwtPayload } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly bcryptRounds = 12;

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.bcryptRounds);
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  signToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload);
  }

  setAuthCookie(response: Response, token: string): void {
    const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN', '1d');
    const maxAge = this.parseExpiresInMs(expiresIn);

    response.cookie(ACCESS_TOKEN_COOKIE, token, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'lax',
      maxAge,
    });
  }

  clearAuthCookie(response: Response): void {
    response.clearCookie(ACCESS_TOKEN_COOKIE, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'lax',
    });
  }

  async signup(dto: SignupDto, response: Response): Promise<UserResponseDto> {
    this.logger.log(`Signup attempt for ${dto.email}`);

    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await this.hashPassword(dto.password);
    const user = await this.usersService.create({
      email: dto.email.toLowerCase(),
      name: dto.name,
      password: hashedPassword,
    });

    const token = this.signToken({
      sub: user._id.toString(),
      email: user.email,
    });
    this.setAuthCookie(response, token);

    this.logger.log(`Signup successful for ${dto.email}`);
    return this.toUserResponse(user._id.toString(), user.email, user.name);
  }

  async signin(dto: SigninDto, response: Response): Promise<UserResponseDto> {
    this.logger.log(`Signin attempt for ${dto.email}`);

    const user = await this.usersService.findByEmailWithPassword(dto.email);
    if (!user) {
      this.logger.warn(`Signin failed for ${dto.email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await this.verifyPassword(dto.password, user.password);
    if (!valid) {
      this.logger.warn(`Signin failed for ${dto.email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.signToken({
      sub: user._id.toString(),
      email: user.email,
    });
    this.setAuthCookie(response, token);

    this.logger.log(`Signin successful for ${dto.email}`);
    return this.toUserResponse(user._id.toString(), user.email, user.name);
  }

  logout(response: Response): void {
    this.logger.log('User logged out');
    this.clearAuthCookie(response);
  }

  toUserResponse(id: string, email: string, name: string): UserResponseDto {
    return { id, email, name };
  }

  private parseExpiresInMs(expiresIn: string): number {
    const match = /^(\d+)([smhd])$/.exec(expiresIn);
    if (!match) {
      return 24 * 60 * 60 * 1000;
    }

    const value = Number(match[1]);
    const unit = match[2];
    const multipliers: Record<string, number> = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
    };
    return value * multipliers[unit];
  }
}
