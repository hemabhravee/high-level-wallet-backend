import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { MongoExceptionFilter } from './common/exceptions/filters/mongo-exception.filter';
import { NotFoundExceptionFilter } from './common/exceptions/filters/not-found-exception.filter';
import { BadRequestExceptionFilter } from './common/exceptions/filters/bad-request-exception.filter';
import { MongooseValidationExceptionFilter } from './common/exceptions/filters/mongoose-validation-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Enable transformation
      whitelist: true, // Strip properties not in the DTO
    }),
  );

  app.useGlobalFilters(
    new MongoExceptionFilter(),
    new NotFoundExceptionFilter(),
    new BadRequestExceptionFilter(),
    new MongooseValidationExceptionFilter(),
  );

  app.enableCors();

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
