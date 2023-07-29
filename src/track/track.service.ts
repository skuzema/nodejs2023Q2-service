import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { DatabaseService } from '../database/database.service';
import { TrackEntity } from './entities/track.entity';
import { v4 as uuid } from 'uuid';
import { MESSAGES } from '../resources/messages';

@Injectable()
export class TrackService {
  constructor(private readonly dbService: DatabaseService) {}

  findAll(): TrackEntity[] {
    return this.dbService.tracks;
  }

  findOne(id: string): TrackEntity {
    const track = this.dbService.tracks.find((track) => track.id === id);
    if (!track) {
      throw new HttpException(MESSAGES.recordNotFound, HttpStatus.NOT_FOUND);
    }
    return track;
  }

  create(newTrack: CreateTrackDto) {
    const track: TrackEntity = {
      ...newTrack,
      id: uuid(),
    };
    this.dbService.tracks.push(track);
    return track;
  }

  update(id: string, updatedTrack: UpdateTrackDto): TrackEntity {
    const trackIndex = this.dbService.tracks.findIndex(
      (track) => track.id === id,
    );
    if (trackIndex === -1) {
      throw new HttpException(MESSAGES.recordNotFound, HttpStatus.NOT_FOUND);
    }
    const currentTrack = this.dbService.tracks[trackIndex];
    const updatedTrackObj: TrackEntity = {
      ...currentTrack,
      ...updatedTrack,
    };
    this.dbService.tracks[trackIndex] = updatedTrackObj;
    return updatedTrackObj;
  }

  async remove(id: string): Promise<boolean> {
    const trackIndex = this.dbService.tracks.findIndex(
      (track) => track.id === id,
    );
    if (trackIndex === -1) {
      throw new HttpException(MESSAGES.recordNotFound, HttpStatus.NOT_FOUND);
    }
    const trackFavsIndex = this.dbService.favs.tracks.findIndex(
      (track) => track === id,
    );
    if (trackFavsIndex > -1) {
      this.dbService.favs.artists.splice(trackFavsIndex, 1);
    }
    this.dbService.tracks.splice(trackIndex, 1);
    return true;
  }
}
