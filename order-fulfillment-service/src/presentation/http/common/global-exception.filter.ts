import { STATUS_CODES } from 'node:http';
import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
  type ExceptionFilter,
} from '@nestjs/common';
import type { Response } from 'express';
import { PaymentProviderError } from '../../../application/payments/payment-provider.error.js';
import { NoAvailableWarehouseError } from '../../../application/warehouses/no-available-warehouse.error.js';

interface ErrorDetails {
  statusCode: number;
  message: string | string[];
  error: string;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const details = this.resolveError(exception);

    response.status(details.statusCode).json(details);
  }

  private resolveError(exception: unknown): ErrorDetails {
    if (exception instanceof NoAvailableWarehouseError) {
      return this.createErrorDetails(
        HttpStatus.CONFLICT,
        exception.message,
      );
    }

    if (exception instanceof PaymentProviderError) {
      return this.createErrorDetails(
        HttpStatus.BAD_GATEWAY,
        exception.message,
      );
    }

    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      const response = exception.getResponse();

      if (typeof response === 'string') {
        return this.createErrorDetails(statusCode, response);
      }

      const message = this.readMessage(response) ?? exception.message;
      const error = this.readError(response) ?? STATUS_CODES[statusCode];

      return {
        statusCode,
        message,
        error: error ?? 'Error',
      };
    }

    return this.createErrorDetails(
      HttpStatus.INTERNAL_SERVER_ERROR,
      'Internal server error',
    );
  }

  private createErrorDetails(
    statusCode: number,
    message: string | string[],
  ): ErrorDetails {
    return {
      statusCode,
      message,
      error: STATUS_CODES[statusCode] ?? 'Error',
    };
  }

  private readMessage(value: object): string | string[] | undefined {
    if (!('message' in value)) {
      return undefined;
    }

    const { message } = value as { message?: unknown };
    return typeof message === 'string' ||
      (Array.isArray(message) &&
        message.every((item) => typeof item === 'string'))
      ? message
      : undefined;
  }

  private readError(value: object): string | undefined {
    if (!('error' in value)) {
      return undefined;
    }

    const { error } = value as { error?: unknown };
    return typeof error === 'string' ? error : undefined;
  }
}