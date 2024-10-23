/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { DigitalSignatureModule } from './digital-signature/digital-signature.module';

import AppController from './app.controller';
import AppService from './app.service';
import UserModule from './user/user.module';



@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, }),
    MongooseModule.forRoot(process.env.DB_URI),
    JwtModule.register({ secret: process.env.JWT_SECRET }),
    UserModule,
    DigitalSignatureModule,
  ],
  controllers: [AppController,],
  providers: [AppService,],
})



export class AppModule { };