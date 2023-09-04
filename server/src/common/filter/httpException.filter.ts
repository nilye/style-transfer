import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();

    const obj = {
      success: false,
      error: {
        code: status,
        message: exception.message,
      },
    };

    this.logger.error(
      exception.message,
      exception?.cause?.toString() + '\n' + exception.stack,
      'HttpExceptionFilter',
    );

    response.status(status).json(obj);
  }
}
