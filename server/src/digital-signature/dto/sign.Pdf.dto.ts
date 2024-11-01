/* eslint-disable prettier/prettier */
import { IsString, IsOptional, IsNotEmpty, IsNumber } from 'class-validator';



export default class SignPdfDto {
    @IsString({ message: 'PDF must be a string' })
    @IsNotEmpty({ message: 'PDF is required', })
    pdf: string;

    @IsString({ message: 'Signature must be a string' })
    @IsOptional()
    signature?: string;


    @IsNumber({}, { message: 'X Position must be a number', })
    @IsNotEmpty({ message: 'X Position is required', })
    xPosition: number;

    @IsNumber({}, { message: 'Y Position must be a number', })
    @IsNotEmpty({ message: 'Y Position is required', })
    yPosition: number;
};