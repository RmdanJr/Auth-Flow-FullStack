import { Catch, ExceptionFilter, ArgumentsHost, Logger } from '@nestjs/common';
import { MongoServerError } from 'mongodb';
import { Response } from 'express';

@Catch(MongoServerError)
export class MongoExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(MongoExceptionFilter.name);

  catch(exception: MongoServerError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception.code === 11000) {
      this.logger.warn(`Duplicate key error: ${exception.message}`);
      response.status(409).json({
        statusCode: 409,
        message: 'Email already registered',
        error: 'Conflict',
      });
      return;
    }

    this.logger.error(
      `MongoDB error (code ${exception.code}): ${exception.message}`,
      exception.stack,
    );

    response.status(500).json({
      statusCode: 500,
      message: 'Internal server error',
      error: 'Internal Server Error',
    });
  }
}
