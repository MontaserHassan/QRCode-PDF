/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PDFDocument, rgb } from 'pdf-lib';



@Injectable()
export default class PDFUtil {

    constructor() { };

    async drawSignatureOnPDF(signature: string, role: string, signData: { pdf: string, xPosition: number, yPosition: number }): Promise<string> {
        try {
            const pdfDoc = await PDFDocument.load(signData.pdf);
            const pages = pdfDoc.getPages();
            const page = pages[pages.length - 1];

            const signatureImage = await pdfDoc.embedPng(signature);
            const signatureImageWidth = 80;
            const signatureImageHeight = 80;

            page.drawImage(signatureImage, {
                x: signData.xPosition,
                y: signData.yPosition,
                width: signatureImageWidth,
                height: signatureImageHeight,
            });

            const fontSize = 7;
            const textX = signData.xPosition;
            const textY = signData.yPosition - fontSize - 10;
            const date = new Date();
            const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

            page.drawText(formattedDate, {
                x: textX,
                y: textY,
                size: fontSize,
                color: rgb(0, 0, 0),
            });

            page.drawText(role, {
                x: textX,
                y: textY - fontSize - 5,
                size: fontSize,
                color: rgb(0, 0, 0),
            });
            const updatedPdfBytes = await pdfDoc.save();
            const result = `data:application/pdf;base64,${Buffer.from(updatedPdfBytes).toString('base64')}`;
            return result
        } catch (error) {
            throw new Error('Failed to sign on PDF');
        };
    };

};