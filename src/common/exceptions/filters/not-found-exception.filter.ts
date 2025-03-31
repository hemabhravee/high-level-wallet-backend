import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { DataErrorObjectResponseDTO } from 'src/common/dtos/data-error-object-response.dto';

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = HttpStatus.NOT_FOUND;
    const message = exception.message;

    response.status(status).json(
      new DataErrorObjectResponseDTO({
        message,
        error: exception.name,
        timestamp: new Date().toISOString(),
      }),
    );
  }
}
