import { Injectable, LoggerService } from '@nestjs/common';
// import * as fs from 'fs';
import * as path from 'path';
import * as rfs from 'rotating-file-stream';

@Injectable()
export class CustomLogger implements LoggerService {
  private loggerStream: NodeJS.WritableStream;
  private errorLoggerStream: NodeJS.WritableStream;

  constructor() {
    // Set up regular log file rotation
    this.loggerStream = rfs.createStream('app.log', {
      size: process.env.LOG_MAX_SIZE || '10M',
      interval: '1d',
      compress: 'gzip',
      path: path.join(__dirname, '../../logs'),
    });

    // Set up error log file rotation
    this.errorLoggerStream = rfs.createStream('error.log', {
      size: process.env.LOG_MAX_SIZE || '10M',
      interval: '1d',
      compress: 'gzip',
      path: path.join(__dirname, '../../logs'),
    });
  }

  log(message: any, context?: string) {
    this.writeLog('log', message, context);
  }

  error(message: any, trace?: string, context?: string) {
    this.errorLoggerStream.write(
      `[${new Date().toISOString()}] [${context || 'Logger'}] - ${message}\n`,
    );
  }

  warn(message: any, context?: string) {
    this.writeLog('warn', message, context);
  }

  debug(message: any, context?: string) {
    this.writeLog('debug', message, context);
  }

  verbose(message: any, context?: string) {
    this.writeLog('verbose', message, context);
  }

  async onApplicationBootstrap() {
    process.on('uncaughtException', (error) => {
      this.error('Uncaught Exception:', error.stack, 'UncaughtException');
      process.exit(1);
    });

    process.on('unhandledRejection', (reason) => {
      this.error(
        'Unhandled Rejection: ' + (reason as string),
        'UnhandledRejection',
      );
    });
  }

  private writeLog(level: string, message: any, context?: string) {
    if (this.isLogLevelEnabled(level)) {
      const formattedMessage = this.formatMessage(message, context);
      this.loggerStream.write(`${formattedMessage}\n`);
      console[level](formattedMessage);
    }
  }

  private isLogLevelEnabled(level: string): boolean {
    const logLevel = process.env.LOG_LEVEL || 'log';
    return (
      ['log', 'error', 'warn', 'debug', 'verbose'].indexOf(level) >=
      ['log', 'error', 'warn', 'debug', 'verbose'].indexOf(logLevel)
    );
  }

  private formatMessage(message: any, context?: string): string {
    return `[${new Date().toISOString()}] [${
      context || 'Logger'
    }] - ${message}`;
  }
}
