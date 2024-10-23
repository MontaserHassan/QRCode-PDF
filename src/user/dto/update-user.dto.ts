/* eslint-disable prettier/prettier */
import { IsOptional, IsArray, IsEnum } from 'class-validator';

import UserRole from '../../Interfaces/userRoles.interface';



export default class UpdateUserDto {
    @IsArray()
    @IsEnum(UserRole, { each: true, message: 'Invalid role value' })
    @IsOptional()
    readonly roles?: UserRole;

    @IsOptional()
    readonly lastSeen?: Date;

    @IsOptional()
    readonly logged?: boolean
};