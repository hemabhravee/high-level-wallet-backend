import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { DataErrorObjectResponseDTO } from 'src/common/dtos/data-error-object-response.dto';

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = HttpStatus.BAD_REQUEST;

    // Extract the validation errors
    const exceptionResponse = exception.getResponse() as any;

    // Check if this is a validation error (which has a message array)
    const errorMessage =
      typeof exceptionResponse === 'object' &&
      exceptionResponse.message &&
      Array.isArray(exceptionResponse.message)
        ? exceptionResponse.message // Use the validation error messages
        : exception.message; // Use the general exception message

    response.status(status).json(
      new DataErrorObjectResponseDTO({
        message: errorMessage,
        error: exception.name,
        timestamp: new Date().toISOString(),
      }),
    );
  }
}
