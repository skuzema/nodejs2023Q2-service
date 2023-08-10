import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ArtistEntity } from './entities/artist.entity';
import { v4 as uuid } from 'uuid';
import { MESSAGES } from '../resources/messages';

@Injectable()
export class ArtistService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.artist.findMany();
  }

  async findOne(id: string) {
    const artist = await this.prisma.artist.findUnique({ where: { id } });
    if (!artist) {
      throw new HttpException(MESSAGES.recordNotFound, HttpStatus.NOT_FOUND);
    }
    return artist;
  }

  async create(newArtist: CreateArtistDto) {
    const artist: ArtistEntity = {
      ...newArtist,
      id: uuid(),
    };
    return await this.prisma.artist.create({
      data: artist,
    });
  }

  async update(id: string, updatedArtist: UpdateArtistDto) {
    try {
      return await this.prisma.artist.update({
        where: { id },
        data: updatedArtist,
      });
    } catch {
      throw new HttpException(MESSAGES.recordNotFound, HttpStatus.NOT_FOUND);
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.artist.delete({ where: { id } });
    } catch {
      throw new HttpException(MESSAGES.recordNotFound, HttpStatus.NOT_FOUND);
    }
  }
}
