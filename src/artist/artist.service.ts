import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { DatabaseService } from '../database/database.service';
import { ArtistEntity } from './entities/artist.entity';
import { v4 as uuid } from 'uuid';
import { MESSAGES } from '../resources/messages';

@Injectable()
export class ArtistService {
  constructor(private readonly dbService: DatabaseService) {}

  findAll(): ArtistEntity[] {
    return this.dbService.artists;
  }

  findOne(id: string): ArtistEntity {
    const artist = this.dbService.artists.find((artist) => artist.id === id);
    if (!artist) {
      throw new HttpException(MESSAGES.recordNotFound, HttpStatus.NOT_FOUND);
    }
    return artist;
  }

  create(newArtist: CreateArtistDto) {
    const artist: ArtistEntity = {
      ...newArtist,
      id: uuid(),
    };
    this.dbService.artists.push(artist);
    return artist;
  }

  update(id: string, updatedArtist: UpdateArtistDto): ArtistEntity {
    const artistIndex = this.dbService.artists.findIndex(
      (artist) => artist.id === id,
    );
    if (artistIndex === -1) {
      throw new HttpException(MESSAGES.recordNotFound, HttpStatus.NOT_FOUND);
    }
    const currentArtist = this.dbService.artists[artistIndex];
    const updatedArtistObj: ArtistEntity = {
      ...currentArtist,
      ...updatedArtist,
    };
    this.dbService.artists[artistIndex] = updatedArtistObj;
    return updatedArtistObj;
  }

  async remove(id: string): Promise<boolean> {
    const artistIndex = this.dbService.artists.findIndex(
      (artist) => artist.id === id,
    );
    if (artistIndex === -1) {
      throw new HttpException(MESSAGES.recordNotFound, HttpStatus.NOT_FOUND);
    }

    this.dbService.artists.splice(artistIndex, 1);
    return true;
  }
}
