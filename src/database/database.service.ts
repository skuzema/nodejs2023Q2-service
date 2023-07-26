// src/services/database.service.ts

import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { User, Artist, Album, Track, Favorites } from '../interfaces';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UpdatePasswordDto } from '../user/dto/update-password.dto';

@Injectable()
export class DatabaseService {
  private users: User[] = [];
  private artists: Artist[] = [];
  private albums: Album[] = [];
  private tracks: Track[] = [];
  private favorites: Favorites[] = [];
  private version = 0;

  getAllUsers(): User[] {
    return this.users;
  }

  getUserById(id: string): User | undefined {
    return this.users.find((user) => user.id === id);
  }

  createUser(newUser: CreateUserDto): User {
    const user: User = {
      ...newUser,
      id: uuid(),
      version: this.version++,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.users.push(user);
    return user;
  }

  updateUser(id: string, updatedUser: UpdatePasswordDto): User | undefined {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      return undefined;
    }

    const currentUser = this.users[userIndex];
    const updatedUserObj: User = {
      ...currentUser,
      password: updatedUser.newPassword,
      updatedAt: Date.now(),
    };

    this.users[userIndex] = updatedUserObj;
    return updatedUserObj;
  }

  deleteUser(id: string): boolean {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      return false;
    }

    this.users.splice(userIndex, 1);
    return true;
  }
}
