import chalk from "chalk";
import {TokenIndexer} from "morgan";
import { Request, Response } from "express";
import type { LogData } from "./types.js";


//_ BACKEND LOGGING FUNCTIONS (MORGAN)
const SERVER_COLORS: Record<string, string> = {
    request: "#EF596F",
    response: "#61AFEF"
};

export const RequestLog = (tokens: TokenIndexer<Request, Response>, req: Request, res: Response) => {
    return `\n${chalk.bgHex(SERVER_COLORS.request).bold(" REQ ")} \n${chalk.bold(tokens.method(req, res))} ${chalk.underline(req.path)}, date:${chalk.italic(tokens.date(req, res, "web"))} \nquery: ${chalk.hex(SERVER_COLORS.request)(JSON.stringify(req.query, null, 2))} \nbody: ${chalk.hex(SERVER_COLORS.request)(JSON.stringify(req.body, null, 2))} \nparams: ${chalk.hex(SERVER_COLORS.request)(JSON.stringify(req.params, null, 2))}\n`;
};


export const ResponseLog = (tokens: TokenIndexer<Request, Response>, req: Request, res: Response) => {
    return `\n${chalk.bgHex(SERVER_COLORS.response).bold(" RES ")} \nstatus:${chalk.hex(SERVER_COLORS.response).bold(tokens.status(req, res))}, response time:${chalk.bold(tokens["total-time"](req, res, 1) + "ms")}\n`;
};


export class Verbal {
    name: string | undefined;
    readonly colors: Record<string, string> = {
        red: "#E88388",
        orange: "#EB8B59",
        yellow: "#DBCB79",
        cyan: "#66C2CD",
        blue: "#71BEF2",
        purple: "#D290E3",
        white: "#e7e7e7"
    };
    readonly levels: Record<string, number> = {
        INFO: 4,
        DEBUG: 3,
        WARNING: 2,
        ERROR: 1,
        CRITICAL: 0
    };

    //_ CONSTRUCTOR
    constructor(name=process.env.npm_package_name) {
        this.name = name;
    };


    //_ GENERAL LOGGING FUNCTIONS
    DebugLog(data: LogData) {
        const OUT = typeof data == "string" ? data : JSON.stringify(data, null, 2);

        return console.log(`\n${chalk.bgHex(this.colors.white).hex("#000").bold(" DEBUG ")} - ${chalk.hex(this.colors.white).underline(this.name + ":")} ${OUT}\n`);
    };


    InfoLog(data: LogData) {
        const OUT = typeof data == "string" ? data : JSON.stringify(data, null, 2);

        return console.log(`\n${chalk.bgHex(this.colors.cyan).hex("#000").bold(" INFO ")} - ${chalk.hex(this.colors.cyan).underline(this.name + ":")} ${OUT}\n`);
    };


    WarningLog(data: LogData) {
        const OUT = typeof data == "string" ? data : JSON.stringify(data, null, 2);

        return console.log(`\n${chalk.bgHex(this.colors.orange).hex("#000").bold(" WARNING ")} - ${chalk.hex(this.colors.orange).underline(this.name + ":")} ${OUT}\n`);
    };


    ErrorLog(data: LogData) {
        const OUT = typeof data == "string" ? data : JSON.stringify(data, null, 2);

        return console.log(`\n${chalk.bgHex(this.colors.red).hex("#000").bold(" ERROR ")} - ${chalk.hex(this.colors.red).underline(this.name + ":")} ${OUT}\n`);
    };
};