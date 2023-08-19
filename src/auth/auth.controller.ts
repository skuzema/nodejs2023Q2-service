import { Controller, Post, Body, UseGuards, HttpCode } from '@nestjs/common';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Public } from 'src/decorators/public.decorator';
import { AuthService } from './auth.service';
import { MESSAGES } from '../resources/messages';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginDto } from './dto/login-auth.dto';
import { AuthGuard } from './auth.guard';
import { RefreshDto } from './dto/refresh-auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  @ApiCreatedResponse({ description: MESSAGES.ok })
  @ApiBadRequestResponse({ description: MESSAGES.invalidDto })
  async signup(@Body() createAuthDto: CreateUserDto) {
    return await this.authService.signup(createAuthDto);
  }

  @Public()
  @Post('login')
  @HttpCode(200)
  @ApiOkResponse({ description: MESSAGES.ok })
  @ApiBadRequestResponse({ description: MESSAGES.invalidDto })
  @ApiForbiddenResponse({ description: MESSAGES.authFailed })
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @UseGuards(AuthGuard)
  @Post('refresh')
  @HttpCode(200)
  @ApiOkResponse({ description: MESSAGES.ok })
  @ApiBadRequestResponse({ description: MESSAGES.invalidDto })
  @ApiUnauthorizedResponse({ description: MESSAGES.invalidDto })
  @ApiForbiddenResponse({ description: MESSAGES.authFailed })
  @ApiBearerAuth('refresh-token')
  async refresh(@Body() refreshToken: RefreshDto) {
    return this.authService.refresh(refreshToken);
  }
}
