import { PackageProps } from "./package.types";

export type GetPathsReturn = {
    root: string;
    current: string;
    packages: string;
    apps: string;
    publications: string;
    references: string;
    tools: string;
    monorepo: {
        packages: [string, string][];
        apps: [string, string][];
        publications: [string, string][];
        tools: [string, string][];
    };
};

export interface BuildOptions {
    package: PackageProps;
    watch?: boolean;
    watchSrc?: string | string[];
}

export interface BuildCallbackProps {
    options: BuildOptions;
}

export interface FNCallbackProps {
    event: string;
    filename?: string;
}

export interface ReadContentsProps {
    dirPath: string;
    index?: boolean;
    extensions?: string[];
    returnType?: "path" | "content";
    exclude?: string[];
    log?: boolean;
    package?: PackageProps;
}

export interface ReadFileProps {
    filePath: string;
    ext?: string;
    enc?: BufferEncoding;
}

export interface CreateFileProps {
    filePath: string;
    enc?: BufferEncoding;
    ext?: string;
    replacer?: any;
    space?: string | number;
}
// JSON.stringify(pubGenJson, null, 4)
export interface File<T extends unknown> {
    name: string;
    path: string;
    content: T;
    ext?: string;
    size?: number;
    atime?: Date;
    mtime?: Date;
    ctime?: Date;
    birthtime?: Date;
}

export type ParseFileProps = {
    name: string;
    path: string;
    content: string;
    ext?: string;
};

export type ReadContentsReturn<T> = File<T>[];
