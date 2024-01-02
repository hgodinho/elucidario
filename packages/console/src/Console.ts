import chalk from "chalk";

import type {
    PackageProps,
    LogOptions,
    LogProps,
    LogType,
    Message,
} from "@elucidario/pkg-types";

/**
 * Console
 * @param pkg | PackageProps
 *
 * @example
 * ```ts
 *
 * import { Console } from "@elucidario/console";
 * import { pkg } from "./package.json";
 *
 * const console = new Console(pkg);
 *
 * console.info("Hello World!");
 * console.success("Hello World!");
 * console.warning("Hello World!");
 * console.error("Hello World!");
 *
 * ```
 */
export class Console {
    pkg: PackageProps;
    stack: string | undefined;
    message: any;

    constructor(pkg: PackageProps) {
        this.pkg = pkg;
        this.parseError();
    }

    /**
     *       ___       ___           ___
     *      /\__\     /\  \         /\  \
     *     /:/  /    /::\  \       /::\  \
     *    /:/  /    /:/\:\  \     /:/\:\  \
     *   /:/  /    /:/  \:\  \   /:/  \:\  \
     *  /:/__/    /:/__/ \:\__\ /:/__/_\:\__\
     *  \:\  \    \:\  \ /:/  / \:\  /\ \/__/
     *   \:\  \    \:\  /:/  /   \:\ \:\__\
     *    \:\  \    \:\/:/  /     \:\/:/  /
     *     \:\__\    \::/  /       \::/  /
     *      \/__/     \/__/         \/__/
     */
    /**
     * Log
     * @param message | string | Error | Record<string, unknown> | unknown
     * @param options | LogOptions<LogType>
     * @returns | void
     */
    log(
        message: Message | LogProps<LogType> | any,
        options: LogOptions<LogType> = { type: "info", defaultLog: false },
    ) {
        let color = chalk.cyan;
        let bg = chalk.bgCyanBright;
        let { type, defaultLog, title } = options;

        if (message instanceof Error) {
            this.parseError(message);
            defaultLog = true;
        } else if (typeof message === "object") {
            defaultLog = true;
            this.message = message;
        } else {
            this.message = message;
        }

        if (type) {
            switch (type) {
                case "error":
                    color = chalk.red;
                    bg = chalk.bgRedBright;
                    break;
                case "warning":
                    color = chalk.yellow;
                    bg = chalk.bgYellowBright;
                    break;
                case "info":
                    color = chalk.cyan;
                    bg = chalk.bgCyanBright;
                    break;
                case "success":
                    color = chalk.green;
                    bg = chalk.bgGreenBright;
                    break;
            }
        }

        if (defaultLog) {
            console.group();
            console.log(bg(chalk.black(chalk.bold(` ${this.pkg.name} `))));
            if (title) console.log(color(`--- ${title} ---`));
            console.dir(this.message);
            if (this.stack) {
                console.log(color(`--- ${this.stack} ---`));
            } else {
                console.log(color(`---`));
            }
            console.groupEnd();
            return;
        }

        console.log(
            bg(chalk.black(chalk.bold(` ${this.pkg.name} `))),
            color(this.message),
        );
    }

    /**
     *       ___           ___           ___           ___           ___           ___           ___
     *      /\  \         /\  \         /\  \         /\  \         /\  \         /\  \         /\  \
     *     /::\  \       /::\  \       /::\  \       /::\  \       /::\  \       /::\  \       /::\  \
     *    /:/\:\  \     /:/\:\  \     /:/\:\  \     /:/\ \  \     /:/\:\  \     /:/\:\  \     /:/\ \  \
     *   /::\~\:\  \   /::\~\:\  \   /::\~\:\  \   _\:\~\ \  \   /::\~\:\  \   /::\~\:\  \   _\:\~\ \  \
     *  /:/\:\ \:\__\ /:/\:\ \:\__\ /:/\:\ \:\__\ /\ \:\ \ \__\ /:/\:\ \:\__\ /:/\:\ \:\__\ /\ \:\ \ \__\
     *  \/__\:\/:/  / \/__\:\/:/  / \/_|::\/:/  / \:\ \:\ \/__/ \:\~\:\ \/__/ \/_|::\/:/  / \:\ \:\ \/__/
     *       \::/  /       \::/  /     |:|::/  /   \:\ \:\__\    \:\ \:\__\      |:|::/  /   \:\ \:\__\
     *        \/__/        /:/  /      |:|\/__/     \:\/:/  /     \:\ \/__/      |:|\/__/     \:\/:/  /
     *                    /:/  /       |:|  |        \::/  /       \:\__\        |:|  |        \::/  /
     *                    \/__/         \|__|         \/__/         \/__/         \|__|         \/__/
     */
    /**
     * Error Parser
     * @param error | Error
     */
    parseError(error: Error | undefined = undefined) {
        if (typeof error !== "undefined") {
            this.message = error.message;
            this.stack = error.stack?.split("\n")[1];
        }
    }

    /**
     * Parse Options
     * @param message | Message | LogOptions<LogType>
     * @param type | LogType
     * @returns | LogOptions<LogType>
     */
    parseOptions(
        message: Message | LogOptions<LogType>,
        type: LogType = "info",
    ) {
        const options: LogOptions<LogType> = {
            defaultLog: true,
            title: "",
            type,
        };
        if (typeof message === "string") {
            options["defaultLog"] = false;
        }
        if (message instanceof Error) {
            options["title"] = "Error";
            if (type === "warning") options["title"] = "Warning";
        }
        return options;
    }

    /**
     *       ___           ___           ___       ___           ___           ___           ___
     *      /\__\         /\  \         /\__\     /\  \         /\  \         /\  \         /\  \
     *     /:/  /        /::\  \       /:/  /    /::\  \       /::\  \       /::\  \       /::\  \
     *    /:/__/        /:/\:\  \     /:/  /    /:/\:\  \     /:/\:\  \     /:/\:\  \     /:/\ \  \
     *   /::\  \ ___   /::\~\:\  \   /:/  /    /::\~\:\  \   /::\~\:\  \   /::\~\:\  \   _\:\~\ \  \
     *  /:/\:\  /\__\ /:/\:\ \:\__\ /:/__/    /:/\:\ \:\__\ /:/\:\ \:\__\ /:/\:\ \:\__\ /\ \:\ \ \__\
     *  \/__\:\/:/  / \:\~\:\ \/__/ \:\  \    \/__\:\/:/  / \:\~\:\ \/__/ \/_|::\/:/  / \:\ \:\ \/__/
     *       \::/  /   \:\ \:\__\    \:\  \        \::/  /   \:\ \:\__\      |:|::/  /   \:\ \:\__\
     *       /:/  /     \:\ \/__/     \:\  \        \/__/     \:\ \/__/      |:|\/__/     \:\/:/  /
     *      /:/  /       \:\__\        \:\__\                  \:\__\        |:|  |        \::/  /
     *      \/__/         \/__/         \/__/                   \/__/         \|__|         \/__/
     */
    info = (message: Message | LogProps<"info"> | any) => {
        this.log(message, this.parseOptions(message));
    };

    success = (message: Message | LogProps<"success"> | any) => {
        this.log(message, this.parseOptions(message, "success"));
    };

    warning = (message: Message | LogProps<"warning"> | any) => {
        this.log(message, this.parseOptions(message, "warning"));
    };

    error = (message: Message | LogProps<"error"> | any) => {
        this.log(message, this.parseOptions(message, "error"));
    };

    /**
     *       ___           ___                   ___           ___
     *      /\  \         /\__\      ___        /\  \         /\  \
     *     /::\  \       /:/  /     /\  \      /::\  \       /::\  \
     *    /:/\:\  \     /:/  /      \:\  \    /:/\:\  \     /:/\ \  \
     *   /::\~\:\  \   /:/  /       /::\__\  /::\~\:\  \   _\:\~\ \  \
     *  /:/\:\ \:\__\ /:/__/     __/:/\/__/ /:/\:\ \:\__\ /\ \:\ \ \__\
     *  \/__\:\/:/  / \:\  \    /\/:/  /    \/__\:\/:/  / \:\ \:\ \/__/
     *       \::/  /   \:\  \   \::/__/          \::/  /   \:\ \:\__\
     *       /:/  /     \:\  \   \:\__\          /:/  /     \:\/:/  /
     *      /:/  /       \:\__\   \/__/         /:/  /       \::/  /
     *      \/__/         \/__/                 \/__/         \/__/
     */
    warn = this.warning;
}
