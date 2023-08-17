import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from '../user/dto/update-password.dto';
import { UserEntity } from './entities/user.entity';
import { v4 as uuid } from 'uuid';
import { MESSAGES } from '../resources/messages';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(public prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.user.findMany();
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new HttpException(MESSAGES.recordNotFound, HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async findByLogin(login: string) {
    return await this.prisma.user.findFirstOrThrow({ where: { login: login } });
  }

  async create(newUser: CreateUserDto) {
    const currentTime = Date.now();
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

  async update(id: string, updatedUser: UpdatePasswordDto) {
    const currentTime = Date.now();
    const currentUser = await this.prisma.user.findUnique({ where: { id } });
    if (!currentUser) {
      throw new HttpException(MESSAGES.recordNotFound, HttpStatus.NOT_FOUND);
    }
    if (currentUser.password !== updatedUser.oldPassword) {
      throw new HttpException(MESSAGES.wrongPassword, HttpStatus.FORBIDDEN);
    }
    const updatedUserObj: UserEntity = {
      ...currentUser,
      password: updatedUser.newPassword,
      createdAt: currentUser.createdAt.getTime(),
      updatedAt: currentTime,
    };
    updatedUserObj.version++;
    const prismaUser = await this.prisma.user.update({
      where: { id },
      data: {
        ...updatedUserObj,
        createdAt: new Date(updatedUserObj.createdAt),
        updatedAt: new Date(updatedUserObj.updatedAt),
      },
    });
    return new UserEntity({
      ...prismaUser,
      createdAt: prismaUser.createdAt.getTime(),
      updatedAt: prismaUser.updatedAt.getTime(),
    });
  }

  async remove(id: string) {
    try {
      await this.prisma.user.delete({ where: { id } });
    } catch {
      throw new HttpException(MESSAGES.recordNotFound, HttpStatus.NOT_FOUND);
    }
  }
}
