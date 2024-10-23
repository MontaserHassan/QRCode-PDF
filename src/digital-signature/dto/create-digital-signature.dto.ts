/* eslint-disable prettier/prettier */
import { IsString, IsOptional, IsNumber, IsNotEmpty } from 'class-validator';



export default class CreateDigitalSignatureDto {
    @IsString({ message: 'User Id must be a string', })
    @IsOptional()
    userId: string;

    @IsString({ message: 'User Id must be a string', })
    @IsOptional()
    userCode: string;

    @IsString({ message: 'QR Code must be a number', })
    @IsOptional()
    qrCode?: string;

    @IsNumber({}, { message: 'Signature Number must be a number', })
    @IsOptional()
    signatureNumber?: number;

    @IsString({ message: 'Subscription Way must be a string', })
    @IsNotEmpty({ message: 'Subscription Way is required' })
    subscriptionWay: string;

    @IsString({ message: 'Subscription Expiry Date must be a string', })
    @IsOptional()
    subscriptionExpiryDate?: Date;

    @IsString({ message: 'Is Paid must be a string', })
    @IsNotEmpty({ message: 'Is Paid is required', })
    isPaid: boolean;

    @IsString({ message: 'Active must be a string', })
    @IsOptional()
    active: boolean;

    @IsString({ message: 'Role must be a string', })
    @IsOptional()
    role?: string
};