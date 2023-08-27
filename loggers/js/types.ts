export type LogData = string | Record<any, any> | object;
export type BackendFramework = "express" | "koa" | "morgan" | "koa-logger";
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