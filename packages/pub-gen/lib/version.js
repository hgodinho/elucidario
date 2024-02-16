import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import { simpleGit } from "simple-git";

import { Console } from "@elucidario/pkg-console";
import { getPaths, readFile } from "@elucidario/pkg-paths";

const paths = getPaths();

export const version = async (args) => {
    const { publication } = args;

    const pkg = readFile(
        path.resolve(paths.publications, publication, "package.json"),
    ).value;

    const console = new Console(pkg);

    try {
        if (!publication) {
            throw new Error(
                "Please provide a publication name with --publication or -p",
            );
        }

        const publicationPath = path.resolve(paths.publications, publication);
        let pubPkg = readFile(
            path.resolve(publicationPath, "package.json"),
        ).value;

        let { version } = pubPkg;

        console.log(
            { version },
            {
                type: "info",
                defaultLog: true,
                title: `${publication}`,
            },
        );

        const git = simpleGit();
        // verifica repositório git
        try {
            const status = await git.status();
            const notAdded = status.not_added.filter((file) =>
                file.includes(publication),
            );
            const created = status.created.filter((file) =>
                file.includes(publication),
            );
            const modified = status.modified.filter((file) =>
                file.includes(publication),
            );
            const deleted = status.deleted.filter((file) =>
                file.includes(publication),
            );
            const staged = status.staged.filter((file) =>
                file.includes(publication),
            );

            // compare staged with notAdded, created, modified and deleted, if notAdded, created, modified or deleted are not in staged, throw error
            if (
                notAdded.some((file) => !staged.includes(file)) ||
                created.some((file) => !staged.includes(file)) ||
                modified.some((file) => !staged.includes(file)) ||
                deleted.some((file) => !staged.includes(file))
            ) {
                console.log(
                    {
                        notAdded,
                        created,
                        modified,
                        deleted,
                        staged,
                        status,
                    },
                    {
                        defaultLog: true,
                        type: "error",
                    },
                );
                throw new Error("Please stage your changes before versioning");
            } else if (staged.length > 0) {
                console.log(
                    {
                        staged,
                    },
                    {
                        defaultLog: true,
                        type: "error",
                    },
                );
                throw new Error("Please commit your changes before versioning");
            }
        } catch (error) {
            throw new Error(error.message);
        }

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

        let message = "";
        let push = false;

        const releaseTypes = ["major", "minor", "patch"];
        const preReleaseTypes = [
            "premajor",
            "preminor",
            "prepatch",
            "prerelease",
        ];

        await inquirer
            .prompt([
                {
                    type: "list",
                    name: "version",
                    message: "Select version type from semver:",
                    choices: [...releaseTypes, ...preReleaseTypes],
                },
                {
                    type: "list",
                    name: "release",
                    message: "Select pre-release type:",
                    choices: ["alpha", "beta", "rc"],
                    when: (answers) =>
                        preReleaseTypes.includes(answers.version),
                },
                {
                    type: "number",
                    name: "preVersion",
                    message: "Define prerelease version",
                    when: (answers) =>
                        preReleaseTypes.includes(answers.version),
                },
                {
                    type: "string",
                    name: "message",
                    message: "Type a commit message:",
                },
                {
                    type: "confirm",
                    name: "push",
                    message: "Push changes to remote?",
                    default: false,
                },
            ])
            .then((answers) => {
                message = answers.message;
                push = answers.push;
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

        pubPkg.version = newVersion;
        fs.writeFileSync(
            path.resolve(publicationPath, "package.json"),
            JSON.stringify(pubPkg, null, 4),
        );

        console.log("Adding changes to git...");
        await git.add(publicationPath);
        console.log("Committing changes to git...");
        await git.commit(`chore(${publication}) ${newVersion} ${message}`, {
            "--no-verify": true,
        });
        if (push) {
            console.log("Pushing changes to remote...");
            await git.push();
        }

        console.log(
            { version: newVersion },
            {
                type: "success",
                defaultLog: true,
                title: `Updated version of ${publication}`,
            },
        );
    } catch (error) {
        console.log(error.message, { type: "error" });
    }
};
