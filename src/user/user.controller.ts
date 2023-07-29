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
  ParseUUIDPipe,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { StatusCodes } from 'http-status-codes';
import { MESSAGES } from '../resources/messages';
import { UserEntity } from './entities/user.entity';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOkResponse({ description: MESSAGES.ok })
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ description: MESSAGES.ok })
  @ApiNotFoundResponse({ description: MESSAGES.recordNotFound })
  @ApiBadRequestResponse({ description: MESSAGES.invalidRecordId })
  findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    try {
      return this.userService.findOne(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Post()
  @ApiCreatedResponse({ description: MESSAGES.recordSuccessfullyCreated })
  @ApiBadRequestResponse({
    description: MESSAGES.missingRequiredFields,
  })
  create(@Body() newUser: CreateUserDto): UserEntity {
    return new UserEntity(this.userService.create(newUser));
  }

  @Put(':id')
  @ApiOkResponse({ description: MESSAGES.recordUpdatedSuccessfully })
  @ApiBadRequestResponse({ description: MESSAGES.invalidRecordId })
  @ApiNotFoundResponse({ description: MESSAGES.recordNotFound })
  @ApiForbiddenResponse({ description: MESSAGES.oldPasswordIsWrong })
  update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() update: UpdatePasswordDto,
  ) {
    try {
      return new UserEntity(this.userService.update(id, update));
    } catch (error) {
      if (error instanceof Error && error.message === MESSAGES.recordNotFound) {
        throw new NotFoundException(error.message);
      }
      throw new ForbiddenException(error.message);
    }
  }

  @Delete(':id')
  @HttpCode(StatusCodes.NO_CONTENT)
  @ApiNoContentResponse({ description: MESSAGES.recordDeletedSuccessfully })
  @ApiBadRequestResponse({ description: MESSAGES.invalidRecordId })
  @ApiNotFoundResponse({ description: MESSAGES.recordNotFound })
  async remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    try {
      await this.userService.remove(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
