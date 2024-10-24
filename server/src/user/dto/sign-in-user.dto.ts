/* eslint-disable prettier/prettier */
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { Transform } from 'class-transformer';



export default class SignInUserDto {
    @IsEmail({}, { message: 'Invalid email address' })
    @IsNotEmpty({ message: 'Email is required' })
    @Transform(({ value }) => value.toLowerCase())
    email: string;

    @IsString()
    @IsNotEmpty({ message: 'Password is required' })
    readonly password: string;
};