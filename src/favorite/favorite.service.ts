import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MESSAGES } from 'src/resources/messages';

@Injectable()
export class FavoriteService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const getAlbums = await this.prisma.favsOnAlbum.findMany({
      select: {
        albumId: true,
      },
    });
    const getTracks = await this.prisma.favsOnTrack.findMany({
      select: {
        trackId: true,
      },
    });
    const getArtists = await this.prisma.favsOnArtists.findMany({
      select: {
        artistId: true,
      },
    });
    return {
      albums: await this.prisma.album.findMany({
        where: {
          id: {
            in: getAlbums.map((item) => item.albumId),
          },
        },
      }),
      tracks: await this.prisma.track.findMany({
        where: {
          id: {
            in: getTracks.map((item) => item.trackId),
          },
        },
      }),
      artists: await this.prisma.artist.findMany({
        where: {
          id: {
            in: getArtists.map((item) => item.artistId),
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
    await this.prisma.favsOnArtists.create({
      data: { artistId: id },
    });
    return artist;
  }

  async removeArtist(id: string) {
    try {
      await this.prisma.favsOnArtists.delete({
        where: { artistId: id },
      });
    } catch {
      throw new HttpException(MESSAGES.recordNotFound, HttpStatus.NOT_FOUND);
    }
    return MESSAGES.recordDeletedSuccessfully;
  }

  async addAlbum(id: string) {
    const album = await this.prisma.album.findUnique({ where: { id } });
    if (!album) {
      throw new HttpException(
        MESSAGES.recordNotFound,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    await this.prisma.favsOnAlbum.create({
      data: { albumId: id },
    });
    return album;
  }

  async removeAlbum(id: string) {
    try {
      await this.prisma.favsOnAlbum.delete({
        where: { albumId: id },
      });
    } catch {
      throw new HttpException(MESSAGES.recordNotFound, HttpStatus.NOT_FOUND);
    }
    return MESSAGES.recordDeletedSuccessfully;
  }

  async addTrack(id: string) {
    const track = await this.prisma.track.findUnique({ where: { id } });
    if (!track) {
      throw new HttpException(
        MESSAGES.recordNotFound,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    await this.prisma.favsOnTrack.create({
      data: { trackId: id },
    });
    return track;
  }

  async removeTrack(id: string) {
    try {
      await this.prisma.favsOnTrack.delete({
        where: { trackId: id },
      });
    } catch {
      throw new HttpException(MESSAGES.recordNotFound, HttpStatus.NOT_FOUND);
    }
    return MESSAGES.recordDeletedSuccessfully;
  }
}
