import { ApiProperty } from '@nestjs/swagger';
import { ValidateIf } from 'class-validator';

export class AlbumEntity {
  @ApiProperty({ description: 'uuid v4' })
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  year: number;

  @ApiProperty()
  @ValidateIf(({ artistId }) => !Object.is(artistId, null))
  artistId: string | null;

  constructor(partial: Partial<AlbumEntity>) {
    this.id = partial.id;
    this.name = partial.name;
    this.year = partial.year;
    this.artistId = partial.artistId;
  }
}
