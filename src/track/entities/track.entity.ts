import { ApiProperty } from '@nestjs/swagger';
import { ValidateIf } from 'class-validator';

export class TrackEntity {
  @ApiProperty({ description: 'uuid v4' })
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  @ValidateIf(({ artistId }) => !Object.is(artistId, null))
  artistId: string | null;

  @ApiProperty()
  @ValidateIf(({ albumId }) => !Object.is(albumId, null))
  albumId: string | null;

  @ApiProperty()
  duration: number;

  constructor(partial: Partial<TrackEntity>) {
    Object.assign(this, partial);
  }
}
