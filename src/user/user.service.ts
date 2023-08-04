import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from '../user/dto/update-password.dto';
import { UserEntity } from './entities/user.entity';
import { v4 as uuid } from 'uuid';
import { MESSAGES } from '../resources/messages';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<UserEntity[]> {
    return await this.prisma.user;
  }

  findOne(id: string): UserEntity {
    const user = this.dbService.users.find((user) => user.id === id);
    if (!user) {
      throw new HttpException(MESSAGES.recordNotFound, HttpStatus.NOT_FOUND);
    }
    return user;
  }

  create(newUser: CreateUserDto) {
    const user: UserEntity = {
      ...newUser,
      id: uuid(),
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.dbService.users.push(user);
    return user;
  }

  update(id: string, updatedUser: UpdatePasswordDto): UserEntity {
    const userIndex = this.dbService.users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      throw new HttpException(MESSAGES.recordNotFound, HttpStatus.NOT_FOUND);
    }
    const currentUser = this.dbService.users[userIndex];
    if (currentUser.password !== updatedUser.oldPassword) {
      throw new HttpException(MESSAGES.wrongPassword, HttpStatus.FORBIDDEN);
    }
    const updatedUserObj: UserEntity = {
      ...currentUser,
      password: updatedUser.newPassword,
      updatedAt: Date.now(),
    };
    updatedUserObj.version++;
    this.dbService.users[userIndex] = updatedUserObj;
    return updatedUserObj;
  }

  async remove(id: string): Promise<boolean> {
    const userIndex = this.dbService.users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      throw new HttpException(MESSAGES.recordNotFound, HttpStatus.NOT_FOUND);
    }

    this.dbService.users.splice(userIndex, 1);
    return true;
  }
}
