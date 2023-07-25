import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DatabaseService } from './database/database.service';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule],
  controllers: [AppController],
  providers: [DatabaseService],
})
export class AppModule {}
