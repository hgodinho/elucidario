import { exec } from "child_process";
import { Console } from "@elucidario/pkg-console";

/**
 * Cli utility
 */
export const cli = async (cmd, title, pkg) => {
    if (!pkg) throw new Error("No package.json provided");
    const console = new Console(pkg);
    console.log(title);
    exec(cmd, async (error, stdout, stderr) => {
        if (error) {
            console.log(
                { error },
                {
                    defaultLog: true,
                    type: "error",
                    title: "Error",
                },
            );
            return;
        }
        if (stderr) {
            console.log(stderr, {
                defaultLog: true,
                type: "warning",
                title: "stderr",
            });
            return;
        }
        console.log(
            { stdout },
            {
                defaultLog: true,
                type: "success",
                title: "stdout",
            },
        );
    });
};
