//_ LOGGING
export type LogData = string | Record<any, any> | object;

//_ RESPONSES & ERRORS
export interface ResponseMessage {error: ErrorMessage, data?: any};
export interface ErrorMessage {
    code?: number, 
    error?: string, 
    details?: string | null, 
    present: boolean
};