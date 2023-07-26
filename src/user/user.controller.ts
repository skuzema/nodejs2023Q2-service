import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../interfaces';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { StatusCodes } from 'http-status-codes';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getAllUsers(): User[] {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  @HttpCode(StatusCodes.OK)
  getUserById(@Param('id') id: string): User | undefined {
    const user = this.userService.getUserById(id);

    if (!id || !this.isValidUUID(id)) {
      throw new BadRequestException('Invalid userId');
    }

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  @Post()
  createUser(@Body() newUser: CreateUserDto): User {
    return this.userService.createUser(newUser);
  }

  @Put(':id')
  updateUser(
    @Param('id') id: string,
    @Body() update: UpdatePasswordDto,
  ): User | undefined {
    return this.userService.updateUser(id, update);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string): boolean {
    return this.userService.deleteUser(id);
  }

  private isValidUUID(id: string): boolean {
    // You can implement your UUID validation logic here, e.g., using a regular expression or any other method
    // For demonstration purposes, we'll assume any non-empty string is valid
    return id && typeof id === 'string' && id.trim().length > 0;
  }
}
