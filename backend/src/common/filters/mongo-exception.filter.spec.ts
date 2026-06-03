import { ArgumentsHost } from '@nestjs/common';
import { MongoServerError } from 'mongodb';
import { MongoExceptionFilter } from './mongo-exception.filter';

describe('MongoExceptionFilter', () => {
  const filter = new MongoExceptionFilter();

  const createHost = () => {
    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });
    const host = {
      switchToHttp: () => ({
        getResponse: () => ({ status }),
      }),
    } as unknown as ArgumentsHost;

    return { host, status, json };
  };

  it('maps duplicate key errors to 409', () => {
    const { host, status, json } = createHost();
    const exception = new MongoServerError('duplicate key');
    exception.code = 11000;

    filter.catch(exception, host);

    expect(status).toHaveBeenCalledWith(409);
    expect(json).toHaveBeenCalledWith({
      statusCode: 409,
      message: 'Email already registered',
      error: 'Conflict',
    });
  });

  it('maps other mongo errors to 500', () => {
    const { host, status, json } = createHost();
    const exception = new MongoServerError('connection failed');
    exception.code = 1;

    filter.catch(exception, host);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({
      statusCode: 500,
      message: 'Internal server error',
      error: 'Internal Server Error',
    });
  });
});
