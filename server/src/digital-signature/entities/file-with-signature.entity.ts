/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { nanoid } from 'nanoid';



type FileWithSingingDocument = FileWithSinging & Document;


@Schema({ timestamps: true })
class FileWithSinging {
    @Prop({ type: String, default: () => nanoid(24), })
    _id: string;

    @Prop({ type: String, required: true, unique: true })
    qrCode: string;

    @Prop({ type: String, required: true, unique: true })
    userId: string;

    @Prop({ type: Date })
    createdAt: Date;

    @Prop({ type: Date })
    updatedAt: Date;
};


const fileWithSingingSchema = SchemaFactory.createForClass(FileWithSinging);



export {
    fileWithSingingSchema,
    FileWithSinging,
    FileWithSingingDocument,
};