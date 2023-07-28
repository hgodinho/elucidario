export type mdorim = {
    name: string,
    version: string,
    description: string,
    schemas: Record<string, any>,
    translations: Record<string, any>,
    mapping: Record<string, any>,
    examples: Record<string, any>,
    decycle: (obj: any) => any,
    retrocycle: (obj: any) => any,
}