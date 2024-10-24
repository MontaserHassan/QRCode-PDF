/* eslint-disable prettier/prettier */
import { Injectable, NestMiddleware } from '@nestjs/common';

import { Request, Response } from 'express';
import logger from 'src/Configs/logger.config';



@Injectable()
export default class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    const { method, originalUrl } = req;
    const startTime = Date.now();
    const requestNumberTrace = String(Math.floor(Math.random() * 100000000));

    req.requestNumberTrace = requestNumberTrace;
    logger.info(`Incoming Request: ${method} - ${originalUrl}`, { req, requestNumberTrace: req.requestNumberTrace });

    res.on('finish', () => {
      const duration = Date.now() - startTime;
      res.duration = duration;
      logger.info(`Outgoing Response: ${method} - ${originalUrl} - ${res.statusCode}`, { res, requestNumberTrace: req.requestNumberTrace }, res.locals?.responseData || null);
    });
    next();
  };
};