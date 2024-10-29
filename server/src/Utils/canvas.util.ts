/* eslint-disable prettier/prettier */
import { createCanvas } from 'canvas';



export default class CanvasUtil {
    constructor() { };

    createSignature(userSignature: string) {
        const canvas = createCanvas(400, 100);
        const context = canvas.getContext('2d');
        const fontFamily = 'Times New Roman';
        const fontSize = '20px';
        const fontWeight = 'bold';
        const fontStyle = 'italic';

        context.font = `${fontStyle} ${fontWeight} ${fontSize} ${fontFamily}`;

        context.translate(50, 50);
        context.rotate(-0.03);
        context.fillText(userSignature, 50, 50);
        const signature = canvas.toDataURL();
        return signature;
    };

};