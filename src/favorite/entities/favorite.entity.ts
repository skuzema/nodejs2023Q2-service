import { ApiProperty } from '@nestjs/swagger';

export class FavoriteEntity {
  @ApiProperty()
  artists: string[];

  @ApiProperty()
  albums: string[];

  @ApiProperty()
  tracks: string[];

  constructor(partial: Partial<FavoriteEntity>) {
    Object.assign(this, partial);
  }
}
