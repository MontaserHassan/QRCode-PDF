/* eslint-disable prettier/prettier */
import { IsOptional, } from 'class-validator';



export default class UpdateTokenDto {
    @IsOptional()
    readonly active?: boolean;
};