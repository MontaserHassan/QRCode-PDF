/* eslint-disable prettier/prettier */
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';



export default class SignPdfDto {
    @IsString({ message: 'PDF must be a string' })
    @IsNotEmpty({ message: 'PDF is required', })
    pdf: string;

    @IsString({ message: 'Signature must be a string' })
    @IsOptional()
    signature?: string;
};