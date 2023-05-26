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
    }
}

export interface BuildOptions {
    package: PackageProps;
    program?: [
        string,
        string | undefined,
        string | boolean | string[] | undefined
    ][];
    watchSrc?: string;
}

export interface BuildCallbackProps<T> {
    programOptions: T;
    options: BuildOptions;
}

export interface FNCallbackProps {
    event: string;
    filename?: string;
}