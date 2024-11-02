/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

import TokenUtil from '../../Utils/token.util';
import AuthUser from '../../Interfaces/user.interface';
import CustomExceptionFilter from '../../Error/error-exception.error';



@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private readonly tokenUtil: TokenUtil) { };

  canActivate(context: ExecutionContext,): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const response: Response = context.switchToHttp().getResponse();
    return this.validateRequest(request, response);
  };

  async validateRequest(request: Request, response: Response) {
    try {
      const headerToken = request.headers['authorization'];
      if (!headerToken) throw new CustomExceptionFilter(`Invalid header`, 401, ['headers', 'Authorization']);

      const token = this.tokenUtil.extractToken(headerToken);
      if (!token) throw new CustomExceptionFilter(`Invalid token`, 401, ['token', 'Authorization']);

      const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;
      if (!decoded) throw new CustomExceptionFilter(`Invalid token signature`, 401, ['token', 'Authorization']);
      if (decoded && decoded.expiryDate < new Date) throw new CustomExceptionFilter(`Token Expired`, 401, ['token', 'Authorization']);

      request.user = { userId: decoded.userId, email: decoded.email, role: decoded.role, tokenId: decoded.tokenId, expiryDate: decoded.expiryDate, } as AuthUser;
      return true;
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) throw new CustomExceptionFilter(`Token Expired`, 401, ['token', 'Authorization']);
      throw err;
    };
  };

};