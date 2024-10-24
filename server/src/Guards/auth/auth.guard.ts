/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

import TokenUtil from 'src/Utils/token.util';
import AuthUser from '../../Interfaces/user.interface';



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
      if (!headerToken) throw new UnauthorizedException("Invalid header");

      const token = this.tokenUtil.extractToken(headerToken);
      if (!token) throw new UnauthorizedException("Invalid token");

      const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;
      if (!decoded) throw new UnauthorizedException("Invalid Token Signature");

      if (decoded && decoded.expiryDate < new Date) throw new UnauthorizedException("Token expired");

      request.user = { userId: decoded.userId, email: decoded.email, role: decoded.role, tokenId: decoded.tokenId, expiryDate: decoded.expiryDate, } as AuthUser;

      return true;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    };
  };

};