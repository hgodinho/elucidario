export type LogType = "error" | "warning" | "info" | "success";

export type LogOptions<T extends LogType> = {
    // message: string;
    type: T;
    title?: string;
    defaultLog?: boolean;
};

export type LogProps<T extends LogType> = LogOptions<T> & {
    message: string;
};
