import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const { method, url } = request;
    const started = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const response = context.switchToHttp().getResponse<Response>();
          const ms = Date.now() - started;
          this.logger.log(`${method} ${url} ${response.statusCode} ${ms}ms`);
        },
        error: (err: { status?: number; message?: string }) => {
          const ms = Date.now() - started;
          const status = err.status ?? 500;
          this.logger.warn(
            `${method} ${url} ${status} ${ms}ms - ${err.message ?? 'Error'}`,
          );
        },
      }),
    );
  }
}
