import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FavoriteType } from 'src/interfaces';
import { PrismaService } from 'src/prisma/prisma.service';
import { MESSAGES } from 'src/resources/messages';
import { v4 as uuid } from 'uuid';

@Injectable()
export class FavoriteService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const getAlbums = await this.prisma.favorites.findMany({
      select: {
        objectId: true,
      },
      where: { type: FavoriteType.album },
    });
    const getTracks = await this.prisma.favorites.findMany({
      select: {
        objectId: true,
      },
      where: { type: FavoriteType.track },
    });
    const getArtists = await this.prisma.favorites.findMany({
      select: {
        objectId: true,
      },
      where: { type: FavoriteType.artist },
    });
    return {
      albums: await this.prisma.album.findMany({
        where: {
          id: {
            in: getAlbums.map((item) => item.objectId),
          },
        },
      }),
      tracks: await this.prisma.track.findMany({
        where: {
          id: {
            in: getTracks.map((item) => item.objectId),
          },
        },
      }),
      artists: await this.prisma.artist.findMany({
        where: {
          id: {
            in: getArtists.map((item) => item.objectId),
          },
        },
      }),
    };
  }

  async addArtist(id: string) {
    const artist = await this.prisma.artist.findUnique({ where: { id } });
    if (!artist) {
      throw new HttpException(
        MESSAGES.recordNotFound,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    await this.prisma.favorites.create({
      data: {
        id: uuid(),
        type: FavoriteType.artist,
        objectId: id,
      },
    });
    return artist;
  }
  async addAlbum(id: string) {
    const album = await this.prisma.album.findUnique({ where: { id } });
    if (!album) {
      throw new HttpException(
        MESSAGES.recordNotFound,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    await this.prisma.favorites.create({
      data: {
        id: uuid(),
        type: FavoriteType.album,
        objectId: id,
      },
    });
    return album;
  }

  async addTrack(id: string) {
    const track = await this.prisma.track.findUnique({ where: { id } });
    if (!track) {
      throw new HttpException(
        MESSAGES.recordNotFound,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    await this.prisma.favorites.create({
      data: {
        id: uuid(),
        type: FavoriteType.track,
        objectId: id,
      },
    });
    return track;
  }

  async remove(id: string) {
    try {
      await this.prisma.favorites.deleteMany({
        where: {
          objectId: {
            contains: id,
          },
        },
      });
    } catch {
      throw new HttpException(MESSAGES.recordNotFound, HttpStatus.NOT_FOUND);
    }
    return MESSAGES.recordDeletedSuccessfully;
  }
}
