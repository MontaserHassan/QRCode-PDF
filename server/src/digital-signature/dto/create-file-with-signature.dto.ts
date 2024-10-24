/* eslint-disable prettier/prettier */
import { IsString, IsNotEmpty, } from 'class-validator';



export default class CreateFileWithSigningDto {
    @IsString({ message: "Pdf Content must be a string" })
    @IsNotEmpty({ message: "Pdf Content is required" })
    pdfContent: string;
};