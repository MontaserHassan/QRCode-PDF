/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, NotFoundException, UseGuards, Request, Response, } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import UserService from './user.service';
import CreateUserDto from './dto/create-user.dto';
import UpdateUserDto from './dto/update-user.dto';
import SignInUserDto from './dto/sign-in-user.dto';
import UpdateUserPasswordDto from './dto/update-password-user.dto';
import TokenUtil from '../Utils/token.util';
import { AuthGuard } from '../Guards/auth/auth.guard';



@Controller('user')
export default class UserController {

  constructor(private readonly userService: UserService, private readonly tokenUtil: TokenUtil) { };

  @Post('/register')
  async register(@Response() res, @Body() createUserDto: CreateUserDto) {
    const { email } = createUserDto;
    const isUserExisting = await this.userService.findOne({ email });
    if (isUserExisting && isUserExisting.email === email) throw new NotFoundException(`User with Email ${createUserDto.email} already exists`);
    const createdUser = await this.userService.create(createUserDto);
    const response = {
      responseMessage: "User created successfully",
      responseCode: 201,
      data: {
        user: createdUser,
      },
    };
    res.locals = response;
    return res.status(response.responseCode).send(response);
  };

  @Post('/login')
  async login(@Response() res, @Body() signInUserDto: SignInUserDto) {
    const { email, password } = signInUserDto;
    const user = await this.userService.findOne({ email });
    if (!user) throw new NotFoundException(`Email or Password is not correct`);
    const currentTime = new Date();
    const hasTokenActive = await this.tokenUtil.hasTokenActiveByUserId(user._id);
    if (hasTokenActive && hasTokenActive.expiryDate > currentTime && user.logged) throw new NotFoundException(`User with Email ${email} is already logged in`);
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) throw new NotFoundException(`Email or Password is not correct`);
    const createdToken = await this.tokenUtil.createToken(user.email, user._id, user.role);
    const updatedUser = await this.userService.update(user._id, { logged: true, lastSeen: new Date() });
    const response = {
      responseMessage: "User logged in successfully",
      responseCode: 200,
      data: {
        user: updatedUser,
        token: createdToken,
      },
    };
    res.locals = response;
    return res.status(response.responseCode).send(response);
  };

  @Get('/profile')
  @UseGuards(AuthGuard)
  async getProfile(@Request() req, @Response() res) {
    const isUserExisting = await this.userService.findById(req.user.userId);
    if (!isUserExisting) throw new NotFoundException(`User with ID ${req.user.userId} does not exist`);
    await this.userService.update(isUserExisting._id, { lastSeen: new Date() });
    const response = {
      responseMessage: "User profile fetched successfully",
      responseCode: 200,
      data: {
        user: isUserExisting,
      },
    };
    res.locals = response;
    return res.status(response.responseCode).send(response);
  };

  @Patch('/logout')
  @UseGuards(AuthGuard)
  async logout(@Request() req, @Response() res) {
    await this.userService.update(req.user.userId.toString(), { logged: false, lastSeen: new Date() });
    await this.tokenUtil.deleteToken(req.user.tokenId);
    const response = {
      responseMessage: "User logged out successfully",
      responseCode: 200,
      data: {},
    };
    res.locals = response;
    return res.status(response.responseCode).send(response);
  };

  @Patch('/')
  @UseGuards(AuthGuard)
  async update(@Request() req, @Response() res, @Body() updateUserDto: UpdateUserDto) {
    if (updateUserDto['password'] || updateUserDto['role']) throw new NotFoundException(`Updating password or role is not allowed`);
    const isUserExisting = await this.userService.findById(req.user.userId);
    if (!isUserExisting) throw new NotFoundException(`User with ID ${req.user.userId} does not exist`);
    const updatedUser = await this.userService.update(req.user.userId, updateUserDto);
    const response = {
      responseMessage: "User updated successfully",
      responseCode: 200,
      data: {
        user: updatedUser,
      },
    };
    return res.status(response.responseCode).send(response);
  };

  @Patch('/password')
  @UseGuards(AuthGuard)
  async updatePassword(@Request() req, @Response() res, @Body() updateUserPasswordDto: UpdateUserPasswordDto) {
    const isUserExisting = await this.userService.findById(req.user.userId);
    if (!isUserExisting) throw new NotFoundException(`User with ID ${req.user.userId} does not exist`);
    const updatedUser = await this.userService.updatePassword(req.user.userId, updateUserPasswordDto);
    const response = {
      responseMessage: "User updated successfully",
      responseCode: 200,
      data: {
        user: updatedUser,
      },
    };
    return res.status(response.responseCode).send(response);
  };

};