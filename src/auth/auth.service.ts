import { Injectable } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserEntity } from 'src/user/entities/user.entity';
// import { UserService } from 'src/user/user.service';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    // private userService: UserService,
    private prisma: PrismaService, // private jwtService: JwtService,
  ) {}

  async signup(newUser: CreateUserDto) {
    const currentTime = Date.now();
    const passwordHash = await bcrypt.hash(
      newUser.password,
      Number(process.env.CRYPT_SALT || 10),
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
  }
}
