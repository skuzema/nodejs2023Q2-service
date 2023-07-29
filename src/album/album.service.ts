import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { DatabaseService } from '../database/database.service';
import { AlbumEntity } from './entities/album.entity';
import { v4 as uuid } from 'uuid';
import { MESSAGES } from '../resources/messages';

@Injectable()
export class AlbumService {
  constructor(private readonly dbService: DatabaseService) {}

  findAll(): AlbumEntity[] {
    return this.dbService.albums;
  }

  findOne(id: string): AlbumEntity {
    const album = this.dbService.albums.find((album) => album.id === id);
    if (!album) {
      throw new HttpException(MESSAGES.recordNotFound, HttpStatus.NOT_FOUND);
    }
    return album;
  }

  create(newAlbum: CreateAlbumDto) {
    const album: AlbumEntity = {
      ...newAlbum,
      id: uuid(),
    };
    this.dbService.albums.push(album);
    return album;
  }

  update(id: string, updatedAlbum: UpdateAlbumDto): AlbumEntity {
    const albumIndex = this.dbService.albums.findIndex(
      (album) => album.id === id,
    );
    if (albumIndex === -1) {
      throw new HttpException(MESSAGES.recordNotFound, HttpStatus.NOT_FOUND);
    }
    const currentAlbum = this.dbService.albums[albumIndex];
    const updatedAlbumObj: AlbumEntity = {
      ...currentAlbum,
      ...updatedAlbum,
    };
    this.dbService.albums[albumIndex] = updatedAlbumObj;
    return updatedAlbumObj;
  }

  async remove(id: string): Promise<boolean> {
    const albumIndex = this.dbService.albums.findIndex(
      (album) => album.id === id,
    );
    if (albumIndex === -1) {
      throw new HttpException(MESSAGES.recordNotFound, HttpStatus.NOT_FOUND);
    }

    this.dbService.albums.splice(albumIndex, 1);
    return true;
  }
}
