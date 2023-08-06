import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { AlbumEntity } from './entities/album.entity';
import { v4 as uuid } from 'uuid';
import { MESSAGES } from '../resources/messages';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AlbumService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.album.findMany();
  }

  async findOne(id: string) {
    const album = await this.prisma.album.findUnique({ where: { id } });
    if (!album) {
      throw new HttpException(MESSAGES.recordNotFound, HttpStatus.NOT_FOUND);
    }
    return album;
  }

  async create(newAlbum: CreateAlbumDto) {
    const album: AlbumEntity = {
      ...newAlbum,
      id: uuid(),
    };
    return await this.prisma.album.create({
      data: album,
    });
  }

  async update(id: string, updatedAlbum: UpdateAlbumDto) {
    try {
      return await this.prisma.album.update({
        where: { id },
        data: updatedAlbum,
      });
    } catch {
      throw new HttpException(MESSAGES.recordNotFound, HttpStatus.NOT_FOUND);
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.album.delete({ where: { id } });
    } catch {
      throw new HttpException(MESSAGES.recordNotFound, HttpStatus.NOT_FOUND);
    }
  }
}
