/* eslint-disable prettier/prettier */
import { Controller, Get, Request, Response, } from '@nestjs/common';
import AppService from './app.service';
import { ResponseInterface } from './Interfaces/response.interface';



@Controller()
export default class AppController {

  constructor(private readonly appService: AppService) { };

  @Get('/health')
  getHello(@Request() req, @Response() res,): Record<string, any> {
    const responseData = this.appService.getHello();
    const response: ResponseInterface = {
      responseCode: 200,
      responseMessage: responseData,
      data: {},
    };
    return res.status(response.responseCode).send(response);
  };
};