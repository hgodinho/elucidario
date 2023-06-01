import { PackageProps } from "./package.types";

export type GetPathsReturn = {
    root: string;
    current: string;
    packages: string;
    apps: string;
    publications: string;
    references: string;
    monorepo: {
        packages: [string, string][];
        apps: [string, string][];
        publications: [string, string][];
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

export type ReadContentsReturn = { [key: string]: string | any };

export interface ReadContentsProps {
    dirPath: string;
    index?: boolean;
    extensions?: string[];
    returnType?: "path" | "content";
    exclude?: string[];
    log?: boolean;
    package?: PackageProps;
}
