/* eslint-disable prettier/prettier */
import { IsString, IsNotEmpty, IsDate, IsNumber } from 'class-validator';



export default class CreateUserDto {

    @IsString()
    @IsNotEmpty({ message: 'User Id is required' })
    readonly userId: string;

    @IsNumber()
    @IsNotEmpty({ message: 'Token Id is required' })
    readonly tokenId: number;

    @IsDate()
    @IsNotEmpty({ message: 'Expiry Date is required' })
    readonly expiryDate: Date;
};