/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, NotFoundException, UseGuards, Request, Response, HttpStatus, } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import UserService from './user.service';
import CreateUserDto from './dto/create-user.dto';
import UpdateUserDto from './dto/update-user.dto';
import SignInUserDto from './dto/sign-in-user.dto';
import UpdateUserPasswordDto from './dto/update-password-user.dto';
import TokenUtil from '../Utils/token.util';
import { AuthGuard } from '../Guards/auth/auth.guard';
import { customExceptionFilter } from 'src/Error/error-exception.error';
import { ErrorUserMessage, SuccessUserMessage } from 'src/Messages/index.message';



@Controller('user')
export default class UserController {

  constructor(private readonly userService: UserService, private readonly tokenUtil: TokenUtil) { };

  @Post('/register')
  async register(@Response() res, @Body() createUserDto: CreateUserDto) {
    try {
      const { email } = createUserDto;
      const isUserExisting = await this.userService.findOne({ email });
      if (isUserExisting && isUserExisting.email === email) throw new customExceptionFilter(ErrorUserMessage.EMAIL_ALREADY_EXISTS, HttpStatus.OK, ['email']);
      const createdUser = await this.userService.create(createUserDto);
      const response = {
        responseMessage: SuccessUserMessage.CREATED,
        responseCode: HttpStatus.CREATED,
        data: {
          user: createdUser,
        },
      };
      res.locals = response;
      return res.status(response.responseCode).send(response);
    } catch (err) {
      throw err;
    };
  };

  @Post('/login')
  async login(@Response() res, @Body() signInUserDto: SignInUserDto) {
    try {
      const { email, password } = signInUserDto;
      const user = await this.userService.findOne({ email });
      if (!user) throw new customExceptionFilter(ErrorUserMessage.INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED, ['email', 'password']);
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) throw new customExceptionFilter(ErrorUserMessage.INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED, ['email', 'password']);
      const createdToken = await this.tokenUtil.createToken(user.email, user._id, user.role);
      const updatedUser = await this.userService.update(user._id, { logged: true, lastSeen: new Date() });
      const response = {
        responseMessage: SuccessUserMessage.LOGGED_IN,
        responseCode: HttpStatus.OK,
        data: {
          user: updatedUser,
          token: createdToken,
        },
      };
      res.locals = response;
      return res.status(response.responseCode).send(response);
    } catch (err) {
      throw err;
    };
  };

  @Get('/profile')
  @UseGuards(AuthGuard)
  async getProfile(@Request() req, @Response() res) {
    try {
      const isUserExisting = await this.userService.findById(req.user.userId);
      if (!isUserExisting) throw new customExceptionFilter(ErrorUserMessage.USER_NOT_FOUND, HttpStatus.UNAUTHORIZED, ['']);
      await this.userService.update(isUserExisting._id, { lastSeen: new Date() });
      const response = {
        responseMessage: SuccessUserMessage.GET_PROFILE,
        responseCode: HttpStatus.OK,
        data: {
          user: isUserExisting,
        },
      };
      res.locals = response;
      return res.status(response.responseCode).send(response);
    } catch (err) {
      throw err;
    };
  };

  @Patch('/logout')
  @UseGuards(AuthGuard)
  async logout(@Request() req, @Response() res) {
    try {
      await this.userService.update(req.user.userId, { logged: false, lastSeen: new Date() });
      await this.tokenUtil.deleteToken(req.user.tokenId);
      const response = {
        responseMessage: SuccessUserMessage.LOGGED_OUT,
        responseCode: HttpStatus.OK,
        data: {},
      };
      res.locals = response;
      return res.status(response.responseCode).send(response);
    } catch (err) {
      throw err;
    };
  };

  @Patch('/')
  @UseGuards(AuthGuard)
  async update(@Request() req, @Response() res, @Body() updateUserDto: UpdateUserDto) {
    if (updateUserDto['password']) throw new customExceptionFilter(ErrorUserMessage.WRONG_DATA, HttpStatus.BAD_REQUEST, ['']);;
    const isUserExisting = await this.userService.findById(req.user.userId);
    if (!isUserExisting) throw new customExceptionFilter(ErrorUserMessage.USER_NOT_FOUND, HttpStatus.BAD_REQUEST, ['']);
    const updatedUser = await this.userService.update(req.user.userId, updateUserDto);
    const response = {
      responseMessage: SuccessUserMessage.UPDATED,
      responseCode: HttpStatus.ACCEPTED,
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
      responseMessage: SuccessUserMessage.PASSWORD_UPDATED,
      responseCode: HttpStatus.ACCEPTED,
      data: {
        user: updatedUser,
      },
    };
    return res.status(response.responseCode).send(response);
  };

};