import { Module } from '@nestjs/common';
import { LoggingService } from './logging.service';

@Module({
  controllers: [],
  providers: [LoggingService],
})
export class LoggingModule {}
