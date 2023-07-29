import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from './user/user.module';
import { ArtistModule } from './artist/artist.module';
import { TrackModule } from './track/track.module';
import { AlbumModule } from './album/album.module';
@Module({
  imports: [UserModule, ArtistModule, TrackModule, AlbumModule],
  controllers: [AppController],
  providers: [],
  exports: [],
})
export class AppModule {}
