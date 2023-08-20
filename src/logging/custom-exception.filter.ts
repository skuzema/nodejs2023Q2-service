import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { CustomLogger } from './logging.service';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  constructor(private readonly loggingService: CustomLogger) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal Server Error';

    if (!(exception instanceof HttpException)) {
      this.loggingService.error(
        `${ctx.getRequest().method} ${
          ctx.getRequest().url
        } | Status: ${status} | Message: ${JSON.stringify(message)}`,
        CustomExceptionFilter.name,
      );
    }

    response.status(status).json({
      statusCode: status,
      message,
    });
  }
}
