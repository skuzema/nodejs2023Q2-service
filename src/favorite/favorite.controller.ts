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
import { AllFavoriteDto } from './dto/all-favorite.dto';
import { MESSAGES } from 'src/resources/messages';

@ApiTags('Favorites')
@Controller('favs')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Get()
  @ApiOkResponse()
  findAll(): AllFavoriteDto {
    return this.favoriteService.findAll();
  }

  @Post('track/:id')
  @ApiCreatedResponse({ description: MESSAGES.recordSuccessfullyCreated })
  @ApiBadRequestResponse({
    description: MESSAGES.missingRequiredFields,
  })
  addTrack(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.favoriteService.addTrack(id);
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
      this.favoriteService.removeTrack(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Post('album/:id')
  @ApiCreatedResponse({ description: MESSAGES.recordSuccessfullyCreated })
  @ApiBadRequestResponse({
    description: MESSAGES.missingRequiredFields,
  })
  addAlbum(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.favoriteService.addAlbum(id);
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
      this.favoriteService.removeAlbum(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Post('artist/:id')
  @ApiCreatedResponse({ description: MESSAGES.recordSuccessfullyCreated })
  @ApiBadRequestResponse({
    description: MESSAGES.missingRequiredFields,
  })
  addArtist(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.favoriteService.addArtist(id);
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
      this.favoriteService.removeArtist(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
