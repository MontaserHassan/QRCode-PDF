/* eslint-disable prettier/prettier */
import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException, HttpStatus, } from '@nestjs/common';
import { Request, Response } from 'express';
import { MongoServerError } from 'mongodb';
import CustomExceptionFilter from '../Error/error-exception.error';
import { CommonMessage } from 'src/Messages/index.message';
import logger from 'src/Configs/logger.config';



@Catch()
export default class ValidationExceptionFilter implements ExceptionFilter {

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest<Request>();
        const response = ctx.getResponse<Response>();

        if (response.headersSent) return;

        let status: number = HttpStatus.INTERNAL_SERVER_ERROR;
        let message: string = CommonMessage.SERVER_DOWN;
        let fields: string[] | null = null;
        let details: string[] | null = null;

        if (exception instanceof CustomExceptionFilter) {
            status = exception.getStatus();
            const exceptionResponse: any = exception.getResponse();
            message = exceptionResponse.message;
            fields = exceptionResponse.fields;
        } else if (exception instanceof BadRequestException) {
            status = exception.getStatus();
            const exceptionResponse: any = exception.getResponse();
            const validationMessages = exceptionResponse.message;
            message = Array.isArray(validationMessages) ? validationMessages[0] : validationMessages;
            fields = Array.isArray(validationMessages) ? validationMessages : [validationMessages];
            details = Array.isArray(validationMessages) ? validationMessages : [validationMessages];
        } else if (exception instanceof MongoServerError) {
            if (exception.code === 11000) {
                message = exception.message;
            } else {
                message = `This ${Object?.values(exception?.keyValue)?.join(', ')} value for key ${Object?.keys(exception?.keyPattern)?.join(', ')} already exists.` || exception.message;
            };
            status = HttpStatus.CONFLICT;
            details = exception.keyValue;
        };

        const Response = {
            responseCode: status,
            responseMessage: message,
            actionName: request.url === "/action" ? request.body['actionName'] : "",
            fields: fields,
            details: details,
            path: request.url,
            timestamp: new Date().toISOString(),
            errorLevel: 2,
        };
        response.locals = Response;
        logger.error(`Error at path: ${Response.path}`, { request, response, requestNumberTrace: request.requestNumberTrace }, Response);
        return response.status(Response.responseCode).send(Response);
    };

};