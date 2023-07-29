import { Injectable } from '@nestjs/common';
import { User, Artist, Album, Track, Favorites } from '../interfaces';
@Injectable()
export class DatabaseService {
  public users: User[] = [];
  public artists: Artist[] = [];
  public albums: Album[] = [];
  public tracks: Track[] = [];
  public favs: Favorites = {
    artists: [],
    albums: [],
    tracks: [],
  };
  private version = 0;

  public getVersion() {
    return this.version++;
  }
}
