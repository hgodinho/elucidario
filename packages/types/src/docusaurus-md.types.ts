export type Table = {
    title?: string | false;
    titleLevel?: number;
    headers: string[];
    rows: string[][];
    note?: {
        label?: string;
        content: string;
    };
};