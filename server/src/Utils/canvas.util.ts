/* eslint-disable prettier/prettier */
import { createCanvas } from 'canvas';



export default class CanvasUtil {
    constructor() { };

    createSignature(userSignature: string) {
        const canvas = createCanvas(200, 50);
        const context = canvas.getContext('2d');
        const fontFamily = 'Times New Roman';
        const fontSize = '15px';
        const fontWeight = 'bold';
        const fontStyle = 'italic';

        context.font = `${fontStyle} ${fontWeight} ${fontSize} ${fontFamily}`;

        context.translate(30, 30);
        context.rotate(-0.01);
        context.fillText(userSignature, 10, 10);
        const signature = canvas.toDataURL();
        return signature;
    };

};