import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');
  private readonly logFile = path.join(process.cwd(), 'logs', 'requests.log');

  constructor() {
    // Create logs directory if it doesn't exist
    const logDir = path.dirname(this.logFile);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    
    const { method, url, ip } = request;
    const userAgent = request.get('user-agent') || '';
    const now = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const { statusCode } = response;
          const delay = Date.now() - now;
          
          this.logRequest(ip, method, url, statusCode, delay, userAgent);
        },
        error: (error) => {
          const statusCode = error.status || 500;
          const delay = Date.now() - now;
          
          this.logRequest(ip, method, url, statusCode, delay, userAgent, error.message);
        },
      }),
    );
  }

  private logRequest(
    ip: string,
    method: string,
    url: string,
    statusCode: number,
    delay: number,
    userAgent: string,
    error?: string,
  ) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${ip} "${method} ${url}" ${statusCode} ${delay}ms "${userAgent}"${error ? ` - Error: ${error}` : ''}\n`;

    // Log to console
    if (statusCode >= 500) {
      this.logger.error(logMessage.trim());
    } else if (statusCode >= 400) {
      this.logger.warn(logMessage.trim());
    } else {
      this.logger.log(logMessage.trim());
    }

    // Log to file
    fs.appendFile(this.logFile, logMessage, (err) => {
      if (err) {
        this.logger.error(`Failed to write to log file: ${err.message}`);
      }
    });
  }
}
