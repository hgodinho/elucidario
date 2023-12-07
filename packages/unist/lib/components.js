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
    return u(type, data, children);
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
 * Bold
 * @param {string} value | Value of node
 * @returns {object} | Bold object
 * @link https://github.com/syntax-tree/mdast/tree/main#strong
 */
export function bold(value) {
    return parent("strong", [text(value)]);
}

/**
 * Italic
 * @param {string} value | Value of node
 * @returns {object} | Italic object
 * @link https://github.com/syntax-tree/mdast/tree/main#emphasis
 */
export function italic(value) {
    return parent("emphasis", [text(value)]);
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
 * Blockquote
 * @param {string} value | Value of node
 * @returns {object} | Blockquote object
 * @link https://github.com/syntax-tree/mdast/tree/main#blockquote
 */
export function blockquote(value) {
    return parent("blockquote", [text(value)]);
}
