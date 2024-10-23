/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Post, Request, Response, NotFoundException, UseGuards, Get, Patch } from '@nestjs/common';
import * as QRCode from 'qrcode';
import { NextFunction } from 'express';

import DigitalSignatureService from './digital-signature.service';
import { ResponseInterface } from '../Interfaces/response.interface';
import { AuthGuard } from '../Guards/auth/auth.guard';
import CreateDigitalSignatureDto from './dto/create-digital-signature.dto';
import UpdateDigitalSignatureDto from './dto/update-digital-signature.dto';
import TokenUtil from '../Utils/token.util';
import UserService from '../user/user.service';
import Util from '../Utils/util.util';



@Controller('digital-signature')
export default class DigitalSignatureController {

  constructor(private readonly userService: UserService, private readonly tokenUtil: TokenUtil, private readonly util: Util, private readonly digitalSignatureService: DigitalSignatureService) { };

  @Post('/')
  @UseGuards(AuthGuard)
  async createDigitalSignature(@Request() req, @Response() res, @Body() createDigitalSignatureDto: CreateDigitalSignatureDto, next: NextFunction) {
    try {
      const isUserExisting = await this.userService.findById(req.user.userId);
      if (!isUserExisting) throw new NotFoundException(`User with ID ${req.user.userId} does not exist`);
      const IsUserHavingDS = await this.digitalSignatureService.findOne({ userId: req.user.userId });
      if (IsUserHavingDS) {
        throw new NotFoundException(`Digital Signature with ID ${req.user.userId} already exist`)
      };
      createDigitalSignatureDto.userId = req.user.userId
      const qrCode = await QRCode.toDataURL({ userCode: createDigitalSignatureDto.userCode, role: isUserExisting.role, email: isUserExisting.email });
      createDigitalSignatureDto.qrCode = qrCode;
      createDigitalSignatureDto.userId = req.user.userId;
      createDigitalSignatureDto.role = req.user.role;
      createDigitalSignatureDto.userCode = isUserExisting.userCode;
      createDigitalSignatureDto.active = createDigitalSignatureDto.isPaid == true ? true : false;
      createDigitalSignatureDto.subscriptionExpiryDate = this.util.calculateSubscriptionExpiryDate(createDigitalSignatureDto.subscriptionWay);
      const newDigitalSignature = await this.digitalSignatureService.create(createDigitalSignatureDto);
      if (!newDigitalSignature) {
        throw new NotFoundException(`Digital Signature with ID ${createDigitalSignatureDto.userId} does not exist`)
      };
      const response: ResponseInterface = {
        responseCode: 200,
        responseMessage: "Digital Signature created successfully",
        data: {
          digitalSignature: newDigitalSignature
        },
      };
      res.locals = response;
      return res.status(response.responseCode).json(response);
    } catch (err) {
      next(err);
    };
  };

  @Get('/')
  @UseGuards(AuthGuard)
  async getDigitalSignature(@Request() req, @Response() res, next: NextFunction) {
    try {
      const isUserExisting = await this.userService.findById(req.user.userId);
      if (!isUserExisting) throw new NotFoundException(`User with ID ${req.user.userId} does not exist`);
      const digitalSignature = await this.digitalSignatureService.findOne({ userId: req.user.userId });
      if (!digitalSignature) throw new NotFoundException(`Digital Signature with ID ${req.user.userId} does not exist`);
      const response: ResponseInterface = {
        responseCode: 200,
        responseMessage: "Digital Signature fetched successfully",
        data: {
          digitalSignature: digitalSignature
        },
      };
      res.locals = response;
      return res.status(response.responseCode).json(response);
    } catch (err) {
      next(err);
    };
  };

  @Patch('/')
  // @UseGuards(AuthGuard)
  async updateDigitalSignature(@Request() req, @Response() res, @Body() updateDigitalSignatureDto: UpdateDigitalSignatureDto, next: NextFunction) {
    try {
      const isUserExisting = await this.userService.findById(req.user.userId);
      if (!isUserExisting) throw new NotFoundException(`User with ID ${req.user.userId} does not exist`);
      const IsUserHavingDS = await this.digitalSignatureService.findOne({ userId: req.user.userId });
      if (!IsUserHavingDS) throw new NotFoundException(`Digital Signature with ID ${req.user.userId} does not exist`);
      updateDigitalSignatureDto.userId = req.user.userId;
      if (updateDigitalSignatureDto.subscriptionWay) {
        updateDigitalSignatureDto.subscriptionWay = updateDigitalSignatureDto.subscriptionWay;
        updateDigitalSignatureDto.subscriptionExpiryDate = this.util.calculateSubscriptionExpiryDate(updateDigitalSignatureDto.subscriptionWay);
      };
      if (updateDigitalSignatureDto.isPaid && updateDigitalSignatureDto.isPaid === true) {
        updateDigitalSignatureDto.active = true
      };
      const qrCode = await QRCode.toDataURL({ userCode: isUserExisting.userCode, role: isUserExisting.role, email: isUserExisting.email });
      updateDigitalSignatureDto.qrCode = qrCode;
      const digitalSignature = await this.digitalSignatureService.update(updateDigitalSignatureDto);
      if (!digitalSignature) throw new NotFoundException(`Digital Signature with ID ${req.user.userId} does not exist`);
      const response: ResponseInterface = {
        responseCode: 200,
        responseMessage: "Digital Signature updated successfully",
        data: {
          digitalSignature: digitalSignature
        },
      };
      res.locals = response;
      return res.status(response.responseCode).json(response);
    } catch (err) {
      next(err);
    };
  };

};