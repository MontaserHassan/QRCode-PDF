/* eslint-disable prettier/prettier */
import { IsString, IsEmail, IsNotEmpty, Matches, MinLength, MaxLength, } from 'class-validator';
import { Transform } from 'class-transformer';



export default class CreateUserDto {
    @IsEmail({}, { message: 'Invalid email address' })
    @IsNotEmpty({ message: 'Email is required' })
    @Transform(({ value }) => value.toLowerCase())
    email: string;

    @IsString()
    @IsNotEmpty({ message: 'Password is required' })
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @MaxLength(15, { message: 'Password cannot be longer than 15 characters' })
    @Matches(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%&*_])[A-Za-z\d!@#$%&*_]{8,15}$/, { message: 'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character (!@#$%&*_)', })
    readonly password: string;

    @IsString()
    @IsNotEmpty({ message: 'Role should not be empty' })
    @Transform(({ value }) => value.toLowerCase())
    readonly role: string;
};