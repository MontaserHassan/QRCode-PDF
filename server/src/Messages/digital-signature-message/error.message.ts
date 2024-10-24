/* eslint-disable prettier/prettier */
enum ErrorDigitalSignatureMessage {
    ALREADY_EXISTS = 'Digital Signature already exists',
    SIGNATURE_NOT_FOUND = 'Digital Signature does not exist',
    CREATION_FAILED = 'Failed to create Digital Signature for user',
    UPDATE_FAILED = 'Failed to update Digital Signature for user',
    GET_FAILED = 'Failed to get Digital Signature for user',
    PDF_SIGNING_FAILED = 'Failed to sign PDF with the user’s Digital Signature',
    FILE_WITH_SIGNATURE_NOT_FOUND = 'File with signature for user does not exist',
};



export default ErrorDigitalSignatureMessage;