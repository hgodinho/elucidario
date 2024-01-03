import { u } from "unist-builder";

/**
 * Literal
 * @param {string} type | Type of node
 * @param {string} value | Value of node
 * @returns {object} | Literal object
 * @link https://github.com/syntax-tree/mdast/tree/main#literal
 */
export function literal(type = "text", value) {
    if (typeof value !== "string") throw new Error("Expected string value");
    return u(type, value);
}

/**
 * Parent
 * @param {string} type | Type of node
 * @param {array} children | Array of children
 * @returns {object} | Parent object
 * @link https://github.com/syntax-tree/mdast/tree/main#parent
 */
export function parent(type, children) {
    return u(type, null, children);
}

/**
 * Node
 * @param {string} type | Type of node
 * @param {object} data | Data object
 * @param {array} children | Array of children
 * @returns {object} | Node object
 * @link https://github.com/syntax-tree/mdast/tree/main#nodes-abstract
 */
export function node(type, data, children) {
    return u(
        type,
        typeof data !== "undefined" ? { data } : undefined,
        children,
    );
}

/**
 * Blockquote
 * @param {string} value | Value of node
 * @returns {object} | Blockquote object
 * @link https://github.com/syntax-tree/mdast/tree/main#blockquote
 */
export function blockquote(value) {
    return parent("blockquote", [value]);
}

/**
 * Break
 *
 * @returns {object} | Break object
 * @link https://github.com/syntax-tree/mdast/tree/main#break
 */
export function breakNode() {
    return node("break");
}

/**
 * Text
 * @param {string} value | Value of node
 * @returns {object} | Text object
 * @link https://github.com/syntax-tree/mdast/tree/main#text
 */
export function text(value) {
    return literal("text", String(value));
}

/**
 * Italic
 * @param {string} value | Value of node
 * @returns {object} | Italic object
 * @link https://github.com/syntax-tree/mdast/tree/main#emphasis
 */
export function italic(value) {
    return parent("emphasis", value);
}

/**
 * Bold
 * @param {string} value | Value of node
 * @returns {object} | Bold object
 * @link https://github.com/syntax-tree/mdast/tree/main#strong
 */
export function bold(value) {
    return parent("strong", value);
}

/**
 * Paragraph
 * @param {array} value | Value of node
 * @returns {object} | Paragraph object
 * @link https://github.com/syntax-tree/mdast/tree/main#paragraph
 */
export function paragraph(value) {
    return parent("paragraph", value);
}

/**
 * Definition
 * @param {string} identifier | Identifier of node
 * @param {string} label | Label of node
 * @param {string} url | Url of node
 * @param {string} title | Title of node
 * @returns {object} | Definition object
 */
export function definition(identifier, label, url, title) {
    return u("definition", { identifier, label, url, title });
}

/**
 * InlineCode
 * @param {string} value | Value of node
 * @returns {object} | InlineCode object
 * @link https://github.com/syntax-tree/mdast/tree/main#inlinecode
 */
export function inlineCode(value) {
    return literal("inlineCode", value);
}

/**
 * Code
 * @param {string} value | Value of node
 * @returns {object} | Code object
 * @link https://github.com/syntax-tree/mdast/tree/main#code
 */
export function code(value, lang, meta) {
    return u("code", { value, lang, meta });
}

/**
 * Heading
 * @param {number} depth | Depth of node
 * @param {string} value | Value of node
 * @returns {object} | Heading object
 * @link https://github.com/syntax-tree/mdast/tree/main#heading
 */
export function heading(depth, value) {
    return u("heading", { depth }, value);
}

/**
 * HTML
 * @param {string} value | Value of node
 * @returns {object} | HTML object
 * @link https://github.com/syntax-tree/mdast/tree/main#html
 */
export function html(value) {
    return literal("html", value);
}

/**
 * Image
 * @param {string} alt | Alt of node
 * @param {string} url | Url of node
 * @param {string} title | Title of node
 * @returns {object} | Image object
 * @link https://github.com/syntax-tree/mdast/tree/main#image
 */
export function image({ alt, url, title }) {
    return u("image", { alt, url, title });
}

/**
 * Table
 * @param {string} align | Align of node
 * @param {array} children | Array of children
 * @returns {object} | Table object
 * @link https://github.com/syntax-tree/mdast-util-gfm-table#table
 */
export function table(align, children) {
    return u(
        "table",
        { align: typeof align === "string" ? [align] : align },
        children,
    );
}

/**
 * TableRow
 * @param {array} children | Array of children
 * @returns {object} | TableRow object
 * @link https://github.com/syntax-tree/mdast-util-gfm-table#tablerow
 */
export function tableRow(children) {
    return parent("tableRow", children);
}

/**
 * TableCell
 * @param {array} children | Array of children
 * @returns {object} | TableCell object
 * @link https://github.com/syntax-tree/mdast-util-gfm-table#tablecell
 */
export function tableCell(children) {
    return parent("tableCell", children);
}
