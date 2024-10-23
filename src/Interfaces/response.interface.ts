/* eslint-disable prettier/prettier */
export interface ResponseInterface {
    responseCode: number,
    responseMessage: string,
    data: Record<string, any>;
};