import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from 'src/database/database.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ExcludePasswordInterceptor } from './interceptors/exclude-password.interceptor';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ExcludePasswordInterceptor,
    },
  ],
})
export class UserModule {}
