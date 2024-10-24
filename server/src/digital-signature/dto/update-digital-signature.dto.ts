/* eslint-disable prettier/prettier */
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';



export default class UpdateDigitalSignatureDto {
    @IsString()
    @IsNotEmpty({ message: 'User Id is required' })
    userId: string;

    @IsString({ message: 'QR Code must be a string', })
    @IsOptional()
    qrCode: string;

    @IsString({ message: 'Subscription Way must be a string', })
    @IsOptional()
    subscriptionWay: string;

    @IsString({ message: 'Subscription Expiry Date must be a string', })
    @IsOptional()
    subscriptionExpiryDate?: Date;

    @IsString({ message: 'Is Paid must be a string', })
    @IsOptional()
    isPaid: boolean;

    @IsString({ message: 'Active must be a string', })
    @IsOptional()
    active: boolean;

};