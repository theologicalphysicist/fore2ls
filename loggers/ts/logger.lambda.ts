//! custom logger for AWS LAMBDA

export class Verbal {
    name?: string;
    metadata?: any;
    readonly LEVELS: any = {
        6: "EVENT",
        5: "TRACE",
        4: "DEBUG",
        3: "INFO",
        2: "WARNING",
        1: "ERROR",
        0: "CRITICAL"
    };


    constructor(name: string = "lambda logger", metadata: any = {}) {
        this.name = name;
        this.metadata = metadata;


    };


    log(data: any, level: number = 3): string | void {
        if (typeof level == "number") {
            level = Object. this.LEVELS

        }

        return console.log({"level"});
    };


    debug(data: LogData) {
        const OUT = printable_types.includes(typeof data) ? data : JSON.stringify(data, null, 2);

        return console.log(`\n${chalk.bgHex(COLORS.white).hex("#000").bold(" DEBUG ")} - ${chalk.hex(COLORS.white).underline(this.name + ":")} ${OUT}\n`);
    };
}