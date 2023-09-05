import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as bodyParser from 'body-parser';
import * as bodyParserXml from 'body-parser-xml';

import { AppModule } from './app.module';
import { validationExceptionFactory } from './common/exception';
import { AllExceptionFilter, HttpExceptionFilter } from './common/filter';
import { TransformInterceptor } from './common/interceptor';
bodyParserXml(bodyParser);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // filter
  app.useGlobalFilters(new AllExceptionFilter());
  app.useGlobalFilters(new HttpExceptionFilter());

  // pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      stopAtFirstError: true,
      exceptionFactory: validationExceptionFactory,
    }),
  );

  // interceptor
  app.useGlobalInterceptors(new TransformInterceptor());

  // prefix
  app.setGlobalPrefix('/api');

  // xml
  app.use(
    // @ts-ignore
    bodyParser.xml({
      xmlParseOptions: {
        explicitArray: false, // 始终返回数组。默认情况下只有数组元素数量大于 1 是才返回数组。
      },
    }),
  );

  await app.listen(process.env.PORT || 3100);
}
bootstrap();
