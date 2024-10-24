/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

import DigitalSignatureController from './digital-signature.controller';
import DigitalSignatureService from './digital-signature.service';
import TokenService from '../user/token.service';
import { User, userSchema } from '../user/entities/user.entity';
import { Token, TokenSchema } from '../user/entities/token.entity';
import { DigitalSignature, digitalSignatureSchema } from './entities/digital-signature.entity';
import { AuthGuard } from '../Guards/auth/auth.guard';
import Util from '../Utils/util.util';
import TokenUtil from '../Utils/token.util';
import QRCodePDFUtil from 'src/Utils/qrcode-pdf.util';
import UserService from 'src/user/user.service';
import { FileWithSinging, fileWithSingingSchema } from './entities/file-with-signature.entity';



@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: userSchema }, { name: Token.name, schema: TokenSchema },
      { name: DigitalSignature.name, schema: digitalSignatureSchema }, { name: FileWithSinging.name, schema: fileWithSingingSchema },
    ]),
    ConfigModule.forRoot({ isGlobal: true, }),
    JwtModule.register({ secret: process.env.JWT_SECRET }),
  ],
  controllers: [DigitalSignatureController],
  providers: [DigitalSignatureService, UserService, TokenService, TokenUtil, Util, QRCodePDFUtil, AuthGuard],
})
export class DigitalSignatureModule { };