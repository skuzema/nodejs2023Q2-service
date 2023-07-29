import { ApiProperty } from '@nestjs/swagger';
import { Artist, Album, Track } from 'src/interfaces';

export class AllFavoriteDto {
  @ApiProperty({ description: 'Artists ids', example: 'id1,id2' })
  artists: Artist[];
  @ApiProperty({ description: 'Albums ids', example: 'id1,id2' })
  albums: Album[];
  @ApiProperty({ description: 'Tracks ids', example: 'id1,id2' })
  tracks: Track[];
}
