import chalk from "chalk";
import {TokenIndexer} from "morgan";
import { Request, Response } from "express";
import type { BackendFramework, LogData, RequestTokens, ResponseTokens } from "./types.js";


export class Verbal {
    name: string | undefined;
    framework: BackendFramework | undefined;
    readonly COLORS: Record<string, string> = {
        red: "#E88388",
        orange: "#EB8B59",
        yellow: "#DBCB79",
        cyan: "#66C2CD",
        blue: "#71BEF2",
        purple: "#D290E3",
        white: "#e7e7e7"
    };
    readonly LEVELS: Record<string, number> = {
        INFO: 4,
        DEBUG: 3,
        WARNING: 2,
        ERROR: 1,
        CRITICAL: 0
    };
    readonly SERVER_COLORS: Record<string, string> = {
        request: "#EF596F",
        response: "#61AFEF"
    };

    //_ CONSTRUCTORS
    constructor(framework=undefined, name=process.env.npm_package_name) {
        this.name = name;
        this.framework = framework;
    };


    //_ GENERAL LOGGING FUNCTIONS
    debug(data: LogData) {
        const OUT = typeof data == "string" ? data : JSON.stringify(data, null, 2);

        return console.log(`\n${chalk.bgHex(this.COLORS.white).hex("#000").bold(" DEBUG ")} - ${chalk.hex(this.COLORS.white).underline(this.name + ":")} ${OUT}\n`);
    };


    info(data: LogData) {
        const OUT = typeof data == "string" ? data : JSON.stringify(data, null, 2);

        return console.log(`\n${chalk.bgHex(this.COLORS.cyan).hex("#000").bold(" INFO ")} - ${chalk.hex(this.COLORS.cyan).underline(this.name + ":")}${chalk.hex(this.COLORS.cyan)(":")} ${OUT}\n`);
    };


    warn(data: LogData) {
        const OUT = typeof data == "string" ? data : JSON.stringify(data, null, 2);

        return console.log(`\n${chalk.bgHex(this.COLORS.orange).hex("#000").bold(" WARNING ")} - ${chalk.hex(this.COLORS.orange).underline(this.name + ":")} ${OUT}\n`);
    };


    error(data: LogData) {
        const OUT = typeof data == "string" ? data : JSON.stringify(data, null, 2);

        return console.log(`\n${chalk.bgHex(this.COLORS.red).hex("#000").bold(" ERROR ")} - ${chalk.hex(this.COLORS.red).underline(this.name + ":")} ${OUT}\n`);
    };


    //_ BACKEND LOGGING FUNCTIONS
    request(tokens: TokenIndexer | RequestTokens, req: Request, res: Response) {
        if (this.framework == "express" || this.framework == "morgan") {
            //@ts-ignore 
            return `\n${chalk.bgHex(this.SERVER_COLORS.request).bold(" REQ ")} \n${chalk.bold(tokens.method(req, res))} ${chalk.underline(req.path)}, date:${chalk.italic(tokens.date(req, res, "web"))} \nquery: ${chalk.hex(this.SERVER_COLORS.request)(JSON.stringify(req.query, null, 2))} \nbody: ${chalk.hex(this.SERVER_COLORS.request)(JSON.stringify(req.body, null, 2))} \nparams: ${chalk.hex(this.SERVER_COLORS.request)(JSON.stringify(req.params, null, 2))}\n`;
        } else {
            return console.log(`\n${chalk.bgHex(this.SERVER_COLORS.request).bold(" REQUEST ")} \n${chalk.bold(tokens.method)} ${chalk.underline(tokens.path)}, date:${chalk.italic(tokens.date)} \nquery: ${chalk.hex(this.SERVER_COLORS.request)(JSON.stringify(tokens.query, null, 2))} \nbody: ${chalk.hex(this.SERVER_COLORS.request)(JSON.stringify(tokens.body, null, 2))} \nparams: ${chalk.hex(this.SERVER_COLORS.request)(JSON.stringify(tokens.params, null, 2))}\n`);
        }
    };


    response(tokens: TokenIndexer | ResponseTokens, req: Request, res: Response) {
        if (this.framework == "express" || this.framework == "morgan") {
            //@ts-ignore
            return `\n${chalk.bgHex(this.SERVER_COLORS.response).bold(" RES ")} \nstatus:${chalk.hex(this.SERVER_COLORS.response).bold(tokens.status(req, res))}, response time:${chalk.bold(tokens["total-time"](req, res, 1) + "ms")}\n`;
        } else {
            return console.log(`\n${chalk.bgHex(this.SERVER_COLORS.response).bold(" RESPONSE ")} \nstatus:${chalk.hex(this.SERVER_COLORS.response).bold(tokens.status)}, content-length:${chalk.bold(tokens.length)}, response time:${chalk.bold(tokens.responseTime + "ms")}\n`);
        }
    };
    //TODO: refactor selection statements, potentially use ENUM for framework type
    //TODO: refactor to be simpler
}