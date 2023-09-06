import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { isNil } from 'lodash';
import { map, Observable } from 'rxjs';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse<Response>();
    const contentType = response.getHeader('Content-Type');

    return next.handle().pipe(
      map((data) => {
        if (contentType === 'application/xml') {
          return data;
        }

        if (isNil(data)) {
          data = null;
        }

        return {
          success: true,
          data,
        };
      }),
    );
  }
}
