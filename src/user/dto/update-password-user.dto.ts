/* eslint-disable prettier/prettier */
import { IsString, Matches, MinLength, MaxLength, IsNotEmpty } from 'class-validator';



export default class UpdateUserPasswordDto {

    @IsString()
    @IsNotEmpty()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @MaxLength(20, { message: 'Password cannot be longer than 20 characters' })
    @Matches(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$~%?^&*_.\-=+])[A-Za-z\d!?@#$~%^&*_.\-=+]{8,20}$/, { message: 'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character (!?@#$~%^&*_.\\-=+)', })
    readonly password: string;
};
