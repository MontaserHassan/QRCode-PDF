/* eslint-disable prettier/prettier */
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';


@ValidatorConstraint({ name: 'isGreaterThanZero', async: false })
export default class IsGreaterThanZeroConstraint implements ValidatorConstraintInterface {
    validate(value: string | number): boolean {
        const numberValue = typeof value === 'string' ? parseInt(value, 10) : value;
        return numberValue > 0;
    };
    defaultMessage(): string {
        return 'Import Order Number must be greater than 0';
    };
};