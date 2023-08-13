import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggingService } from '../logging/logging.service';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor(private readonly loggingService: LoggingService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const start = new Date().getTime();

    res.on('finish', () => {
      const duration = new Date().getTime() - start;
      const { statusCode } = res;

      this.loggingService.log(
        `${method} ${originalUrl} | Status: ${statusCode} | Duration: ${duration}ms`,
      );
    });

    next();
  }
}
