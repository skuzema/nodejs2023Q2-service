import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as rfs from 'rotating-file-stream';

@Injectable()
export class LoggingService implements OnApplicationBootstrap {
  private errorLogger: fs.WriteStream;
  private logStream: rfs.RotatingFileStream;

  constructor() {
    const logDirectory = path.join(__dirname, '../../logs');
    fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

    // Set up error log file rotation
    this.errorLogger = fs.createWriteStream(
      path.join(logDirectory, 'error.log'),
      {
        flags: 'a',
      },
    );

    // Set up regular log file rotation
    this.logStream = rfs.createStream('app.log', {
      size: process.env.LOG_MAX_SIZE || '10M',
      interval: '1d',
      compress: 'gzip',
      path: logDirectory,
    });
  }

  log(message: any, context?: string) {
    this.writeLog('log', message, context);
  }

  error(message: any, trace?: string, context?: string) {
    this.errorLogger.write(
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
      this.logStream.write(`${formattedMessage}\n`);
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
