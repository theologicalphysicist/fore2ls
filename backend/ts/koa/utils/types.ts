//_ LOGGING
export type LogData = string | Record<any, any> | object;
export type RequestMethods = "GET" | "PUT" | "POST" | "DELETE" | "PATCH";

//_ MIDDLEWARE
export interface RequestTokens {
        method: string,
        path: string,
        date: string,
        query: object | Record<any, any>,
        body?: object | Record<any, any>,
        params?: object | Record<any, any>,
        length?: number,
        type?: string
};
export interface ResponseTokens {
    status: number,
    length: number,
    responseTime: number
};

//_ REQUESTS, RESPONSES & ERRORS
export interface ResponseMessage {error: ErrorMessage, data?: any};
export interface ErrorMessage {
    code?: number, 
    error?: string, 
    details?: string | null, 
    present: boolean
};