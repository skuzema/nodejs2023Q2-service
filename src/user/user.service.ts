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

  async create(newUser: CreateUserDto): Promise<UserEntity> {
    const currentTime = Date.now();
    const user: UserEntity = {
      ...newUser,
      id: uuid(),
      version: 1,
      createdAt: new Date(currentTime),
      updatedAt: new Date(currentTime),
    };
    const data = await this.prisma.user.create({
      data: user,
    });
    return new UserEntity(data);
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
      createdAt: new Date(currentTime),
      updatedAt: new Date(currentTime),
    };
    updatedUserObj.version++;
    const prismaUser = await this.prisma.user.update({
      where: { id },
      data: updatedUserObj,
    });
    return prismaUser;
  }

  async remove(id: string) {
    try {
      await this.prisma.user.delete({ where: { id } });
    } catch {
      throw new HttpException(MESSAGES.recordNotFound, HttpStatus.NOT_FOUND);
    }
  }
}
