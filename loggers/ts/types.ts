import { AxiosError } from "axios";

export type LogData = string | number | undefined | null | boolean | bigint | Record<any, any> | object;
export interface FileLogData {
    nature: string,
    level: number,
    data: string | Record<any, any>
}

export type LogError = AxiosError | LogData ;

export interface RequestTokens  {
    method: string,
    path: string,
    date: string,
    query: object | Record<any, any>,
    body?: object | Record<any, any>,
    params?: object | Record<any, any>,
    length?: number,
    type?: string
}
export interface ResponseTokens {
    status: number,
    length?: number,
    responseTime: number,
    type?: string
}

export enum Framework {
    EXPRESS = "morgan",
    KOA = "koa",
    MORGAN = "morgan",
    WINSTON = "winston"
}