/* eslint-disable prettier/prettier */
import * as winston from 'winston';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import * as flatted from 'flatted';
dotenv.config();



function jsonStringify(obj) {
    try {
        return JSON.stringify(obj);
    } catch (err: any) {
        if (!err.message.includes('circular')) throw err;
        return flatted.stringify(obj);
    };
};

interface LogData {
    level: string;
    source: string;
    timestamp: string;
    message: string;
    wfId: string;
    actionName: string;
    requestNumber: number;
    object?: any;
};

const levels = {
    error: 0,
    warn: 1,
    debug: 2,
    http: 3,
    info: 4,
};

function level() {
    const env = process.env.NEFERTITI_ENV;
    const isDevelopment = env === 'development';
    return isDevelopment ? 'debug' : 'info';
};

const format = winston.format.combine(
    winston.format.printf(({ message }) => message),
);

const transports = [new winston.transports.Console({ level: 'info' })];

const logger = winston.createLogger({
    level: level(),
    levels,
    format,
    transports,
});

function removeEmptyAttributes(obj: any) {
    Object.keys(obj).forEach((key) => {
        if (obj[key] === undefined || obj[key] === '' || (typeof obj[key] === 'object' && Object.keys(obj[key]).length === 0)) delete obj[key];
    });
    return obj;
};

function log(type: string, message?: string, object?: any, additionalData?: object) {
    const headers = object?.headers ? { ...object.headers } : (object?.req?.headers ? { ...object.req.headers } : {});
    const authorization = headers['authorization'];
    let userData: any = null;
    if (authorization) {
        const token = authorization.split(' ')[1];
        userData = jwt.decode(token) as any;
    };
    const tokenId = userData?.tokenId || object?.request?.user?.tokenId || object?.response?.user?.tokenId
    delete headers['authorization'];
    const objectData = removeEmptyAttributes({
        Method: object?.req?.method,
        Route: object?.req?.route?.path,
        Endpoint: object?.req?.url,
        Body: object?.req?.body,
        Params: object?.req?.params,
        Query: object?.req?.query,
        Headers: headers,
        IPAddress: object?.req?.ip,
        TokenID: tokenId,
        requestNumberTrace: object?.requestNumberTrace,
        ResponseStatusCode: object?.res?.responseCode,
        duration: object?.res?.duration,
    });
    additionalData = { ...additionalData, ...object?.res?.locals };
    const logData: LogData = {
        level: type,
        source: 'Digital-Signature',
        timestamp: new Date().toISOString(),
        message: message,
        ...objectData,
        additionalData: additionalData,
    };
    let logString = jsonStringify(logData);
    logString = logString.replace(/"([^"]+)":/g, '$1:');
    return logger.log(type, logString);
};

function logError(type: string, message: string, object: any, additionalData?: any) {
    const headers = object?.request?.headers;
    delete headers['authorization'];
    const objectData = removeEmptyAttributes({
        Method: object?.method || object?.request?.method,
        Route: object?.route?.path || object?.request?.route?.path,
        Endpoint: object?.url || object?.request?.url,
        Body: object?.body || object?.request?.body || object?.GAResponse,
        Params: object?.params || object?.request?.params,
        Query: object?.query || object?.request?.query,
        Headers: headers,
        requestNumberTrace: object?.requestNumberTrace,
        IPAddress: object?.ip || object?.request?.ip,
        TokenID: object?.request?.user?.tokenId,
        RequestStatusCode: object?.response?.statusCode,
    });
    if (additionalData?.response?.headers?.server?.includes('nginx')) additionalData = {};
    const objectOfAdditionalData = removeEmptyAttributes({ additionalData })
    const logErrorData: LogData = {
        level: type,
        source: 'Digital-Signature',
        timestamp: new Date().toISOString(),
        message: message,
        ...objectData,
        ...objectOfAdditionalData,
    };
    let logError = jsonStringify(logErrorData);
    logError = logError.replace(/"([^"]+)":/g, '$1:');
    return logger.log(type, logError);
};

function logHttpData(type: string, message: string, requestData: object, responseData: object, additionalData: any) {
    const request = typeof (requestData) === 'string' ? JSON.parse(requestData) : requestData;
    const response = typeof (responseData) === 'string' ? JSON.parse(responseData) : responseData;
    const httpData = {
        level: type,
        source: 'Digital-Signature',
        timestamp: new Date().toISOString(),
        message: message,
        request: request,
        response: response,
        ...additionalData,
    };
    let logHttpData = jsonStringify(httpData);
    logHttpData = logHttpData.replace(/"([^"]+)":/g, '$1:');
    return logger.log(type, logHttpData);
};

function consoleLog(type: string, message: string, additionalData?: any) {
    const logData: LogData = {
        level: type,
        source: 'Digital-Signature',
        timestamp: new Date().toISOString(),
        message: message,
        ...additionalData
    };
    let logString = jsonStringify(logData);
    logString = logString.replace(/"([^"]+)":/g, '$1:');
    return logger.log(type, logString);
};


function logInfo(message: string, additionalData?: any) {
    consoleLog('info', message, additionalData);
}

function info(message: string, object?: any, additionalData?: object) {
    log('info', message, object, additionalData);
};

function error(message: string, object?: any, additionalData?: object) {
    logError('error', message, object, additionalData);
};

function debug(message: string, req?: any, additionalData?: object) {
    log('debug', message, req, additionalData);
};

function warn(message: string, req?: any, additionalData?: object) {
    log('warn', message, req, additionalData);
};

function http(message: string, requestData: object, responseData: object, additionalData?: any) {
    logHttpData('http', message, requestData, responseData, additionalData);
};



export default {
    info,
    error,
    debug,
    warn,
    http,
    logInfo,
};