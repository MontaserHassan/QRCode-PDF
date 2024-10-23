/* eslint-disable prettier/prettier */
import UserRole from './userRoles.interface';



export default interface AuthUser {
    email: string;
    userId?: string;
    tokenId: number;
    expiryDate: Date;
    role: UserRole;
};