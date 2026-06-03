import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of, throwError } from 'rxjs';
import { LoggingInterceptor } from './logging.interceptor';

describe('LoggingInterceptor', () => {
  const interceptor = new LoggingInterceptor();

  const createContext = (statusCode = 200): ExecutionContext => {
    const response = { statusCode };
    const request = { method: 'GET', url: '/users/me' };

    return {
      switchToHttp: () => ({
        getRequest: () => request,
        getResponse: () => response,
      }),
    } as ExecutionContext;
  };

  it('logs successful requests', (done) => {
    const logSpy = jest.spyOn(interceptor['logger'], 'log');
    const context = createContext(200);
    const next: CallHandler = { handle: () => of({ ok: true }) };

    interceptor.intercept(context, next).subscribe({
      complete: () => {
        expect(logSpy).toHaveBeenCalledWith(
          expect.stringMatching(/^GET \/users\/me 200 \d+ms$/),
        );
        logSpy.mockRestore();
        done();
      },
    });
  });

  it('logs failed requests', (done) => {
    const warnSpy = jest.spyOn(interceptor['logger'], 'warn');
    const context = createContext();
    const next: CallHandler = {
      handle: () =>
        throwError(() => ({ status: 401, message: 'Unauthorized' })),
    };

    interceptor.intercept(context, next).subscribe({
      error: () => {
        expect(warnSpy).toHaveBeenCalledWith(
          expect.stringContaining('GET /users/me 401'),
        );
        warnSpy.mockRestore();
        done();
      },
    });
  });
});
