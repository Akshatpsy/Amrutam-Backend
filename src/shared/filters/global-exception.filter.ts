import {
type ArgumentsHost,
Catch,
type ExceptionFilter,
HttpException,
HttpStatus,
} from '@nestjs/common';
import type { FastifyReply, FastifyRequest } from 'fastify';

type ErrorResponse = {
statusCode: number;
message: string | object;
path: string;
timestamp: string;
};

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
catch(exception: unknown, host: ArgumentsHost): void {
const context = host.switchToHttp();
const response = context.getResponse();
const request = context.getRequest();

const statusCode =
  exception instanceof HttpException
    ? exception.getStatus()
    : HttpStatus.INTERNAL_SERVER_ERROR;

const message =
  exception instanceof HttpException
    ? exception.getResponse()
    : 'Internal server error';

const errorResponse: ErrorResponse = {
  statusCode,
  message,
  path: request.url,
  timestamp: new Date().toISOString(),
};

response.status(statusCode).send(errorResponse);
}
}
