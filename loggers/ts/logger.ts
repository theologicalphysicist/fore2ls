import * as fs from "fs/promises";

import chalk from "chalk";
import {TokenIndexer} from "morgan";
import { Request, Response } from "express";
import * as rfs from "rotating-file-stream";

import { FileLogData, Framework, LogData, RequestTokens, ResponseTokens } from "./types.js";


export class Verbal {
    name?: string;
    framework?: Framework;
    log_stream?: rfs.RotatingFileStream;
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
    constructor(framework: Framework, log_folder: string = process.cwd(), log_file: string = "access.log", name: string = `${process.env.npm_package_name}`) {
        this.name = name;
        this.framework = framework;
        this.log_stream = rfs.createStream(log_file, {
            interval: "1d",
            encoding: "utf-8",
            omitExtension: false,
            path: log_folder,
            teeToStdout: false
        });

    };


    //_ GENERAL LOGGING FUNCTIONS
    debug(data: LogData) {
        const OUT = ["string", "number", "undefined"].includes(typeof data) ? data : JSON.stringify(data, null, 2);

        return console.log(`\n${chalk.bgHex(this.COLORS.white).hex("#000").bold(" DEBUG ")} - ${chalk.hex(this.COLORS.white).underline(this.name + ":")} ${OUT}\n`);
    };


    info(data: LogData) {
        const OUT = ["string", "number", "undefined"].includes(typeof data) ? data : JSON.stringify(data, null, 2);

        return console.log(`\n${chalk.bgHex(this.COLORS.cyan).hex("#000").bold(" INFO ")} - ${chalk.hex(this.COLORS.cyan).underline(this.name + ":")}${chalk.hex(this.COLORS.cyan)(":")} ${OUT}\n`);
    };


    warn(data: LogData) {
        const OUT = ["string", "number", "undefined"].includes(typeof data) ? data : JSON.stringify(data, null, 2);

        return console.log(`\n${chalk.bgHex(this.COLORS.orange).hex("#000").bold(" WARNING ")} - ${chalk.hex(this.COLORS.orange).underline(this.name + ":")} ${OUT}\n`);
    };


    error(data: LogData) {
        const OUT = ["string", "number", "undefined"].includes(typeof data) ? data : JSON.stringify(data, null, 2);

        return console.log(`\n${chalk.bgHex(this.COLORS.red).hex("#000").bold(" ERROR ")} - ${chalk.hex(this.COLORS.red).underline(this.name + ":")} ${OUT}\n`);
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

    //_ FILE LOGGING
    async file(data: FileLogData): Promise<void> {
        const YEAR = new Date().getFullYear();
        const FILE_PATH = `${this.log_stream}${YEAR}.json`;
        const LOG_FILE = await fs.open(FILE_PATH, "rs+", 0x666);

        await LOG_FILE.readFile({flag: "rs+"})
            .then(async (file_buffer: Buffer) => {
                let log_data = JSON.parse(file_buffer.toString());

                log_data.push(data);
                console.log({log_data});

                await LOG_FILE.writeFile(
                    JSON.stringify(log_data, null, 4),
                    {encoding: "utf-8"}
                )
                .catch((err) => {
                    throw err;
                })
                .finally(() => {
                    LOG_FILE.close();
                });
            })
            .catch((err: any) => {
                this.error(`ERROR LOADING FILE! FILE NOT LOGGED: ${err}`);
            });
    }
}