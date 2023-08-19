import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ExcludePasswordInterceptor } from './interceptors/exclude-password.interceptor';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ExcludePasswordInterceptor,
    },
  ],
  exports: [UserService],
})
export class UserModule {}
