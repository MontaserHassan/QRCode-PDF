const pdfjsLib = window['pdfjs-dist/build/pdf'];
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.7.570/pdf.worker.min.js';

const canvas = document.getElementById('pdf-canvas');
const context = canvas.getContext('2d');
const fileInput = document.getElementById('pdf-upload');
const sendButton = document.getElementById('send-data');

let signaturePosition = { x: 0, y: 0 };
let pdfData = null;
let signatureWidth = 80;
let signatureHeight = 80;

fileInput.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
        pdfData = await file.arrayBuffer();
        const pdfDoc = await pdfjsLib.getDocument({ data: pdfData }).promise;
        const page = await pdfDoc.getPage(1);
        const viewport = page.getViewport({ scale: 1.5 });

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        // Render the page on the canvas
        await page.render({
            canvasContext: context,
            viewport: viewport
        }).promise;
    }
});

canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    signaturePosition.x = event.clientX - rect.left;
    signaturePosition.y = canvas.height - (event.clientY - rect.top);
    context.clearRect(0, 0, canvas.width, canvas.height);
    pdfjsLib.getDocument({ data: pdfData }).promise.then((pdfDoc) => {
        pdfDoc.getPage(1).then((page) => {
            const viewport = page.getViewport({ scale: 1.5 });
            page.render({
                canvasContext: context,
                viewport: viewport
            }).promise.then(() => {
                context.fillStyle = 'rgba(255, 0, 0, 0.3)';
                context.fillRect(signaturePosition.x, canvas.height - signaturePosition.y - signatureHeight, signatureWidth, signatureHeight);
                alert(`Signature Position Set: X=${signaturePosition.x}, Y=${signaturePosition.y}`);
            });
        });
    });
});

sendButton.addEventListener('click', async () => {
    if (!pdfData) {
        alert('Please upload a PDF first.');
        return;
    }

    const signPdfDto = {
        pdf: btoa(String.fromCharCode(...new Uint8Array(pdfData))),
        xPosition: signaturePosition.x,
        yPosition: signaturePosition.y,
    };

    try {
        const response = await fetch('http://localhost:4040/api/digital-signature/sign-pdf/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1vbnRhc2VyQGdtYWlsLmNvbSIsInVzZXJJZCI6IjFPYmppNHhBdDJIUDdhaERCWWtDMDdEbiIsInJvbGUiOiJzb2Z0d2FyZSBlbmdpbmVlciIsInRva2VuSWQiOjUwMjE1ODQwMTMzNzgyLCJleHBpcnlEYXRlIjoiMjAyNC0xMS0wMlQwMDoxNzoyNi42MjRaIiwiaWF0IjoxNzMwNDcwNjQ2LCJleHAiOjE3MzA1MDY2NDZ9.hjncu8Oq6ZX0vZ5mtAGrpobV1Z1Wv5X2wowXoHhM0qk`,
            },
            body: JSON.stringify(signPdfDto),
        });

        if (!response.ok) throw new Error('Failed to sign PDF');
        const data = await response.json();
        window.open(data.data.pdfWithSigning);
    } catch (error) {
        console.error('Error:', error);
    }
});