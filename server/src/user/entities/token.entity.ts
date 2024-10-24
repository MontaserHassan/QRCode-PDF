/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { nanoid } from 'nanoid';



type TokenDocument = Token & Document;


@Schema({ timestamps: true })
class Token {
    @Prop({ type: String, default: () => nanoid(24), })
    _id: string;

    @Prop({ type: Number, required: true, unique: true })
    tokenId: number;

    @Prop({ type: String, required: true })
    userId: string;

    @Prop({ required: true, default: true })
    active: boolean;

    @Prop({ required: true })
    expiryDate: Date;

    @Prop({ type: Date })
    createdAt: Date;

    @Prop({ type: Date })
    updatedAt: Date;
};


const TokenSchema = SchemaFactory.createForClass(Token);



export {
    TokenSchema,
    Token,
    TokenDocument
};