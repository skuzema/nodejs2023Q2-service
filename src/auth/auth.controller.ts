import { Controller, Post, Body } from '@nestjs/common';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { Public } from 'src/decorators/public.decorator';
import { AuthService } from './auth.service';
import { MESSAGES } from '../resources/messages';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginDto } from './dto/login-user.dto';

@ApiTags('auth')
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
  @ApiOkResponse({ description: MESSAGES.ok })
  @ApiBadRequestResponse({ description: MESSAGES.invalidDto })
  @ApiForbiddenResponse({ description: MESSAGES.authFailed })
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }
}
