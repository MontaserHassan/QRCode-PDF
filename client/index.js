const pdfjsLib = window['pdfjs-dist/build/pdf'];
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.7.570/pdf.worker.min.js';

const canvas = document.getElementById('pdf-canvas');
const context = canvas.getContext('2d');
const fileInput = document.getElementById('pdf-upload');
const sendButton = document.getElementById('send-data');

let signaturePosition = { x: 0, y: 0 };
let pdfArrayBuffer = null;
let signatureWidth = 80;
let signatureHeight = 80;

fileInput.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
        pdfArrayBuffer = await file.arrayBuffer();  // Store the ArrayBuffer format of the PDF
        const pdfDoc = await pdfjsLib.getDocument({ data: pdfArrayBuffer }).promise;
        const page = await pdfDoc.getPage(1);
        const viewport = page.getViewport({ scale: 1 });

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

    pdfjsLib.getDocument({ data: pdfArrayBuffer }).promise.then((pdfDoc) => {
        pdfDoc.getPage(1).then((page) => {
            const viewport = page.getViewport({ scale: 1 });
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
    if (!pdfArrayBuffer) {
        alert('Please upload a PDF first.');
        return;
    }

    const pdfBase64 = btoa(String.fromCharCode(...new Uint8Array(pdfArrayBuffer))); // Convert ArrayBuffer to base64
    const signPdfDto = {
        pdf: pdfBase64,
        xPosition: signaturePosition.x,
        yPosition: signaturePosition.y,
    };

    try {
        const response = await fetch('http://localhost:80/api/digital-signature/sign-pdf/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1vbnRhc2VyQGdtYWlsLmNvbSIsInVzZXJJZCI6IjcwNF9mMGg3ZnhHb3AtMXhVRVFBbUNrSyIsInJvbGUiOiJzb2Z0d2FyZSBlbmdpbmVlciIsInRva2VuSWQiOjczMTc3NTQ4MTIwODU5LCJleHBpcnlEYXRlIjoiMjAyNC0xMS0wNlQyMDowMjoxOC4zNTlaIiwiaWF0IjoxNzMwNTYzMzM4LCJleHAiOjE3MzA5MjMzMzh9.0O8R5xu1hzz6IBizNCGKQWtYKhfKJ-1jKYxjNdSLwJM`,
            },
            body: JSON.stringify(signPdfDto),
        });

        if (!response.ok) throw new Error('Failed to sign PDF');
        const data = await response.json();
        const pdfDataUrl = `${data.data.pdfWithSigning}`;
        window.open(pdfDataUrl);
    } catch (error) {
        console.error('Error:', error);
    }
});
