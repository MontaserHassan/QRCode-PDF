/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { SubscriptionWay } from '../../Interfaces/subscription-way.interface';
import { nanoid } from 'nanoid';



type DigitalSignatureDocument = DigitalSignature & Document;


@Schema({ timestamps: true })
class DigitalSignature {
    @Prop({ type: String, default: () => nanoid(24), })
    _id: string;

    @Prop({ type: Number, required: true, unique: true })
    signatureNumber: number;

    @Prop({ type: String, required: true, unique: true })
    qrCode: string;

    @Prop({ type: String, required: true, unique: true })
    userId: string;

    @Prop({ type: String, required: true, unique: true })
    userCode: string;

    @Prop({ type: String, required: true })
    role: string;

    @Prop({ type: Boolean, required: true, default: true })
    active: boolean;

    @Prop({ type: String, required: true, enum: SubscriptionWay })
    subscriptionWay: string;

    @Prop({ type: Date, required: true, })
    subscriptionExpiryDate: Date

    @Prop({ type: Date })
    createdAt: Date;

    @Prop({ type: Date })
    updatedAt: Date;
};


const digitalSignatureSchema = SchemaFactory.createForClass(DigitalSignature);



export {
    digitalSignatureSchema,
    DigitalSignature,
    DigitalSignatureDocument
};