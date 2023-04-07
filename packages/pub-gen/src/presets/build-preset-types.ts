import { compile } from "json-schema-to-typescript";
import fs from "fs";
import path from "path";
import readContent from "../readContent";
import { JSONSchema4Object } from "json-schema";
import { fileURLToPath } from "url";

import { parseArgs } from "@elucidario/parse-args";

export type Entitiy<T extends string> = {
    [key in T]: JSONSchema4Object;
};

export type Preset = {
    schemas: Record<string, Entitiy<string>>;
};

export type Files = {
    [key: string]: Preset;
};

// const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * @todo aguardar bug ser corrigido:
 * @see https://github.com/bcherny/json-schema-to-typescript/issues/519
 */

const buildPresetTypes = async (
    dirPath: fs.PathOrFileDescriptor | undefined = undefined
) => {
    const options = parseArgs();

    if (!dirPath) {
        // dirPath = path.resolve(
        //     options.path as string,
        //     "src",
        //     "presets"
        // ) as fs.PathOrFileDescriptor;

        dirPath = path.join("src", "presets") as fs.PathOrFileDescriptor;
    }

    const files: Files = readContent(dirPath as string);
    console.log("Building preset types: ", {
        options,
        dirPath,
        files,
    });

    try {
        Object.entries(files).forEach(async ([presetName, preset]) => {
            console.log("Preset", { presetName, preset });

            try {
                Object.entries(preset.schemas).forEach(
                    ([schemaName, schemas]) => {
                        // console.log("Schema", { schemaName, schemas });
                        try {
                            Object.entries(schemas).forEach(
                                async ([schemaPropName, schemaProp]) => {
                                    console.log("dir", { dirPath, __dirname });

                                    const schemaType = await compile(
                                        schemaProp,
                                        schemaPropName,
                                        {
                                            bannerComment: "",
                                            cwd: path.resolve(
                                                dirPath as string,
                                                presetName,
                                                "schemas"
                                            ),
                                            unreachableDefinitions: true,
                                            $refOptions: {
                                                dereference: {
                                                    circular: false,
                                                },
                                            },
                                        }
                                    );

                                    const outDir = path.resolve(
                                        __dirname,
                                        "..",
                                        "dist",
                                        "presets",
                                        presetName,
                                        "schemas",
                                        schemaName
                                    );

                                    removeDirRecursive(outDir);
                                    fs.mkdirSync(outDir, { recursive: true });
                                    fs.writeFileSync(
                                        `${outDir}/${schemaPropName}.ts`,
                                        schemaType
                                    );

                                    console.log("Schema outdir: ", outDir);
                                }
                            );
                        } catch (err) {
                            console.error(err);
                        }
                    }
                );
            } catch (err) {
                return;
            }
        });
    } catch (err) {
        console.error(err);
    }

    // const presetsFolder =
};

const removeDirRecursive = (dirPath: string) => {
    if (fs.existsSync(dirPath)) {
        fs.readdirSync(dirPath).forEach((file) => {
            const filePath = path.join(dirPath, file);

            if (fs.lstatSync(filePath).isDirectory()) {
                removeDirRecursive(filePath);
            } else {
                fs.unlinkSync(filePath);
            }
        });

        fs.rmdirSync(dirPath);
    }
};

buildPresetTypes();

export default buildPresetTypes;
