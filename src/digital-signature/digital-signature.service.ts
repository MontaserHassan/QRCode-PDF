/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';

import CreateDigitalSignatureDto from './dto/create-digital-signature.dto';
import UpdateDigitalSignatureDto from './dto/update-digital-signature.dto';
import { InjectModel } from '@nestjs/mongoose';
import { DigitalSignature, DigitalSignatureDocument } from './entities/digital-signature.entity';
import { Model } from 'mongoose';
import FilterDigitalSignatureDataDto from './dto/filter-digital-signature-data.dto';



@Injectable()
export default class DigitalSignatureService {

  constructor(@InjectModel(DigitalSignature.name) private digitalSignatureModel: Model<DigitalSignatureDocument>) { };

  async create(createDigitalSignatureDto: CreateDigitalSignatureDto) {
    const newDigitalSignature = await this.digitalSignatureModel.create(createDigitalSignatureDto);
    return newDigitalSignature;
  };

  async findAll() {
    const users = await this.digitalSignatureModel.find().select('-__v');
    return users;
  };

  async findOne(filterData: FilterDigitalSignatureDataDto) {
    const user = await this.digitalSignatureModel.findOne(filterData).select('-__v');
    return user;
  };

  async findById(filterData: FilterDigitalSignatureDataDto) {
    const user = await this.digitalSignatureModel.findById(filterData).select('-__v');
    return user;
  };

  async update(updateDigitalSignatureDto: UpdateDigitalSignatureDto) {
    const updatedDigitalSignature = await this.digitalSignatureModel.findOneAndUpdate({ userId: updateDigitalSignatureDto.userId }, { qrCode: updateDigitalSignatureDto.qrCode }, { new: true }).select('-__v');
    return updatedDigitalSignature;
  };

};