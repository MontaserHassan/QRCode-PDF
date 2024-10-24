/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import * as moment from 'moment';



export default function IsFutureDate(validationOptions?: ValidationOptions) {
    return function (object: unknown, propertyName: string) {
        registerDecorator({
            name: 'isFutureDate',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    if (typeof value !== 'string') return false;
                    const today = moment().startOf('day');
                    const date = moment(value, 'DD-MM-YYYY', true);
                    return date.isValid() && date.isAfter(today);
                },
                defaultMessage(args: ValidationArguments) {
                    return `Import Order Expiry Date must be a valid date greater than today's date`;
                },
            }
        });
    };
}
