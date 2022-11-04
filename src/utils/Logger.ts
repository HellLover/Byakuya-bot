import chalk from "chalk";
import util from "node:util";

const output = (msg: string) => `[${new Date().toLocaleString()}] | ${msg}`;

type LogEvent = "EVENT" | "COMMAND" | "CONNECTION";

class Logger extends console.Console {
    constructor(output?: NodeJS.WritableStream | null) {
        super({
            stdout: output ?? process.stdout
        });
    }

    log(message: any) {
        super.log(chalk.green(output(typeof message === "string" ? message : util.inspect(message))))
    }

    warn(message: any) {
        super.warn(`[${chalk.bgYellow("ERROR")}] ` + chalk.yellow(output(typeof message === "string" ? message : util.inspect(message))))
    }

    error(message: any) {
        super.error(`[${chalk.bgRed("ERROR")}] ` + chalk.red(output(typeof message === "string" ? message : util.inspect(message))))
    }

    info(type: LogEvent, message: any) {
        super.log(`[${type === "COMMAND" ? chalk.bgBlue("COMMAND") : type === "EVENT" ? chalk.bgGreen("EVENT") : chalk.bgCyan("CONNECTION")}] ${(output(typeof message === "string" ? message : util.inspect(message)))}`)
    }

}

export { Logger };