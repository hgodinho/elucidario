export default async function (old) {
    const { publications, documents, languages, ...oldConfig } = old;

    const config = {
        ...oldConfig,
        $schema:
            "node_modules/@elucidario/pkg-pub-gen/static/pub-gen/schemas/pub-gen-schema.json",
        version: "1.0.0",
        private: false,
        documents:
            typeof publications !== "undefined" ? publications : documents,
    };

    return {
        config,
        added: ["private", "documents"],
        modified: ["$schema", "version"],
        removed: ["publications", "languages"],
    };
}
