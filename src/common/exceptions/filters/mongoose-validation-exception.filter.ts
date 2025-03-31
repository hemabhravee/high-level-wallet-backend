import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Error } from 'mongoose';
import { Response } from 'express';
import { DataErrorObjectResponseDTO } from 'src/common/dtos/data-error-object-response.dto';

@Catch(Error.ValidationError)
export class MongooseValidationExceptionFilter implements ExceptionFilter {
  catch(exception: Error.ValidationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = HttpStatus.BAD_REQUEST;
    const message = exception.message;

    const validationErrors = {};
    if (exception.errors) {
      Object.keys(exception.errors).forEach((key) => {
        validationErrors[key] = exception.errors[key].message;
      });
    }

    response.status(status).json(
      new DataErrorObjectResponseDTO({
        message,
        error: exception.name,
        validationErrors,
        timestamp: new Date().toISOString(),
      }),
    );
  }
}
