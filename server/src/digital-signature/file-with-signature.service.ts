/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { FileWithSinging, FileWithSingingDocument } from './entities/file-with-signature.entity';
import CreateFileWithSigningDto from './dto/create-file-with-signature.dto';
import UpdatedFileDto from './dto/update-file-with-signature.dto';



@Injectable()
export default class fileWithSigningService {

  constructor(@InjectModel(FileWithSinging.name) private fileWithSigningModel: Model<FileWithSingingDocument>) { };

  async create(createFileWithSigningDto: CreateFileWithSigningDto) {
    const createdFileWithSigning = await this.fileWithSigningModel.create(createFileWithSigningDto);
    return createdFileWithSigning;
  };

  async findAll() {
    const filesWithSignature = await this.fileWithSigningModel.find().select('-__v');
    return filesWithSignature;
  };

  async findById(fileId: string) {
    const fileWithSignature = await this.fileWithSigningModel.findById(fileId).select('-__v');
    return fileWithSignature;
  };

  async update(updatedFileDto: UpdatedFileDto) {
    const updatedFileWithSignature = await this.fileWithSigningModel.findByIdAndUpdate(updatedFileDto.fileId, updatedFileDto, { new: true }).select('-__v');
    return updatedFileWithSignature;
  };

};