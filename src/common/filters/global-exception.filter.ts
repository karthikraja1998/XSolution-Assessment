import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let details = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        message = (exceptionResponse as any).message || exception.message;
        details = (exceptionResponse as any).error || null;
      } else {
        message = exception.message;
      }
    } else if (exception instanceof Error) {
      // Handle known Sequelize errors or other generic errors here if needed
      if (exception.name === 'SequelizeUniqueConstraintError') {
        status = HttpStatus.CONFLICT;
        message = 'A resource with these unique parameters already exists.';
      } else if (exception.name === 'SequelizeValidationError') {
        status = HttpStatus.BAD_REQUEST;
        message = 'Validation error occurred on the database level.';
      } else {
        this.logger.error(`Unhandled Exception: ${exception.message}`, exception.stack);
      }
    }

    const responseBody: any = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    };

    if (details) {
      responseBody.details = details;
    }

    response.status(status).json(responseBody);
  }
}
