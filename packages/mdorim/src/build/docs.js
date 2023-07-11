import fs from "fs";
import path from "path";

import { readContents } from "@elucidario/pkg-paths";
import { pubGenRemarkProcessor } from "@elucidario/pkg-pub-gen/lib/remark/processor.js";

const outDocs = "docs";

/**
 * Build docs
 */
export const buildDocs = async (pkg, __dirname) => {
    if (!pkg) throw new Error("No package.json provided");
    const pages = readContents(path.join(__dirname, "pages"), ["md"]);
    return Promise.all(
        Object.entries(pages).map(async ([name, page]) => {
            const newFile = await pubGenRemarkProcessor(page, {
                pubGen: {
                    path: __dirname,
                },
            });
            fs.writeFile(
                path.resolve(outDocs, `${name}.md`),
                newFile.toString(),
                (err) => {
                    if (err)
                        console.log(`There was an error: ${err}`, {
                            type: "error",
                            defaultLog: true,
                        });
                }
            );
            const sidebar = fs.readFileSync(
                path.join(__dirname, "sidebars.cjs"),
                "utf8"
            );
            const localSidebar = fs.readFileSync(
                path.join(__dirname, "localSidebars.cjs"),
                "utf8"
            );
            fs.writeFile(
                path.resolve(outDocs, "sidebars.cjs"),
                sidebar.toString(),
                (err) => {
                    if (err)
                        console.log(`There was an error: ${err}`, {
                            type: "error",
                            defaultLog: true,
                        });
                }
            );
            fs.writeFile(
                path.resolve(outDocs, "localSidebars.cjs"),
                localSidebar.toString(),
                (err) => {
                    if (err)
                        console.log(`There was an error: ${err}`, {
                            type: "error",
                            defaultLog: true,
                        });
                }
            );
        }),
        console.log("Done!", { type: "success" })
    );
};
