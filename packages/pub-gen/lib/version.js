import fs from "fs";
import path from "path";
import inquirer from "inquirer";

import { Console } from "@elucidario/pkg-console";

import { getPaths } from "./getPaths.js";
const paths = getPaths();
const packageJson = JSON.parse(
    fs.readFileSync(path.resolve(paths.pubGen, "package.json"))
);

const console = new Console(packageJson);

export const version = async (args) => {
    const { publication } = args;
    try {
        if (!publication) {
            throw new Error(
                "Please provide a publication name with --publication or -p"
            );
        }

        const publicationPath = path.resolve(paths.publications, publication);
        let publicationPackageJson = JSON.parse(
            fs.readFileSync(path.resolve(publicationPath, "package.json"))
        );

        let { version } = publicationPackageJson;

        console.log(
            { version },
            {
                type: "info",
                defaultLog: true,
                title: `Actual version of ${publication}`,
            }
        );

        let parsedVersion = [];

        if (version.includes("-")) {
            const parts = version.split("-");
            const releaseParts = parts[1].split(".");
            parsedVersion = parts[0].split(".");
            parsedVersion.push({
                pre: releaseParts[0],
                version: releaseParts[1],
            });
        } else {
            parsedVersion = version.split(".");
        }

        await inquirer
            .prompt([
                {
                    type: "list",
                    name: "version",
                    message: "Select version type from semver:",
                    choices: ["major", "minor", "patch", "prerelease"],
                },
                {
                    type: "list",
                    name: "release",
                    message: "Select pre-release type:",
                    choices: ["alpha", "beta", "rc"],
                    when: (answers) => answers.version === "prerelease",
                },
            ])
            .then((answers) => {
                if (answers.version === "prerelease") {
                    if (parsedVersion[3]) {
                        parsedVersion[3].version = parsedVersion[3].version
                            ? answers.release === parsedVersion[3].pre
                                ? parseInt(parsedVersion[3].version) + 1
                                : 0
                            : 0;
                        parsedVersion[3].pre = answers.release;
                    } else {
                        parsedVersion.push({
                            pre: answers.release,
                            version: 0,
                        });
                    }
                } else {
                    if (parsedVersion[3]) {
                        delete parsedVersion[3];
                    }
                    switch (answers.version) {
                        case "major":
                            parsedVersion[0] = parseInt(parsedVersion[0]) + 1;
                            parsedVersion[1] = 0;
                            parsedVersion[2] = 0;
                            break;
                        case "minor":
                            parsedVersion[1] = parseInt(parsedVersion[1]) + 1;
                            break;
                        case "patch":
                            parsedVersion[2] = parseInt(parsedVersion[2]) + 1;
                            break;
                    }
                }
            });

        let newVersion = "";
        if (parsedVersion[3]) {
            newVersion = `${parsedVersion[0]}.${parsedVersion[1]}.${parsedVersion[2]}-${parsedVersion[3].pre}.${parsedVersion[3].version}`;
        } else {
            newVersion = parsedVersion.filter((v) => v).join(".");
        }

        publicationPackageJson.version = newVersion;
        fs.writeFileSync(
            path.resolve(publicationPath, "package.json"),
            JSON.stringify(publicationPackageJson, null, 4)
        );

        console.log(
            { version: newVersion },
            {
                type: "success",
                defaultLog: true,
                title: `Updated version of ${publication}`,
            }
        );
    } catch (error) {
        console.log(error.message, { type: "error" });
    }
};
