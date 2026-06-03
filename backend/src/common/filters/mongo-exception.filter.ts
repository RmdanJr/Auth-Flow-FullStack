import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { MongoServerError } from 'mongodb';
import { Response } from 'express';

@Catch(MongoServerError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoServerError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception.code === 11000) {
      response.status(409).json({
        statusCode: 409,
        message: 'Email already registered',
        error: 'Conflict',
      });
      return;
    }

    response.status(500).json({
      statusCode: 500,
      message: 'Internal server error',
      error: 'Internal Server Error',
    });
  }
}
