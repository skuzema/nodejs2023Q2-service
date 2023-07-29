import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { MESSAGES } from 'src/resources/messages';

@Injectable()
export class FavoriteService {
  constructor(private readonly dbService: DatabaseService) {}

  findAll() {
    return {
      albums: this.dbService.albums.filter((album) =>
        this.dbService.favs.albums.includes(album.id),
      ),
      tracks: this.dbService.tracks.filter((track) =>
        this.dbService.favs.tracks.includes(track.id),
      ),
      artists: this.dbService.artists.filter((artist) =>
        this.dbService.favs.artists.includes(artist.id),
      ),
    };
  }

  addTrack(id: string) {
    const track = this.dbService.tracks.find((track) => track.id === id);
    if (!track) {
      throw new HttpException(
        MESSAGES.recordNotFound,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    this.dbService.favs.tracks.push(id);
    return MESSAGES.recordSuccessfullyCreated;
  }

  removeTrack(id: string) {
    if (!this.dbService.favs.tracks.includes(id)) {
      throw new HttpException(MESSAGES.recordNotFound, HttpStatus.NOT_FOUND);
    }
    this.dbService.favs.tracks = this.dbService.favs.tracks.filter(
      (i) => i !== id,
    );
    return MESSAGES.recordDeletedSuccessfully;
  }

  addAlbum(id: string) {
    const album = this.dbService.albums.find((album) => album.id === id);
    if (!album) {
      throw new HttpException(
        MESSAGES.recordNotFound,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    this.dbService.favs.albums.push(id);
    return MESSAGES.recordSuccessfullyCreated;
  }

  removeAlbum(id: string) {
    if (!this.dbService.favs.albums.includes(id)) {
      throw new HttpException(MESSAGES.recordNotFound, HttpStatus.NOT_FOUND);
    }
    this.dbService.favs.albums = this.dbService.favs.albums.filter(
      (i) => i !== id,
    );
    return MESSAGES.recordDeletedSuccessfully;
  }

  addArtist(id: string) {
    const artist = this.dbService.artists.find((artist) => artist.id === id);
    if (!artist) {
      throw new HttpException(
        MESSAGES.recordNotFound,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    this.dbService.favs.artists.push(id);
    return MESSAGES.recordSuccessfullyCreated;
  }

  removeArtist(id: string) {
    if (!this.dbService.favs.artists.includes(id)) {
      throw new HttpException(MESSAGES.recordNotFound, HttpStatus.NOT_FOUND);
    }
    this.dbService.favs.artists = this.dbService.favs.artists.filter(
      (i) => i !== id,
    );
    return MESSAGES.recordDeletedSuccessfully;
  }
}
