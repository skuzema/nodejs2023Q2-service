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
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { StatusCodes } from 'http-status-codes';
import { MESSAGES } from '../resources/messages';

@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Tracks')
@Controller('track')
@ApiBearerAuth('access-token')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get()
  @ApiOkResponse({ description: MESSAGES.ok })
  async findAll() {
    return await this.trackService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ description: MESSAGES.ok })
  @ApiNotFoundResponse({ description: MESSAGES.recordNotFound })
  @ApiBadRequestResponse({ description: MESSAGES.invalidRecordId })
  async findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    try {
      return await this.trackService.findOne(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Post()
  @ApiCreatedResponse({ description: MESSAGES.recordSuccessfullyCreated })
  @ApiBadRequestResponse({
    description: MESSAGES.missingRequiredFields,
  })
  async create(@Body() newTrack: CreateTrackDto) {
    return await this.trackService.create(newTrack);
  }

  @Put(':id')
  @ApiOkResponse({ description: MESSAGES.recordUpdatedSuccessfully })
  @ApiBadRequestResponse({ description: MESSAGES.invalidRecordId })
  @ApiNotFoundResponse({ description: MESSAGES.recordNotFound })
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() update: UpdateTrackDto,
  ) {
    try {
      return await this.trackService.update(id, update);
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
      await this.trackService.remove(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
