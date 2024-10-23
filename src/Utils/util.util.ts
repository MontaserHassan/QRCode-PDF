/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { addHours, addDays, addWeeks, addMonths, addYears, addMinutes } from 'date-fns';
import { SubscriptionWay } from 'src/Interfaces/subscription-way.interface';



@Injectable()
export default class Util {

    constructor() { };

    calculateExpiryDate(duration: string): { date: Date, expiryDurationPerSecond: number } {
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

    generateUserCode() {
        const letter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        const numbers = Math.floor(1000 + Math.random() * 9000).toString();
        return `${letter}${numbers}`;
    };

    calculateSubscriptionExpiryDate(subscriptionWay: string) {
        const currentDate = new Date();

        switch (subscriptionWay) {
            case SubscriptionWay.MONTHLY:
                return addMonths(currentDate, 1);
            case SubscriptionWay.QUARTER:
                return addMonths(currentDate, 3);
            case SubscriptionWay.HALF_YEAR:
                return addMonths(currentDate, 6);
            case SubscriptionWay.YEARLY:
                return addYears(currentDate, 1);
            default:
                return addMonths(currentDate, 1);
        };
    };

    generateAlphanumericCode(length: number): string {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters[randomIndex];
        };
        return result;
    };


};