/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { DigitalSignature, DigitalSignatureDocument } from './entities/digital-signature.entity';
import CreateDigitalSignatureDto from './dto/create-digital-signature.dto';
import UpdateDigitalSignatureDto from './dto/update-digital-signature.dto';
import FilterDigitalSignatureDataDto from './dto/filter-digital-signature-data.dto';



@Injectable()
export default class DigitalSignatureService {

  constructor(@InjectModel(DigitalSignature.name) private digitalSignatureModel: Model<DigitalSignatureDocument>) { };

  async create(createDigitalSignatureDto: CreateDigitalSignatureDto) {
    const newDigitalSignature = await this.digitalSignatureModel.create(createDigitalSignatureDto);
    return newDigitalSignature;
  };

  async findAll() {
    const digitalSignatures = await this.digitalSignatureModel.find().select('-__v');
    return digitalSignatures;
  };

  async findOne(filterData: FilterDigitalSignatureDataDto) {
    const digitalSignature = await this.digitalSignatureModel.findOne(filterData).select('-__v');
    return digitalSignature;
  };

  async findById(dsId: string) {
    const digitalSignature = await this.digitalSignatureModel.findById(dsId).select('-__v');
    return digitalSignature;
  };

  async update(updateDigitalSignatureDto: UpdateDigitalSignatureDto) {
    const updatedDigitalSignature = await this.digitalSignatureModel.findOneAndUpdate({ userId: updateDigitalSignatureDto.userId }, { qrCode: updateDigitalSignatureDto.qrCode }, { new: true }).select('-__v');
    return updatedDigitalSignature;
  };

};