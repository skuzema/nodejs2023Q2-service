import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CustomLogger } from '../logging/logging.service';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor(private readonly loggingService: CustomLogger) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { baseUrl, method, query, body } = req;
    const start = new Date().getTime();

    const logger = this.loggingService;

    const chunks: Buffer[] = [];
    const originalWrite = res.write;
    const originalEnd = res.end;

    res.write = function (chunk: any, ...restArgs: any[]): boolean {
      if (Buffer.isBuffer(chunk)) {
        chunks.push(chunk);
      } else {
        chunks.push(Buffer.from(chunk));
      }
      originalWrite.apply(res, [chunk, ...restArgs]);
      return true;
    };

    res.end = function (
      chunk: any,
      ...restArgs: any[]
    ): Response<any, Record<string, any>> {
      if (chunk) {
        if (Buffer.isBuffer(chunk)) {
          chunks.push(chunk);
        } else {
          chunks.push(Buffer.from(chunk));
        }
      }

      const responseBody = Buffer.concat(chunks).toString('utf8');

      const { statusCode } = res;
      const duration = new Date().getTime() - start;
      const message = {
        method,
        baseUrl,
        query: JSON.stringify(query),
        requestBody: JSON.stringify(body),
        responseBody,
        statusCode,
        duration,
      };
      logger.log(
        `${message.method} ${message.baseUrl} | Parameters: ${message.query} | Body: ${message.requestBody} | Response: ${message.responseBody} | Status: ${statusCode} | Duration: ${duration}ms`,
      );

      return originalEnd.apply(res, [chunk, ...restArgs]);
    };

    next();
  }
}
