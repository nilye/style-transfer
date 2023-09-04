import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { validationExceptionFactory } from './common/exception';
import { AllExceptionFilter, HttpExceptionFilter } from './common/filter';
import { TransformInterceptor } from './common/interceptor';

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

  await app.listen(process.env.PORT || 3100);
}
bootstrap();
