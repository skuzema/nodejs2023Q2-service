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
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { StatusCodes } from 'http-status-codes';
import { MESSAGES } from '../resources/messages';

@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Artists')
@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Get()
  @ApiOkResponse({ description: MESSAGES.ok })
  async findAll() {
    return await this.artistService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ description: MESSAGES.ok })
  @ApiNotFoundResponse({ description: MESSAGES.recordNotFound })
  @ApiBadRequestResponse({ description: MESSAGES.invalidRecordId })
  async findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    try {
      return await this.artistService.findOne(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Post()
  @ApiCreatedResponse({ description: MESSAGES.recordSuccessfullyCreated })
  @ApiBadRequestResponse({
    description: MESSAGES.missingRequiredFields,
  })
  async create(@Body() newArtist: CreateArtistDto) {
    return await this.artistService.create(newArtist);
  }

  @Put(':id')
  @ApiOkResponse({ description: MESSAGES.recordUpdatedSuccessfully })
  @ApiBadRequestResponse({ description: MESSAGES.invalidRecordId })
  @ApiNotFoundResponse({ description: MESSAGES.recordNotFound })
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() update: UpdateArtistDto,
  ) {
    try {
      return await this.artistService.update(id, update);
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
      await this.artistService.remove(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
