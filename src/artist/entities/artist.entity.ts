import { ApiProperty } from '@nestjs/swagger';

export class ArtistEntity {
  @ApiProperty({ description: 'uuid v4' })
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  grammy: boolean;

  constructor(partial: Partial<ArtistEntity>) {
    this.id = partial.id;
    this.name = partial.name;
    this.grammy = partial.grammy;
  }
}
