/* eslint-disable prettier/prettier */
import { HttpStatus, HttpException } from '@nestjs/common';



export class customExceptionFilter extends HttpException {

    constructor(message: string, status: HttpStatus = HttpStatus.BAD_REQUEST, fields: string[]) {
        super({ message, fields }, status);
    };

};