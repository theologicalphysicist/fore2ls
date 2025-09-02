import * as fs from "fs/promises";

import chalk from "chalk";
import {TokenIndexer} from "morgan";
import { Request, Response } from "express";
import * as rfs from "rotating-file-stream";

import { FileLogData, Framework, LogData, RequestTokens, ResponseTokens } from "./types.js";


export class Verbal {
    name?: string;
    framework?: Framework;
    log_folder?: string;
    log_file?: string
    externally?: boolean
    readonly printable_types: Array<string> = ["string", "number", "undefined", "null", "bigint", "boolean"];
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
        CRITICAL: 0,
        EVENT: -1
    };
    readonly SERVER_COLORS: Record<string, string> = {
        request: "#EF596F",
        response: "#61AFEF"
    };


    //_ CONSTRUCTORS
    constructor(name: string = `${process.env.npm_package_name}`, write_to_file: boolean = false, log_folder: string = `${process.cwd()}/logs/`, log_file: string = "default.log.json", framework?: Framework,) {
        this.name = name;
        this.framework = framework;

        if (write_to_file) { //TODO: THIS NEEDS TO BE MADE MUCH NEATER, CLEANER & MORE ROBUST
            
            fs.mkdir(
                log_folder,
                {}
            ).then(() => {
                fs.writeFile(
                    `${log_folder}${log_file}`, 
                    "", 
                    {encoding: "utf-8", mode: 0o666, flag: "w"}
                ).catch((err: any) => {
                    console.log(`${chalk.bgHex(this.COLORS.red).hex("#000").bold(" ERROR: ")} failed to write to file. file logging is disabled`);
                    console.log(`${chalk.hex(this.COLORS.red)(err)}`);

                    write_to_file = false;
                });
            }).catch((err: any) => {
                console.log(`${chalk.bgHex(this.COLORS.red).hex("#000").bold(" ERROR: ")} failed to open directory. file logging may be disabled`);
                console.log(`${chalk.hex(this.COLORS.red)(err)}`);

                write_to_file = false;
            })
            
        };

        this.log_file = log_file;
        this.log_folder = log_folder;
        this.externally = write_to_file;
    };



    //_ GENERAL LOGGING FUNCTIONS
    debug(data: LogData) {
        const OUT = this.printable_types.includes(typeof data) ? data : JSON.stringify(data, null, 2);

        return console.log(`\n${chalk.bgHex(this.COLORS.white).hex("#000").bold(" DEBUG ")} - ${chalk.hex(this.COLORS.white).underline(this.name + ":")} ${OUT}\n`);
    };


    info(data: LogData) {
        const OUT = this.printable_types.includes(typeof data) ? data : JSON.stringify(data, null, 2);

        return console.log(`\n${chalk.bgHex(this.COLORS.cyan).hex("#000").bold(" INFO ")} - ${chalk.hex(this.COLORS.cyan).underline(this.name + ":")}${chalk.hex(this.COLORS.cyan)(":")} ${OUT}\n`);
    };


    warn(data: LogData) {
        const OUT = this.printable_types.includes(typeof data) ? data : JSON.stringify(data, null, 2);

        return console.log(`\n${chalk.bgHex(this.COLORS.orange).hex("#000").bold(" WARNING ")} - ${chalk.hex(this.COLORS.orange).underline(this.name + ":")} ${OUT}\n`);
    };


    error(data: LogData) {
        const OUT = this.printable_types.includes(typeof data) ? data : JSON.stringify(data, null, 2);

        return console.log(`\n${chalk.bgHex(this.COLORS.red).hex("#000").bold(" ERROR ")} - ${chalk.hex(this.COLORS.red).underline(this.name + ":")} ${OUT}\n`);
    };

    log(data: LogData): string | void {
        if (this.externally) {
            fs.appendFile(
                `${this.log_folder}${this.log_file}`,
                this.printable_types.includes(typeof data) || data == null ? JSON.stringify({message: data}) : JSON.stringify(data, null, 2)
            ).then(() => {
                console.log(`${chalk.hex(this.COLORS.purple).underline("SUCCESS")}`);

            }).catch((err: any) => {
                console.log(`${chalk.bgHex(this.COLORS.red).hex("#000").bold(" ERROR: ")} failed to write to file.`);
                console.log(`${chalk.hex(this.COLORS.red)(err.message)}`);
            });
        };
        const OUT = this.printable_types.includes(typeof data) || data == null ? data : `\n${JSON.stringify(data, null, 2)}`;

        return console.log(`\n${chalk.bgHex(this.COLORS.purple).hex("#000").bold(" LOG ")} - ${chalk.hex(this.COLORS.purple).underline(this.name + ":")} ${OUT}\n`);
    };


    //_ BACKEND LOGGING FUNCTIONS
    request(tokens: RequestTokens | TokenIndexer | any, req: Request, res: Response): string | null {

        if (this.framework == Framework.MORGAN) {
            const CONSOLE_OUT: string = `\n${chalk.bgHex(this.SERVER_COLORS.request).bold(" REQ ")} \n${chalk.bold(tokens.method(req, res))} ${chalk.underline(req.path)}, date:${chalk.italic(tokens.date(req, res, "web"))} \nquery: ${chalk.hex(this.SERVER_COLORS.request)(JSON.stringify(req.query, null, 2))} \nbody: ${chalk.hex(this.SERVER_COLORS.request)(JSON.stringify(req.body, null, 2))} \nparams: ${chalk.hex(this.SERVER_COLORS.request)(JSON.stringify(req.params, null, 2))}\n`;
            const OUT: string = JSON.stringify({
                method: tokens.method(req, res),
                path: req.path,
                date: tokens.date(req, res, "web"),
                query: req.query,
                body: req.body,
                params: req.params,
                type: "REQUEST"
            });
            console.log(CONSOLE_OUT);

            return OUT;
        } else {
            console.log(`\n${chalk.bgHex(this.SERVER_COLORS.request).bold(" REQUEST ")} \n${chalk.bold(tokens.method)} ${chalk.underline(tokens.path)}, date:${chalk.italic(tokens.date)} \nquery: ${chalk.hex(this.SERVER_COLORS.request)(JSON.stringify(tokens.query, null, 2))} \nbody: ${chalk.hex(this.SERVER_COLORS.request)(JSON.stringify(tokens.body, null, 2))} \nparams: ${chalk.hex(this.SERVER_COLORS.request)(JSON.stringify(tokens.params, null, 2))}\n`);

            return null;
        }

    }


    response(tokens: RequestTokens | TokenIndexer | any, req: Request, res: Response): string | null {

        if (this.framework == Framework.MORGAN) {
            const CONSOLE_OUT: string = `\n${chalk.bgHex(this.SERVER_COLORS.response).bold(" RES ")} \nstatus:${chalk.hex(this.SERVER_COLORS.response).bold(tokens.status(req, res))}, response time:${chalk.bold(tokens["total-time"](req, res, 1) + "ms")}\n`;
            const OUT: string = JSON.stringify({
                status: tokens.status(req, res),
                length: tokens["total-time"](req, res, 1) ,
                type: "RESPONSE"
            });
            console.log(CONSOLE_OUT);

            return OUT;
        } else {
            console.log(`\n${chalk.bgHex(this.SERVER_COLORS.response).bold(" RESPONSE ")} \nstatus:${chalk.hex(this.SERVER_COLORS.response).bold(tokens.status)}, content-length:${chalk.bold(tokens.length)}, response time:${chalk.bold(tokens.responseTime + "ms")}\n`);
            
            return null;
        }

    };
    //TODO: refactor selection statements, use switch-case to be more compatible with other frameworks
    //TODO: refactor to be simpler
}