import chalk from "chalk";
import {TokenIndexer} from "morgan";
import { Request, Response } from "express";
import { AxiosError } from "axios";

import { FileLogData, Framework, LogData, RequestTokens, ResponseTokens, LogError } from "./types.js";

export enum Levels {
    DEBUG = 4,
    INFO = 3,
    WARNING = 2,
    ERROR = 1,
    CRITICAL = 0
}


export class Verbal {
    name: string;
    metadata: any;
    level: Levels;
    readonly printable_types: Array<string> = ["string", "number", "undefined", "null", "bigint", "boolean"];
    readonly COLORS: Record<string, string> = {
        red: "#E88388",
        orange: "#EB8B59",
        yellow: "#DBCB79",
        cyan: "#66C2CD",
        blue: "#71BEF2",
        purple: "#D290E3",
        white: "#e7e7e7",
        black: "#000"
    };


    //_ CONSTRUCTORS
    constructor(name: string = `${process.env.npm_package_name}`, level: Levels = Levels.INFO, metadata: any = {}) {
        this.name = name;
        this.metadata = metadata;
        this.level = level
    };


    //_ GENERAL LOGGING FUNCTIONS
    log(message: string | undefined, data: LogData | LogError, level: Levels, intro: string) {


        const prepareOut = (): any => {
            let out: any = {
                metadata: this.metadata,
                timestamp: new Date(Date.now()).toLocaleTimeString("en-GB", {hour12: false}),
            }

            out.message = message;
            out.data = data;

            return out;
        }
        

        return console.log(`${intro} \n${JSON.stringify(prepareOut(), null, 4)} \n`)
    }


    debug(message: string | undefined, data: LogData) {
        let intro: string = chalk.hex(this.COLORS.white).italic(`(${new Date(Date.now()).toLocaleDateString()}) `);

        if (this.level < Levels.DEBUG) return null;

        intro += chalk.bgHex(this.COLORS.white).hex("#000").bold(" DEBUG "); //* add the level
        intro += " - " //* separate level from logger name
        intro += chalk.hex(this.COLORS.white).underline(this.name + ":") //* add logger name
        //TODO: consider adding datestamp to intro
        
        return this.log(message, data, Levels.DEBUG, intro);
    };


    trace(message: string | undefined, data: LogData) {
        let intro: string = chalk.hex(this.COLORS.white).italic(`(${new Date(Date.now()).toLocaleDateString()}) `);

        if (this.level < Levels.DEBUG) return null;

        intro += chalk.bgHex(this.COLORS.white).hex("#000").bold(" TRACE "); //* add the level
        intro += " - " //* separate level from logger name
        intro += chalk.hex(this.COLORS.white).underline(this.name + ":") //* add logger name

        return this.log(message, data, Levels.DEBUG, intro)
    }


    info(message: string | undefined, data: LogData) {
        let intro: string = chalk.hex(this.COLORS.cyan).italic(`(${new Date(Date.now()).toLocaleDateString()}) `);

        if (this.level < Levels.INFO) return null;

        intro += chalk.bgHex(this.COLORS.cyan).hex("#000").bold(" INFO "); //* add the level
        intro += " - " //* separate level from logger name
        intro += chalk.hex(this.COLORS.cyan).underline(this.name + ":") //* add logger name

        return this.log(message, data, Levels.INFO, intro)
    };


    warning(message: string | undefined, data: LogData) {
        let intro: string = chalk.hex(this.COLORS.orange).italic(`(${new Date(Date.now()).toLocaleDateString()}) `);

        if (this.level < Levels.WARNING) return null;

        intro += chalk.bgHex(this.COLORS.orange).hex("#000").bold(" WARNING "); //* add the level
        intro += " - " //* separate level from logger name
        intro += chalk.hex(this.COLORS.orange).underline(this.name + ":") //* add logger name

        return this.log(message, data, Levels.WARNING, intro)
    };


    warn = this.warning;


    error(message: string | undefined, data: LogError) {
        let intro: string = chalk.hex(this.COLORS.red).italic(`(${new Date(Date.now()).toLocaleDateString()}) `);

        if (this.level < Levels.ERROR) return null;
        
        intro += chalk.bgHex(this.COLORS.red).hex("#000").bold(" ERROR ");
        intro += " - "; //* separate level from logger name
        intro += chalk.hex(this.COLORS.red).underline(this.name + ":"); //* add logger name

        if (data instanceof AxiosError) {
            data = data.toJSON();
        }

        return this.log(message, data, Levels.ERROR, intro)
    };


    exception(message: string | undefined, data: LogData | LogError): any {

        return this.log(message, data, Levels.ERROR, "EXCEPTION")
    }


    critical(message: string | undefined, data: LogData) {
        let intro: string = chalk.hex(this.COLORS.black).italic(`(${new Date(Date.now()).toLocaleDateString()}) `);

        if (this.level < Levels.CRITICAL) return null;
        
        intro += chalk.bgHex(this.COLORS.black).hex("#fff").bold(" CRITICAL ");
        intro += " - " //* separate level from logger name
        intro += chalk.hex(this.COLORS.black).underline(this.name + ":") //* add logger name

        return this.log(message, data, Levels.CRITICAL, intro)
    }


}