import type { Status, Table } from "@elucidario/types";

/**
 *  Convert array of strings to markdown string
 * @param values | string[]
 * @param join | string
 * @returns string
 * @example
 * ```ts
 * toMD(["first string", "second string", ""], "\n\n");
 * // first string\n\nsecond string
 * ```
 */
export const toMD = (values: string[], join: string = "\n\n"): string =>
    values
        .filter((value) => value)
        .map((value) => value.trim())
        .join(join);

/**
 *  Cria cabeçalho do markdown
 * @param title | string
 * @param description | string
 * @returns | string
 * @example
 * ```ts
 * headerTemplate("title", "description");
 * // ---
 * // title: 'title'
 * // description: description
 * // ---
 */
export const headerTemplate = (title: string, description: string) => {
    return toMD(
        [`---`, `title: '${title}'`, `description: ${description}`, `---`],
        "\n"
    );
};

/**
 *  Cria status markdown
 * @param status | Status
 * @returns | string
 * @example
 * ```ts
 * status({
 *    type: "info",
 *    title: "title",
 *    description: "description",
 * });
 * // :::info title
 * //
 * // description
 * //
 * // :::;
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
 * @example
 * ```ts
 * heading(1, "title");
 * // # title
 * ```
 * @see https://www.markdownguide.org/basic-syntax/#headings
 */
export const heading = (level: number, title: string): string => {
    level = Math.max(1, Math.min(level, 5));
    const hash = "#".repeat(level);
    return `${hash} ${title}`;
};

/**
 *  Cria tabela markdown
 * @param title | string
 * @param titleLevel | number
 * @param headers | string[]
 * @param rows | string[][]
 * @returns | string
 * @example
 * ```ts
 * table({
 *   title: "title",
 *   titleLevel: 3,
 *   headers: ["firstHeader", "secondHeader"],
 *   rows: [["firstRow", "secondRow"]],
 * });
 * // ### title
 * //
 * // | firstHeader | secondHeader |
 * // | --- | --- |
 * // | firstRow | secondRow |
 * ```
 * @see https://www.markdownguide.org/extended-syntax/#tables
 */
export const table = ({ title, titleLevel, headers, rows }: Table) => {
    const tableRows = rows.map((row) => `| ${row.join(" | ")} |`).join("\n");
    const headerRow = `| ${headers.join(" | ")} |`;
    const dividerRow = `| ${headers.map(() => "---").join(" | ")} |`;
    const header = title && titleLevel ? `${heading(titleLevel, title)}\n` : "";
    return toMD([header, `${headerRow}\n${dividerRow}\n${tableRows}`]);
};

/**
 *  Cria bloco de código markdown
 * @param code | string
 * @param language | string
 * @returns | string
 * @example
 * ```ts
 * codeBlock("code", "json");
 * // ```json
 * ```
 * @see https://www.markdownguide.org/basic-syntax/#code-blocks
 */
export const codeBlock = (code: string, language: string = "json") => {
    return toMD([`\`\`\`${language}`, code, `\`\`\``], "\n");
};

/**
 * Cria bloco de código inline markdown
 * @param code | string
 * @returns | string
 * @example
 * ```ts
 * codeInline("code");
 * // `code`
 * ```
 * @see https://www.markdownguide.org/basic-syntax/#inline-code
 */
export const codeInline = (code: string) => {
    return `\`${code.trim()}\``;
};

/**
 * Cria bloco de citação markdown
 * @param quote | string
 * @returns | string
 * @example
 * ```ts
 * quote("quote");
 * // > quote
 * ```
 * @see https://www.markdownguide.org/basic-syntax/#blockquotes-1
 */
export const quote = (quote: string) => {
    return `> ${quote}`;
};

/**
 * Cria texto em negrito markdown
 * @param text | string
 * @returns | string
 * @example
 * ```ts
 * bold("text");
 * // **text**
 * ```
 * @see https://www.markdownguide.org/basic-syntax/#bold
 */
export const bold = (text: string) => {
    return `**${text}**`;
};

/**
 * Cria texto em itálico markdown
 * @param text | string
 * @returns | string
 * @example
 * ```ts
 * italic("text");
 * // *text*
 * ```
 * @see https://www.markdownguide.org/basic-syntax/#italic
 */
export const italic = (text: string) => {
    return `_${text}_`;
};

/**
 * Cria texto em negrito e itálico markdown
 * @param text | string
 * @returns | string
 * @example
 * ```ts
 * boldItalic("text");
 * // ***text***
 * ```
 * @see https://www.markdownguide.org/basic-syntax/#bold-and-italic
 */
export const boldItalic = (text: string) => {
    return `***${text}***`;
};

/**
 * Cria texto com risco markdown
 * @param text | string
 * @returns | string
 * @example
 * ```ts
 * strike("text");
 * // ~~text~~
 * ```
 * @see https://www.markdownguide.org/basic-syntax/#strikethrough
 */
export const strike = (text: string) => {
    return `~~${text}~~`;
};

/**
 * Cria texto com sublinhado markdown
 * @param text | string
 * @returns | string
 * @example
 * ```ts
 * underline("text");
 * // <u>text</u>
 * ```
 * @see https://www.markdownguide.org/basic-syntax/#underline
 */
export const underline = (text: string) => {
    return `<u>${text}</u>`;
};

/**
 *  Cria link markdown
 * @param text | string
 * @param url | string
 * @returns | string
 * @example
 * ```ts
 * link("text", "https://example.com");
 * // [text](https://example.com)
 * ```
 * @see https://www.markdownguide.org/basic-syntax/#links
 */
export const link = (text: string, url: string) => {
    return `[${text}](${url})`;
};

/**
 * Cria link de imagem markdown
 * @param text | string
 * @param url | string
 * @returns | string
 * @example
 * ```ts
 * image("text", "https://example.com/image.png");
 * // ![text](https://example.com/image.png)
 * ```
 * @see https://www.markdownguide.org/basic-syntax/#images
 */
export const image = (text: string, url: string) => {
    return `![${text}](${url})`;
};
