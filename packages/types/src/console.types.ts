export type LogType = 'error' | 'warning' | 'info' | 'success';

export type LogProps = {
    message: string;
    type: string;
    prefix?: string;
};

export type LogOptions = {
    type?: LogType;
    title?: string;
    defaultLog?: boolean;
};