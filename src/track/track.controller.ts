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
import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { StatusCodes } from 'http-status-codes';
import { MESSAGES } from '../resources/messages';
import { TrackEntity } from './entities/track.entity';

@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Tracks')
@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get()
  @ApiOkResponse()
  findAll(): TrackEntity[] {
    return this.trackService.findAll();
  }

  @Get(':id')
  @ApiOkResponse()
  @ApiNotFoundResponse({ description: MESSAGES.recordNotFound })
  @ApiBadRequestResponse({ description: MESSAGES.invalidRecordId })
  findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    try {
      return this.trackService.findOne(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Post()
  @ApiCreatedResponse({ description: MESSAGES.recordSuccessfullyCreated })
  @ApiBadRequestResponse({
    description: MESSAGES.missingRequiredFields,
  })
  create(@Body() newTrack: CreateTrackDto): TrackEntity {
    return this.trackService.create(newTrack);
  }

  @Put(':id')
  @ApiBadRequestResponse({ description: MESSAGES.invalidRecordId })
  @ApiNotFoundResponse({ description: MESSAGES.recordNotFound })
  update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() update: UpdateTrackDto,
  ) {
    try {
      return this.trackService.update(id, update);
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
