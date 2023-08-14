import { Module } from '@nestjs/common';
import { CustomLogger } from './logging.service';

@Module({
  controllers: [],
  providers: [CustomLogger],
})
export class LoggingModule {}
