export type PackageContributor = {
    name: string;
    email: string;
    url?: string;
};

export type PackageProps = {
    name: string;
    version: string;
    license: string;
    description?: string;
    homepage?: string;
    author?: PackageContributor;
    contributors?: PackageContributor[];
};