/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { nanoid } from 'nanoid';



type FileWithSingingDocument = FileWithSinging & Document;


@Schema({ timestamps: true })
class FileWithSinging {
    @Prop({ type: String, default: () => nanoid(24), })
    _id: string;

    @Prop({ type: String, required: true, })
    pdfContent: string;

    @Prop({ type: String, required: true, })
    userId: string;

    @Prop({ type: String, })
    checkBy: string;

    @Prop({ type: Boolean, default: false })
    isChecking: boolean;

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