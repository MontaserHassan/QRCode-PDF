/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as argon2 from 'argon2';
import { nanoid } from 'nanoid';

import Util from '../../Utils/util.util';



type UserDocument = User & Document;


@Schema({ timestamps: true })
class User {
    @Prop({ type: String, default: () => nanoid(24), })
    _id: string;

    @Prop({ type: String, required: true, unique: true, })
    email: string;

    @Prop({ type: String, required: true })
    userSignature: string;

    @Prop({ type: String, unique: true })
    userCode: string;

    @Prop({ type: String, required: true })
    password: string;

    @Prop({ type: String, })
    role: string;

    @Prop({ type: Boolean, required: true, default: false })
    logged: boolean;

    @Prop({ type: Date })
    lastSeen: Date;

    @Prop({ type: Date })
    createdAt: Date;

    @Prop({ type: Date })
    updatedAt: Date;
};


const userSchema = SchemaFactory.createForClass(User);

userSchema.pre<UserDocument>('save', async function (next) {
    try {
        const util = new Util();
        const now = new Date();
        this.updatedAt = now;
        if (!this.createdAt) this.createdAt = now;
        if (!this.userCode) this.userCode = util.generateUserCode();
        if (!this.isModified('password')) return next();
        this.password = await argon2.hash(this.password, { type: argon2.argon2id, });
    } catch (err) {
        return next(err);
    }
});


userSchema.pre<UserDocument>('findOneAndUpdate', function (next) {
    this.set({ updatedAt: new Date() });
    next();
});

userSchema.pre<UserDocument>('updateOne', function (next) {
    this.set({ updatedAt: new Date() });
    next();
});


userSchema.set('toJSON', {
    transform: function (doc, ret) {
        delete ret.password;
        return ret;
    }
});


userSchema.set('toObject', {
    transform: function (doc, ret) {
        delete ret.password;
        return ret;
    }
});



export {
    userSchema,
    User,
    UserDocument
};