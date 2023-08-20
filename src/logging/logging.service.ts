import { Injectable, LoggerService } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { LOG_DIR, LOG_LEVEL, LOG_MAX_SIZE } from 'src/resources/constants';
type LogLevel = 'log' | 'error' | 'warn' | 'debug' | 'verbose';

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
  private errFileIndex: number = 0;

  constructor() {
    this.loggerStream = this.createLogFileStream('log');
    this.errorLoggerStream = this.createLogFileStream('error');
  }

  log(message: any, context?: string) {
    this.writeLog('log', message, context);
  }

  error(message: any, trace?: string, context?: string) {
    this.writeLog('error', message, context);
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

  private createLogFileStream(type: LogLevel = 'log'): fs.WriteStream {
    const logFileName = this.getLogFileName(type);
    return fs.createWriteStream(logFileName, { flags: 'a' });
  }

  private getLogFileName(type: LogLevel): string {
    const currentDate = new Date().toISOString().slice(0, 10);
    const prefix =
      type === 'log' ? this.logFilePrefix : this.errorLogFilePrefix;
    const extension =
      type === 'log' ? this.logFileExtension : this.errorLogFileExtension;
    const index = type === 'log' ? this.logFileIndex : this.errFileIndex;
    return path.join(
      this.logDirectory,
      `${prefix}_${currentDate}_${index}.${extension}`,
    );
  }

  private writeLog(level: LogLevel, message: any, context?: string) {
    if (this.isLogLevelEnabled(level)) {
      const formattedMessage = this.formatMessage(message, context);
      const targetStream =
        level === 'error' ? this.errorLoggerStream : this.loggerStream;
      targetStream.write(`${formattedMessage}\n`);
      fs.stat(this.getLogFileName(level), (err, stats) => {
        if (err) {
          console.error('Error getting file stats:', err);
          return;
        }
        const logMaxSize = LOG_MAX_SIZE * 1024;
        if (stats.size >= logMaxSize) {
          targetStream.end();
          if (level === 'error') {
            this.errFileIndex++;
          } else {
            this.logFileIndex++;
          }
          const newStream = this.createLogFileStream(level);
          if (level === 'error') {
            this.errorLoggerStream = newStream;
          } else {
            this.loggerStream = newStream;
          }
        }
      });
      console[level](formattedMessage);
    }
  }

  private isLogLevelEnabled(level: string): boolean {
    const logLevels = ['error', 'warn', 'log', 'verbose', 'debug'];
    const currentLogLevelIndex = logLevels.indexOf(level);
    return currentLogLevelIndex <= LOG_LEVEL;
  }

  private formatMessage(message: any, context?: string): string {
    return `[${new Date().toISOString()}] [${
      context || 'Custom Logger'
    }] - ${message}`;
  }
}
