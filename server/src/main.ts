/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import * as timeOut from 'connect-timeout';

import { AppModule } from './app.module';
import ValidationExceptionFilter from './Exceptions/error.exception';
// import LoggerMiddleware from './logger/logger.middleware';



async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.use(timeOut('30s'));

  app.use(bodyParser.json({ limit: '20mb' }));
  app.useGlobalPipes(new ValidationPipe({ stopAtFirstError: true, whitelist: true, forbidNonWhitelisted: true, transform: true, }),);
  app.useGlobalFilters(new ValidationExceptionFilter());

  app.enableCors({ origin: '*', credentials: true });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT');
  const dbUri = configService.get<string>('DB_URI');

  // app.use(new LoggerMiddleware().use);

  const server = await app.listen(port);
  const address = server.address();

  if (Number(process.env.LOCAL)) {
    Logger.log(`Application is running on: http://localhost:${address.port}/api`, 'Bootstrap',);
    Logger.log(`Connected to the database: ${dbUri}`, 'Bootstrap');
  };

};

bootstrap();