/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Post, Request, Response, NotFoundException, UseGuards, Get, Patch } from '@nestjs/common';
import * as QRCode from 'qrcode';


import DigitalSignatureService from './digital-signature.service';
import fileWithSigningService from './file-with-signature.service';
import UserService from '../user/user.service';
import { ResponseInterface } from '../Interfaces/response.interface';
import { AuthGuard } from '../Guards/auth/auth.guard';
import Util from '../Utils/util.util';
import PDFUtil from '../Utils/pdf.util';
import EncryptionUtil from '../Utils/crypto.util';
import CanvasUtil from '../Utils/canvas.util';
import CreateDigitalSignatureDto from './dto/create-digital-signature.dto';
import UpdateDigitalSignatureDto from './dto/update-digital-signature.dto';
import SignPdfDto from './dto/sign.Pdf.dto';
import { ErrorDigitalSignatureMessage, SuccessDigitalSignatureMessage } from '../Messages/index.message';




@Controller('digital-signature')
export default class DigitalSignatureController {

  constructor(
    private readonly userService: UserService,
    private readonly util: Util,
    private readonly pdfUtil: PDFUtil,
    private readonly encryptionUtil: EncryptionUtil,
    private readonly canvasUtil: CanvasUtil,
    private readonly digitalSignatureService: DigitalSignatureService,
    private readonly fileWithSigningService: fileWithSigningService,
  ) {
  };

  @Post('/')
  @UseGuards(AuthGuard)
  async createDigitalSignature(@Request() req, @Response() res, @Body() createDigitalSignatureDto: CreateDigitalSignatureDto) {
    try {
      const isUserExisting = await this.userService.findById(req.user.userId);
      if (!isUserExisting) throw new NotFoundException(`User with ID ${req.user.userId} does not exist`);
      const isUserHavingDS = await this.digitalSignatureService.findOne({ userId: req.user.userId });
      if (isUserHavingDS) throw new NotFoundException(`Digital Signature with ID ${req.user.userId} already exist`);
      createDigitalSignatureDto.userCode = isUserExisting.userCode;
      createDigitalSignatureDto.userId = isUserExisting._id
      createDigitalSignatureDto.active = createDigitalSignatureDto.isPaid ? true : false;
      createDigitalSignatureDto.signatureNumber = this.util.generateAlphanumericCode(20);
      createDigitalSignatureDto.subscriptionExpiryDate = this.util.calculateSubscriptionExpiryDate(createDigitalSignatureDto.subscriptionWay);
      const signature = this.canvasUtil.createSignature(isUserExisting.userSignature);
      createDigitalSignatureDto.userSignature = signature;
      const newDigitalSignature = await this.digitalSignatureService.create(createDigitalSignatureDto);
      if (!newDigitalSignature) throw new NotFoundException(`Digital Signature with ID ${createDigitalSignatureDto.userId} does not exist`);
      const response: ResponseInterface = {
        responseCode: 200,
        responseMessage: SuccessDigitalSignatureMessage.CREATED,
        data: {
          digitalSignature: newDigitalSignature
        },
      };
      res.locals = response;
      return res.status(response.responseCode).send(response);
    } catch (err) {
      console.log(err);
      throw err;
    };
  };

  @Post('sign-pdf')
  @UseGuards(AuthGuard)
  async signPdf(@Request() req, @Response() res, @Body() signPdfDto: SignPdfDto) {
    try {
      const isUserExisting = await this.userService.findById(req.user.userId);
      if (!isUserExisting) throw new NotFoundException(`User with ID ${req.user.userId} does not exist`);
      const digitalSignature = await this.digitalSignatureService.findOne({ userId: req.user.userId });
      if (!digitalSignature) throw new NotFoundException(`Digital Signature with ID ${req.user.userId} does not exist`);
      const pdfWithSigning = await this.pdfUtil.drawSignatureOnPDF(digitalSignature.userSignature, isUserExisting.role, signPdfDto.pdf);
      const saveFileWithSignature = await this.fileWithSigningService.create({ pdfContent: pdfWithSigning, userId: isUserExisting._id });
      if (!saveFileWithSignature) throw new NotFoundException(`File with signature with ID ${req.user.userId} does not exist`);
      const response: ResponseInterface = {
        responseCode: 200,
        responseMessage: SuccessDigitalSignatureMessage.PDF_SIGNING,
        data: {
          pdfWithSigning: pdfWithSigning,
        },
      };
      // res.locals = response;
      return res.status(response.responseCode).send(response);
    } catch (err) {
      throw err;
    };
  };

  @Get('/')
  @UseGuards(AuthGuard)
  async getDigitalSignature(@Request() req, @Response() res) {
    try {
      const isUserExisting = await this.userService.findById(req.user.userId);
      if (!isUserExisting) throw new NotFoundException(`User with ID ${req.user.userId} does not exist`);
      const digitalSignature = await this.digitalSignatureService.findOne({ userId: req.user.userId });
      if (!digitalSignature) throw new NotFoundException(`Digital Signature with ID ${req.user.userId} does not exist`);
      const response: ResponseInterface = {
        responseCode: 200,
        responseMessage: SuccessDigitalSignatureMessage.GET_SIGNATURE,
        data: {
          digitalSignature: digitalSignature
        },
      };
      res.locals = response;
      return res.status(response.responseCode).send(response);
    } catch (err) {
      throw err;
    };
  };

  @Patch('/')
  @UseGuards(AuthGuard)
  async updateDigitalSignature(@Request() req, @Response() res, @Body() updateDigitalSignatureDto: UpdateDigitalSignatureDto) {
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
        responseMessage: SuccessDigitalSignatureMessage.UPDATED,
        data: {
          digitalSignature: digitalSignature
        },
      };
      res.locals = response;
      return res.status(response.responseCode).send(response);
    } catch (err) {
      throw err;
    };
  };

};