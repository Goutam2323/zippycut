import { Injectable, NestMiddleware } from '@nestjs/common';
import pinoHttp from 'pino-http';

@Injectable()
export class PinoMiddleware implements NestMiddleware {
  private readonly logger = pinoHttp({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    redact: ['req.headers.authorization'],
  });

  use(req: any, res: any, next: () => void): void {
    this.logger(req, res);
    next();
  }
}
