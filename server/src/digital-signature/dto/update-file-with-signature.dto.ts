/* eslint-disable prettier/prettier */
import { IsString, IsOptional, IsBoolean, IsNotEmpty } from 'class-validator';



export default class UpdatedFileDto {
    @IsString({ message: 'File Id must be a string', })
    @IsNotEmpty({ message: 'File Id is required', })
    fileId: string;

    @IsString({ message: 'Check By must be a string', })
    @IsOptional()
    checkBy: string;

    @IsBoolean({ message: 'Is Checking must be a boolean', })
    @IsOptional()
    isChecking: boolean;
};