interface ParsedArgs {
    path: string;
    [key: string]: string | boolean;
}
export declare const parseArgs: () => ParsedArgs;
export {};
