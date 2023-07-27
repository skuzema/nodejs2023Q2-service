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
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { StatusCodes } from 'http-status-codes';
import { validate as uuidValidate } from 'uuid';
import { UserEntity } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<UserEntity[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  @HttpCode(StatusCodes.OK)
  async findOne(@Param('id') id: string): Promise<UserEntity | undefined> {
    if (!this.isValidUUID(id)) {
      throw new BadRequestException('Invalid userId');
    }

    const user = this.userService.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @HttpCode(StatusCodes.CREATED)
  async create(@Body() newUser: CreateUserDto): Promise<UserEntity> {
    if (!newUser.login || !newUser.password) {
      throw new BadRequestException('Missing required fields');
    }
    return this.userService.create(newUser);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @HttpCode(StatusCodes.OK)
  async update(
    @Param('id') id: string,
    @Body() update: UpdatePasswordDto,
  ): Promise<UserEntity> {
    if (!this.isValidUUID(id)) {
      throw new BadRequestException('Invalid userId');
    }

    const updatedUser = this.userService.update(id, update);

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

    const deleted = this.userService.remove(id);

    if (!deleted) {
      throw new NotFoundException('User not found');
    }
  }

  private isValidUUID(id: string): boolean {
    return uuidValidate(id);
  }
}
