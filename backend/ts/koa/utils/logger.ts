import chalk from "chalk";
import type { LogData, RequestTokens, ResponseTokens } from "./types.js";


const SERVER_COLORS: Record<string, string> = {
    request: "#EF596F",
    response: "#61AFEF"
};


//_ KOA
export const RequestLog = (tokens: RequestTokens) => {
    return console.log(`\n${chalk.bgHex(SERVER_COLORS.request).bold(" REQUEST ")} \n${chalk.bold(tokens.method)} ${chalk.underline(tokens.path)}, date:${chalk.italic(tokens.date)} \nquery: ${chalk.hex(SERVER_COLORS.request)(JSON.stringify(tokens.query, null, 2))} \nbody: ${chalk.hex(SERVER_COLORS.request)(JSON.stringify(tokens.body, null, 2))} \nparams: ${chalk.hex(SERVER_COLORS.request)(JSON.stringify(tokens.params, null, 2))}\n`);
};


export const ResponseLog = (tokens: ResponseTokens) => {
    return console.log(`\n${chalk.bgHex(SERVER_COLORS.response).bold(" RESPONSE ")} \nstatus:${chalk.hex(SERVER_COLORS.response).bold(tokens.status)}, content-length:${chalk.bold(tokens.length)}, response time:${chalk.bold(tokens.responseTime + "ms")}\n`);
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