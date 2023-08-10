import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { TrackEntity } from './entities/track.entity';
import { v4 as uuid } from 'uuid';
import { MESSAGES } from '../resources/messages';

@Injectable()
export class TrackService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.track.findMany();
  }

  async findOne(id: string) {
    const track = await this.prisma.track.findUnique({ where: { id } });
    if (!track) {
      throw new HttpException(MESSAGES.recordNotFound, HttpStatus.NOT_FOUND);
    }
    return track;
  }

  async create(newTrack: CreateTrackDto) {
    const track: TrackEntity = {
      ...newTrack,
      id: uuid(),
    };
    return await this.prisma.track.create({
      data: track,
    });
  }

  async update(id: string, updatedTrack: UpdateTrackDto) {
    try {
      return await this.prisma.track.update({
        where: { id },
        data: updatedTrack,
      });
    } catch {
      throw new HttpException(MESSAGES.recordNotFound, HttpStatus.NOT_FOUND);
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.track.delete({ where: { id } });
    } catch {
      throw new HttpException(MESSAGES.recordNotFound, HttpStatus.NOT_FOUND);
    }
  }
}
