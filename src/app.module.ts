import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from './user/user.module';
import { ArtistModule } from './artist/artist.module';
@Module({
  imports: [UserModule, ArtistModule],
  controllers: [AppController],
  providers: [],
  exports: [],
})
export class AppModule {}
