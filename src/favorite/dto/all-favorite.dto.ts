import { Artist, Album, Track } from 'src/interfaces';

export class AllFavoriteDto {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}
