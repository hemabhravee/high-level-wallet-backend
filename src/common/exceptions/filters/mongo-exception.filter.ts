import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { MongoError } from 'mongodb';
import { Response } from 'express';
import { DataErrorObjectResponseDTO } from 'src/common/dtos/data-error-object-response.dto';

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = HttpStatus.BAD_REQUEST;
    let message = 'Database Error: ' + exception.message;

    // Handle duplicate key error
    if (exception.code === 11000) {
      // Try to extract the duplicate field name from the error message
      const keyValue = (exception as any).keyValue;
      const field = keyValue ? Object.keys(keyValue)[0] : 'unknown';
      const value = keyValue ? keyValue[field] : '';

      message = `Duplicate value for ${field}: ${value}`;
    }

    response.status(status).json(
      new DataErrorObjectResponseDTO({
        message,
        error: exception.name,
        timestamp: new Date().toISOString(),
      }),
    );
  }
}
