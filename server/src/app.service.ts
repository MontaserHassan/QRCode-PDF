/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';



@Injectable()
export default class AppService {
  getHello(): string {
    return 'Hello from project: Digital Signature!';
  };
};