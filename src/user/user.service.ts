import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from '../user/dto/update-password.dto';
import { DatabaseService } from '../database/database.service';
import { UserEntity } from './entities/user.entity';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UserService {
  constructor(private readonly dbService: DatabaseService) {}

  async findAll(): Promise<UserEntity[]> {
    return this.dbService.users;
  }

  async findOne(id: string): Promise<UserEntity> {
    return this.dbService.users.find((user) => user.id === id);
  }

  async create(newUser: CreateUserDto): Promise<UserEntity> {
    const user: UserEntity = {
      ...newUser,
      id: uuid(),
      version: this.dbService.getVersion(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.dbService.users.push(user);
    return user;
  }

  async update(
    id: string,
    updatedUser: UpdatePasswordDto,
  ): Promise<UserEntity | undefined> {
    const userIndex = this.dbService.users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      return undefined;
    }

    const currentUser = this.dbService.users[userIndex];
    const updatedUserObj: UserEntity = {
      ...currentUser,
      password: updatedUser.newPassword,
      updatedAt: Date.now(),
    };

    this.dbService.users[userIndex] = updatedUserObj;
    return updatedUserObj;
  }

  async remove(id: string): Promise<boolean> {
    const userIndex = this.dbService.users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      return false;
    }

    this.dbService.users.splice(userIndex, 1);
    return true;
  }
}
