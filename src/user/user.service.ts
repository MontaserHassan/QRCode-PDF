/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UserDocument } from './entities/user.entity';
import CreateUserDto from './dto/create-user.dto';
import UpdateUserDto from './dto/update-user.dto';
import FilterUserDataDto from './dto/filter-data-user.dto';
import UpdateUserPasswordDto from './dto/update-password-user.dto';



@Injectable()
export default class UserService {

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

  async create(createUserDto: CreateUserDto) {
    const createdUser = await this.userModel.create(createUserDto);
    return createdUser;
  }

  async findAll(): Promise<User[]> {
    const users = await this.userModel.find().select('-__v -createdAt -updatedAt').sort({ name: 1 });
    return users;
  };

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).select('-__v -createdAt -updatedAt');
    return user;
  };

  async findOne(filterData: FilterUserDataDto): Promise<User> {
    const user = await this.userModel.findOne(filterData as Partial<User>).select('-__v -createdAt -updatedAt');
    return user;
  };

  async update(id: string, updateUserDto: UpdateUserDto) {
    const updateUser = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).select('-__v -createdAt -updatedAt')
    return updateUser;
  };

  async updateByEmail(email: string) {
    const updatedUser = await this.userModel.findOneAndUpdate({ email: email }, { logged: false }, { new: true }).select('-__v -createdAt -updatedAt')
    return updatedUser;
  };

  async updatePassword(id: string, updateUserPasswordDto: UpdateUserPasswordDto) {
    const updatedUser = await this.userModel.findById(id);
    updatedUser.password = updateUserPasswordDto.password;
    return updatedUser.save();
  };

  async remove(email: string) {
    const deletedUser = await this.userModel.findOneAndDelete({ email }).select('-__v -createdAt -updatedAt');
    return deletedUser;
  };

};