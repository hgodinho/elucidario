import { debounce } from "lodash-es";

import type { BuildOptions, BuildCallbackProps, FNCallbackProps } from "@elucidario/pkg-types";
import { Console } from "@elucidario/pkg-console";

import fs from "fs";
import path from "path";

import { getPaths } from "./getPaths";
const { packages } = getPaths();

export const build = async (
    options: BuildOptions,
    callback: (props: BuildCallbackProps) => Promise<void>
) => {
    try {
        if (!callback) throw new Error("callback is required");

        const console = new Console(options.package);

        const fn = async ({ event, filename }: FNCallbackProps) => {
            try {
                console.log(`${event}${filename ? `: ${filename}` : ""}`, {
                    type: "info",
                });
                await callback({ options });
            } catch (err: any) {
                throw new Error(err)
            }
        };

        await fn({ event: "Building..." });

        if (options.watch) {
            if (!options.watchSrc) throw new Error("watchSrc is required");

            console.log("Watching for changes...", { type: "info" });
            try {
                switch (typeof options.watchSrc) {
                    case "string":
                        fs.watch(
                            path.resolve(options.watchSrc),
                            { recursive: true, encoding: "buffer" },
                            () => debounce(
                                async (event: string, filename: string) => await fn({ event, filename }),
                                500
                            )
                        );
                        break;

                    case "object":
                        options.watchSrc.forEach((src: string) => {
                            fs.watch(
                                path.resolve(src),
                                { recursive: true, encoding: "buffer" },
                                () => debounce(
                                    async (event: string, filename: string) => await fn({ event, filename }),
                                    500
                                )
                            );
                        });
                }
            } catch (err: any) {
                throw new Error(err);
            }
        }
    }

    catch (err: any) {
        const packageJson = JSON.parse(fs.readFileSync(
            path.resolve(packages, 'paths', "package.json")
        ).toString());
        const console = new Console(packageJson);
        console.log(err, { type: "error", defaultLog: true, title: "Error" });
    }
};