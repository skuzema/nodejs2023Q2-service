import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { UpdatePasswordDto } from '../user/dto/update-password.dto';
import { DatabaseService } from '../database/database.service';
import { User } from '../interfaces';

@Injectable()
export class UserService {
  constructor(private readonly dbService: DatabaseService) {}

  getAllUsers(): User[] {
    return this.dbService.getAllUsers();
  }

  getUserById(id: string): User | undefined {
    return this.dbService.getUserById(id);
  }

  createUser(newUser: CreateUserDto): UserDto {
    return this.dbService.createUser(newUser);
  }

  updateUser(id: string, update: UpdatePasswordDto): UserDto | undefined {
    return this.dbService.updateUser(id, update);
  }

  deleteUser(id: string): boolean {
    return this.dbService.deleteUser(id);
  }
}
