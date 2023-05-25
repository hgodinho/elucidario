export type GetPathsReturn = {
    root: string;
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