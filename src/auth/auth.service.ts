import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { JwtPayload } from 'jsonwebtoken';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from '../user/user.service';
import { v4 as uuid } from 'uuid';
import { LoginDto } from './dto/login-auth.dto';
import { MESSAGES } from 'src/resources/messages';
import { Token } from './dto/token-auth.dto';
import { Payload } from './dto/payload-auth.dto';
import {
  CRYPT_SALT,
  JWT_SECRET_KEY,
  JWT_SECRET_REFRESH_KEY,
  TOKEN_EXPIRE_TIME,
  TOKEN_REFRESH_EXPIRE_TIME,
} from '../resources/constants';
import { RefreshDto } from './dto/refresh-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signup(newUser: CreateUserDto) {
    try {
      const currentTime = Date.now();
      const passwordHash = await bcrypt.hash(
        newUser.password,
        Number(CRYPT_SALT || 10),
      );
      const user: UserEntity = {
        ...newUser,
        id: uuid(),
        version: 1,
        createdAt: currentTime,
        updatedAt: currentTime,
      };
      const data = await this.prisma.user.create({
        data: {
          ...user,
          password: passwordHash,
          createdAt: new Date(user.createdAt),
          updatedAt: new Date(user.updatedAt),
        },
      });
      const newUserEntity = new UserEntity({
        ...data,
        createdAt: data.createdAt.getTime(),
        updatedAt: data.updatedAt.getTime(),
      });
      return newUserEntity;
    } catch (err) {
      throw new BadRequestException(MESSAGES.invalidDto);
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const user = await this.userService.findByLogin(loginDto.login);
      if (user && (await bcrypt.compare(loginDto.password, user.password))) {
        const { accessToken, refreshToken } = await this.getTokens(
          user.id,
          user.login,
        );
        return { accessToken, refreshToken };
      } else {
        throw new UnauthorizedException(MESSAGES.authFailed);
      }
    } catch (err) {
      throw new UnauthorizedException(MESSAGES.authFailed);
    }
  }

  async refresh(refreshToken: RefreshDto) {
    try {
      const { userId, login } = await this.validateToken(
        refreshToken.refreshToken,
      );
      const tokens = await this.getTokens(userId, login);
      return tokens;
    } catch (err) {
      throw new UnauthorizedException(MESSAGES.authFailed);
    }
  }

  async validateToken(token: string): Promise<Payload> {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: JWT_SECRET_KEY,
      });
    } catch (err) {
      throw new ForbiddenException(MESSAGES.authFailed);
    }
  }

  async getTokens(userId: string, login: string): Promise<Token> {
    const payload: JwtPayload = { userId, login };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: JWT_SECRET_KEY,
        expiresIn: TOKEN_EXPIRE_TIME,
      }),
      this.jwtService.signAsync(payload, {
        secret: JWT_SECRET_REFRESH_KEY,
        expiresIn: TOKEN_REFRESH_EXPIRE_TIME,
      }),
    ]);

    return new Token(accessToken, refreshToken);
  }
}
