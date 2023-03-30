import type { Status, Table } from "@elucidario/types";

/**
 *  Convert array of strings to markdown string
 * @param values | string[]
 * @param join | string
 * @returns string
 */
export const toMD = (values: string[], join: string = "\n\n"): string =>
    values.filter((value) => value !== "").join(join);

/**
 *  Cria cabeçalho do markdown
 * @param title | string
 * @param description | string
 * @returns | string
 */
export const headerTemplate = (title: string, description: string) => {
    return toMD(
        [`---`, `title: "${title}"`, `description: ${description}`, `---`],
        "\n"
    );
};

/**
 *  Cria status markdown
 * @param status | Status
 * @returns | string
 */
export const status = (status: Status) => {
    return toMD([
        `:::${status.type} ${status.title}`,
        status.description,
        `:::`,
    ]);
};

/**
 *  Cria bloco de cabeçalho markdown
 * @param level | number 1-5
 * @param title | string
 * @returns | string
 */
export const heading = (level: number, title: string): string => {
    level = Math.max(1, Math.min(level, 5)); // limita o número entre 1 e 5
    let result = "";
    for (let i = 0; i < level; i++) {
        result += "#";
    }
    result += " " + title;
    return result;
};

/**
 *  Cria tabela markdown
 * @param title | string
 * @param titleLevel | number
 * @param headers | string[]
 * @param rows | string[][]
 * @returns | string
 */
export const table = ({ title, titleLevel, headers, rows }: Table) => {
    return toMD([
        heading(titleLevel, title),
        toMD(
            [
                `| ${headers.join(" | ")} |`,
                `| ${headers.map(() => "---").join(" | ")} |`,
                ...rows.map((row) => `| ${row.join(" | ")} |`),
            ],
            "\n"
        ),
    ]);
};
