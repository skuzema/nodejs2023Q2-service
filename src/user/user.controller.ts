import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  NotFoundException,
  UsePipes,
  ValidationPipe,
  ParseUUIDPipe,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { StatusCodes } from 'http-status-codes';
import { MESSAGES } from '../resources/messages';
import { UserEntity } from './entities/user.entity';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<UserEntity[]> {
    return await this.userService.findAll();
  }

  @Get(':id')
  @HttpCode(StatusCodes.OK)
  @ApiNotFoundResponse({ description: MESSAGES.userNotFound })
  @ApiBadRequestResponse({ description: MESSAGES.invalidUserId })
  async findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<UserEntity> {
    try {
      return await this.userService.findOne(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @ApiCreatedResponse({ description: MESSAGES.userSuccessfullyCreated })
  @ApiBadRequestResponse({
    description: MESSAGES.missingRequiredFields,
  })
  async create(@Body() newUser: CreateUserDto): Promise<UserEntity> {
    return await this.userService.create(newUser);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @ApiBadRequestResponse({ description: MESSAGES.invalidUserId })
  @ApiNotFoundResponse({ description: MESSAGES.userNotFound })
  @ApiForbiddenResponse({ description: MESSAGES.oldPasswordIsWrong })
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() update: UpdatePasswordDto,
  ): Promise<UserEntity> {
    try {
      return await this.userService.update(id, update);
    } catch (error) {
      if (error instanceof Error && error.message === 'entity not found') {
        throw new NotFoundException(error.message);
      }
      throw new ForbiddenException(error.message);
    }
  }

  @Delete(':id')
  @HttpCode(StatusCodes.NO_CONTENT)
  @ApiNoContentResponse({ description: MESSAGES.userDeletedSuccessfully })
  @ApiBadRequestResponse({ description: MESSAGES.invalidUserId })
  @ApiNotFoundResponse({ description: MESSAGES.userNotFound })
  async remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    try {
      await this.userService.remove(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
