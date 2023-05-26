import { Command, OptionValues } from "commander";
import { debounce } from "lodash-es";

import type { BuildOptions, BuildCallbackProps, FNCallbackProps } from "@elucidario/pkg-types";
import { Console } from "@elucidario/pkg-console";

import fs from "fs";
import path from "path";

import { getPaths } from "./getPaths";
const { packages } = getPaths();

export const build = async (
    options: BuildOptions,
    callback: (props: BuildCallbackProps<OptionValues>) => Promise<void>
) => {
    try {
        if (!callback) throw new Error("callback is required");

        const program = new Command("build");

        program.option("-w, --watch", "Watch for changes", false);

        if (options.program) {
            options.program.forEach((option) => {
                program.option(...option);
            });
        }

        program.parse();

        const programOptions = program.opts();

        const console = new Console(options.package);

        console.log({ programOptions, options }, { defaultLog: true });

        const fn = async ({ event, filename }: FNCallbackProps) => {
            try {
                console.log(`${event}${filename ? `: ${filename}` : ""}`, {
                    type: "info",
                });
                await callback({ programOptions, options });
            } catch (error: any) {
                throw new Error(error)
            }
        };

        await fn({ event: "Building..." });
        if (programOptions.watch) {
            if (!options.watchSrc) throw new Error("watchSrc is required");

            console.log("Watching for changes...", { type: "info" });
            fs.watch(
                path.resolve(options.watchSrc),
                { recursive: true },
                debounce(
                    async (event: string, filename: string) => await fn({ event, filename }),
                    500
                )
            );
        }
    }

    catch (error: any) {
        const packageJson = JSON.parse(fs.readFileSync(
            path.resolve(packages, 'paths', "package.json")
        ).toString());
        const console = new Console(packageJson);
        console.log(error, { type: "error", defaultLog: true, title: "Error" });
    }
};