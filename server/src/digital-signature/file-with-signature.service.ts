/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { FileWithSinging, FileWithSingingDocument } from './entities/file-with-signature.entity';



@Injectable()
export default class DigitalSignatureService {

  constructor(@InjectModel(FileWithSinging.name) private digitalSignatureModel: Model<FileWithSingingDocument>) { };

  async create() { };

  async findAll() { };

  async findOne() { };

  async findById() { };

  async update() { };

};