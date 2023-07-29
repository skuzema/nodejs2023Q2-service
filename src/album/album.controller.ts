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
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { StatusCodes } from 'http-status-codes';
import { MESSAGES } from '../resources/messages';
import { AlbumEntity } from './entities/album.entity';

@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Album')
@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Get()
  @ApiOkResponse()
  findAll(): AlbumEntity[] {
    return this.albumService.findAll();
  }

  @Get(':id')
  @ApiOkResponse()
  @ApiNotFoundResponse({ description: MESSAGES.recordNotFound })
  @ApiBadRequestResponse({ description: MESSAGES.invalidRecordId })
  findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    try {
      return this.albumService.findOne(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Post()
  @ApiCreatedResponse({ description: MESSAGES.recordSuccessfullyCreated })
  @ApiBadRequestResponse({
    description: MESSAGES.missingRequiredFields,
  })
  create(@Body() newAlbum: CreateAlbumDto): AlbumEntity {
    return this.albumService.create(newAlbum);
  }

  @Put(':id')
  @ApiBadRequestResponse({ description: MESSAGES.invalidRecordId })
  @ApiNotFoundResponse({ description: MESSAGES.recordNotFound })
  update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() update: UpdateAlbumDto,
  ) {
    try {
      return this.albumService.update(id, update);
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
      await this.albumService.remove(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
