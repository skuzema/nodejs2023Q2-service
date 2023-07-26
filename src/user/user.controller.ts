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
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../interfaces';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { StatusCodes } from 'http-status-codes';
import { validate as uuidValidate } from 'uuid';

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
    if (!this.isValidUUID(id)) {
      throw new BadRequestException('Invalid userId');
    }

    const user = this.userService.getUserById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @HttpCode(StatusCodes.CREATED)
  createUser(@Body() newUser: CreateUserDto): User {
    if (!newUser.login || !newUser.password) {
      throw new BadRequestException('Missing required fields');
    }
    return this.userService.createUser(newUser);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @HttpCode(StatusCodes.OK)
  updateUser(@Param('id') id: string, @Body() update: UpdatePasswordDto): User {
    if (!this.isValidUUID(id)) {
      throw new BadRequestException('Invalid userId');
    }

    const updatedUser = this.userService.updateUser(id, update);

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    return updatedUser;
  }

  @Delete(':id')
  @HttpCode(StatusCodes.NO_CONTENT)
  deleteUser(@Param('id') id: string): void {
    if (!this.isValidUUID(id)) {
      throw new BadRequestException('Invalid userId');
    }

    const deleted = this.userService.deleteUser(id);

    if (!deleted) {
      throw new NotFoundException('User not found');
    }
  }

  private isValidUUID(id: string): boolean {
    return uuidValidate(id);
  }
}
