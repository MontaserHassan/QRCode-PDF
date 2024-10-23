/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

import UserController from './user.controller';
import UserService from './user.service';
import { User, userSchema } from './entities/user.entity';
import TokenUtil from '../Utils/token.util';
import { AuthGuard } from '../Guards/auth/auth.guard';
import TokenService from './token.service';
import { Token, TokenSchema } from './entities/token.entity';
import Util from '../Utils/util.util';



@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: userSchema }, { name: Token.name, schema: TokenSchema }]),
    ConfigModule.forRoot({ isGlobal: true, }),
    JwtModule.register({ secret: process.env.JWT_SECRET }),
  ],
  controllers: [UserController],
  providers: [UserService, TokenService, TokenUtil, Util, AuthGuard],
})
export default class UserModule { };