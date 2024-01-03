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
    pkg?: PackageProps;
}

export interface ReadFileProps {
    filePath: string;
    ext?: string;
    enc?: BufferEncoding;
    returnType?: "path" | "content";
}

export interface CreateFileProps {
    filePath: string;
    enc?: BufferEncoding;
    ext?: string;
    replacer?: any;
    space?: string | number;
}

export interface File {
    name: string;
    path: string;
    ext: string;
    value?: any;
    size?: number;
    atime?: Date;
    mtime?: Date;
    ctime?: Date;
    birthtime?: Date;
}

export type ParseFileProps = {
    name: string;
    path: string;
    ext?: string;
    value?: string;
};

export type ReadContentsReturn = File[];
