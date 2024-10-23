/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { customAlphabet } from 'nanoid';
import { addHours, addDays, addWeeks, addMonths, addYears, addMinutes } from 'date-fns';

import TokenService from '../user/token.service';
import { Token } from '../user/entities/token.entity';
import Util from './util.util';



@Injectable()
export default class TokenUtil {

    constructor(private readonly jwtService: JwtService, private readonly util: Util, private readonly tokenService: TokenService) { };

    async createToken(email: string, userId: string, role: string): Promise<string> {
        const customNanoId = customAlphabet('1234567890', 14);
        const tokenId = parseInt(customNanoId());
        const expiryDate = this.util.calculateExpiryDate(process.env.EXPIRATION_DATE_PER_MINUTES);
        const payload = { email: email, userId: userId, role: role, tokenId: tokenId, expiryDate: expiryDate.date };
        const token = await this.jwtService.signAsync(payload, { expiresIn: expiryDate.expiryDurationPerSecond });
        await this.tokenService.updateMany(userId);
        await this.deleteUserTokens(userId);
        await this.tokenService.create({ tokenId: tokenId, userId: userId, expiryDate: expiryDate.date });
        return token;
    };

    async verifyToken(token: string): Promise<any> {
        const isTokenVerified = await this.jwtService.verifyAsync(token);
        return isTokenVerified;
    };

    extractToken(authHeader: string): string | null {
        if (authHeader.startsWith(`${process.env.BEARER_SECRET} `)) {
            const token = authHeader.slice(7, authHeader.length).trim();
            if (!this.validateToken(token)) return null;
            return token;
        };
        return null;
    };

    private validateToken(token: string): boolean {
        return token && token.length > 0;
    };

    private calculateExpiryDate(duration: string): { date: Date, expiryDurationPerSecond: number } {
        const [amount, unit] = duration.split(/(\d+)/).filter(Boolean);
        let expirationDate: Date;
        switch (unit) {
            case 't':
                expirationDate = addMinutes(new Date(), Number(amount));
                break;
            case 'h':
                expirationDate = addHours(new Date(), Number(amount));
                break;
            case 'd':
                expirationDate = addDays(new Date(), Number(amount));
                break;
            case 'w':
                expirationDate = addWeeks(new Date(), Number(amount));
                break;
            case 'm':
                expirationDate = addMonths(new Date(), Number(amount));
                break;
            case 'y':
                expirationDate = addYears(new Date(), Number(amount));
                break;
            default:
                expirationDate = addHours(new Date(), 24);
        };
        const expiryDurationPerSecond = Math.floor((expirationDate.getTime() - new Date().getTime()) / 1000);
        return { date: expirationDate, expiryDurationPerSecond: expiryDurationPerSecond };
    };

    async hasTokenActiveByUserId(id: string): Promise<Token> {
        const token = await this.tokenService.findOne({ userId: id, active: true, expiryDate: { $gt: new Date() } });
        return token;
    };

    async hasTokenActiveByTokenId(id: number): Promise<Token> {
        const token = await this.tokenService.findOne({ tokenId: id, active: true });
        return token;
    };

    async deleteToken(tokenId: number): Promise<Token> {
        const token = await this.tokenService.remove(tokenId);
        return token;
    };

    async deleteUserTokens(userId: string): Promise<any> {
        const tokens = await this.tokenService.removeAll(userId);
        return tokens;
    };



};