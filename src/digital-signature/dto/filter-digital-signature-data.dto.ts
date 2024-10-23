/* eslint-disable prettier/prettier */
import { IsString, IsOptional } from 'class-validator';



export default class FilterDigitalSignatureDataDto {
    @IsString({ message: 'User Id must be a string', })
    @IsOptional()
    readonly userId?: string;

    @IsString({ message: 'ds Id must be a number', })
    @IsOptional()
    readonly dsId?: string;

    @IsString({ message: 'QR Code must be a number', })
    @IsOptional()
    readonly qrCode?: string;
};