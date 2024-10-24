/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PDFDocument } from 'pdf-lib';



@Injectable()
export default class QRCodePDFUtil {

    constructor() { };

    async drawQRCodeOnFile(qrCode: string, pdfContent: string): Promise<string> {
        try {
            const pdfDoc = await PDFDocument.load(pdfContent);
            const page = pdfDoc.addPage();
            const { width, height } = page.getSize();
            const qrImage = await pdfDoc.embedPng(qrCode);
            const qrImageWidth = 150;
            const qrImageHeight = 150;
            page.drawImage(qrImage, {
                x: (width - qrImageWidth) / 2,
                y: (height - qrImageHeight) / 2,
                width: qrImageWidth,
                height: qrImageHeight,
            });
            const updatedPdfBytes = await pdfDoc.save();
            return Buffer.from(updatedPdfBytes).toString('base64');
        } catch (error) {
            throw new Error('Failed to draw QR code on PDF');
        };
    };

};