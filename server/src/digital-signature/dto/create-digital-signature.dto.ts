/* eslint-disable prettier/prettier */
import { IsString, IsOptional, IsNotEmpty, IsIn, IsBoolean } from 'class-validator';



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

    @IsString({ message: 'Signature must be a number', })
    @IsOptional()
    userSignature?: string;

    @IsString({ message: 'Signature Number must be a string', })
    @IsOptional()
    signatureNumber?: string;

    @IsString({ message: 'Subscription Way must be a string', })
    @IsNotEmpty({ message: 'Subscription Way is required' })
    @IsIn(['monthly', 'quarterly', 'half-yearly', 'yearly'])
    subscriptionWay: string;

    @IsString({ message: 'Subscription Expiry Date must be a string', })
    @IsOptional()
    subscriptionExpiryDate?: Date;

    @IsBoolean({ message: 'Is Paid must be a boolean', })
    @IsNotEmpty({ message: 'Is Paid is required', })
    isPaid: boolean;

    @IsString({ message: 'Active must be a string', })
    @IsOptional()
    active: boolean;
};