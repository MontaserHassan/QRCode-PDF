/* eslint-disable prettier/prettier */
import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException, HttpStatus, HttpException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { AxiosError } from 'axios';
import { MongoServerError } from 'mongodb';
import logger from 'src/Configs/logger.config';



@Catch()
export default class ValidationExceptionFilter implements ExceptionFilter {

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest<Request>();
        const response = ctx.getResponse<Response>();

        if (response.headersSent) return;

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let details = null;

        if (exception instanceof BadRequestException) {
            status = exception.getStatus();
            const exceptionResponse: any = exception.getResponse();
            message = Array.isArray(exceptionResponse.message) ? exceptionResponse.message[0] : exceptionResponse.message
            details = Array.isArray(exceptionResponse.message) ? exceptionResponse.message : [exceptionResponse.message];
        } else if (exception instanceof NotFoundException) {
            status = exception.getStatus();
            const exceptionResponse: any = exception.getResponse();
            message = Array.isArray(exceptionResponse.message) ? exceptionResponse.message[0] : exceptionResponse.message
            details = Array.isArray(exceptionResponse.message) ? exceptionResponse.message : [exceptionResponse.message];
        } else if (exception instanceof UnauthorizedException) {
            status = exception.getStatus();
            const exceptionResponse: any = exception.getResponse();
            message = exceptionResponse.message;
        } else if (exception instanceof HttpException) {
            status = exception.getStatus();
            const exceptionResponse: any = exception.getResponse();
            message = Array.isArray(exceptionResponse.message) ? exceptionResponse.message : [exceptionResponse.message];
            details = Array.isArray(exceptionResponse.message) ? exceptionResponse.message : null;
        } else if (exception instanceof MongoServerError) {
            if (exception.code === 11000) {
                message = exception.message
            } else {
                message = `This ${Object?.values(exception?.keyValue)?.join(', ')} value for key ${Object?.keys(exception?.keyPattern)?.join(', ')} already exists.` || exception.message;
            };
            status = HttpStatus.CONFLICT;
            details = exception.keyValue;
        } else if (exception instanceof Error) {
            message = exception.message;
            if (exception.name === "ServerError" || exception.message.includes('Response timeout')) {
                status = HttpStatus.SERVICE_UNAVAILABLE;
            };
            if (exception.name === "MongooseError") {
                status = HttpStatus.CONFLICT;
            };
            if (exception.name === "AxiosError") {
                const error = exception as AxiosError;
                if (error.response?.status) status = error.response.status;
                details = error.response.data;
            };
        };

        const Response = {
            responseCode: status,
            responseMessage: message,
            actionName: request.url === "/action" ? request.body['actionName'] : "",
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