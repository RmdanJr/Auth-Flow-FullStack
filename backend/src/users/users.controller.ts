import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserResponseDto } from './dto/user-response.dto';

interface AuthenticatedRequest extends Request {
  user: UserResponseDto;
}

@ApiTags('users')
@ApiCookieAuth('access_token')
@Controller('users')
export class UsersController {
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current authenticated user' })
  @ApiOkResponse({ type: UserResponseDto })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  getMe(@Req() request: AuthenticatedRequest): UserResponseDto {
    return request.user;
  }
}
