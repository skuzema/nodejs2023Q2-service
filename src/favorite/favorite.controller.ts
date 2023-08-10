import {
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { StatusCodes } from 'http-status-codes';
import { FavoriteService } from './favorite.service';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MESSAGES } from 'src/resources/messages';

@ApiTags('Favorites')
@Controller('favs')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Get()
  @ApiOkResponse({ description: MESSAGES.ok })
  async findAll() {
    return await this.favoriteService.findAll();
  }

  @Post('track/:id')
  @ApiCreatedResponse({ description: MESSAGES.recordSuccessfullyCreated })
  @ApiBadRequestResponse({
    description: MESSAGES.missingRequiredFields,
  })
  async addTrack(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    const newTrack = await this.favoriteService.addTrack(id);
    return newTrack;
  }

  @Delete('track/:id')
  @HttpCode(StatusCodes.NO_CONTENT)
  @ApiNoContentResponse({ description: MESSAGES.recordDeletedSuccessfully })
  @ApiBadRequestResponse({ description: MESSAGES.invalidRecordId })
  @ApiNotFoundResponse({ description: MESSAGES.recordNotFound })
  async removeTrack(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    try {
      return await this.favoriteService.removeTrack(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Post('album/:id')
  @ApiCreatedResponse({ description: MESSAGES.recordSuccessfullyCreated })
  @ApiBadRequestResponse({
    description: MESSAGES.missingRequiredFields,
  })
  async addAlbum(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    const newAlbum = await this.favoriteService.addAlbum(id);
    return newAlbum;
  }

  @Delete('album/:id')
  @HttpCode(StatusCodes.NO_CONTENT)
  @ApiNoContentResponse({ description: MESSAGES.recordDeletedSuccessfully })
  @ApiBadRequestResponse({ description: MESSAGES.invalidRecordId })
  @ApiNotFoundResponse({ description: MESSAGES.recordNotFound })
  async removeAlbum(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    try {
      return await this.favoriteService.removeAlbum(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Post('artist/:id')
  @ApiCreatedResponse({ description: MESSAGES.recordSuccessfullyCreated })
  @ApiBadRequestResponse({
    description: MESSAGES.missingRequiredFields,
  })
  async addArtist(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    const newArtist = await this.favoriteService.addArtist(id);
    return newArtist;
  }

  @Delete('artist/:id')
  @HttpCode(StatusCodes.NO_CONTENT)
  @ApiNoContentResponse({ description: MESSAGES.recordDeletedSuccessfully })
  @ApiBadRequestResponse({ description: MESSAGES.invalidRecordId })
  @ApiNotFoundResponse({ description: MESSAGES.recordNotFound })
  async removeArtist(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    try {
      return await this.favoriteService.removeArtist(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
