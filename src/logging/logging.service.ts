import { Injectable, LoggerService } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { LOG_DIR, LOG_LEVEL, LOG_MAX_SIZE } from 'src/resources/constants';

@Injectable()
export class CustomLogger implements LoggerService {
  private loggerStream: fs.WriteStream;
  private errorLoggerStream: fs.WriteStream;
  private logDirectory: string = path.join(__dirname, LOG_DIR);
  private logFilePrefix: string = 'app';
  private errorLogFilePrefix: string = 'error';
  private logFileExtension: string = 'log';
  private errorLogFileExtension: string = 'log';
  private logFileIndex: number = 0;

  constructor() {
    this.loggerStream = this.createLogFileStream();
    this.errorLoggerStream = this.createErrorLogFileStream();
  }

  log(message: any, context?: string) {
    this.writeLog('log', message, context);
  }

  error(message: any, trace?: string, context?: string) {
    const formattedMessage = this.formatMessage(message, context);
    this.errorLoggerStream.write(formattedMessage);
    console['error'](formattedMessage);
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

  private createLogFileStream(): fs.WriteStream {
    const logFileName = this.getLogFileName();
    return fs.createWriteStream(logFileName, { flags: 'a' });
  }

  private createErrorLogFileStream(): fs.WriteStream {
    const logFileName = this.getLogErrorFileName();
    return fs.createWriteStream(logFileName, { flags: 'a' });
  }

  private getLogFileName(): string {
    const currentDate = new Date().toISOString().slice(0, 10);
    return path.join(
      this.logDirectory,
      `${this.logFilePrefix}_${currentDate}_${this.logFileIndex}.${this.logFileExtension}`,
    );
  }

  private getLogErrorFileName(): string {
    const currentDate = new Date().toISOString().slice(0, 10);
    return path.join(
      this.logDirectory,
      `${this.errorLogFilePrefix}_${currentDate}_${this.logFileIndex}.${this.errorLogFileExtension}`,
    );
  }

  private writeLog(level: string, message: any, context?: string) {
    if (this.isLogLevelEnabled(level)) {
      const formattedMessage = this.formatMessage(message, context);
      this.loggerStream.write(`${formattedMessage}\n`);
      fs.stat(this.getLogFileName(), (err, stats) => {
        if (err) {
          console.error('Error getting file stats:', err);
          return;
        }
        const logMaxSize = LOG_MAX_SIZE * 1024;
        if (stats.size >= logMaxSize) {
          this.loggerStream.end();
          this.logFileIndex++;
          this.loggerStream = this.createLogFileStream();
        }
      });
      console[level](formattedMessage);
    }
  }

  private isLogLevelEnabled(level: string): boolean {
    const logLevels = ['log', 'error', 'warn', 'debug', 'verbose'];
    const currentLogLevelIndex = logLevels.indexOf(level);
    return currentLogLevelIndex <= LOG_LEVEL;
  }

  private formatMessage(message: any, context?: string): string {
    return `[${new Date().toISOString()}] [${
      context || 'Custom Logger'
    }] - ${message}`;
  }
}
