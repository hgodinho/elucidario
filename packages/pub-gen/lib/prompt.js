export const pubGenPrompt = (args) => [
    {
        type: "input",
        name: "titulo",
        message: "Qual o título da publicação?",
        default: args.titulo,
    },
    {
        type: "list",
        name: "tipo",
        message: "Qual o tipo da publicação?",
        default: args.tipo,
        choices: ["artigo", "livro", "capítulo", "periódico", "outro"],
    },
    {
        type: "input",
        name: "instituicaoAfiliada",
        message: "Qual a instituição afiliada?",
        default: args.instituicaoAfiliada,
    },
    {
        type: "input",
        name: "instituicaoPublicacao",
        message: "Qual a instituição da publicação?",
        default: args.instituicaoPublicacao,
    },
    {
        type: "input",
        name: "ano",
        message: "Qual o ano?",
        default: args.ano,
    },
    {
        type: "input",
        name: "palavrasChave",
        message: "Palavras chave separadas por vírgula",
        default: args.palavrasChave,
    },
    {
        type: "list",
        name: "preset",
        message: "Qual preset deseja usar?",
        default: args.preset,
        choices: ["abnt"],
    },
    {
        type: "confirm",
        name: "multiIdioma",
        message: "A publicação será em mais de um idioma?",
        default: args.multiIdioma,
    },
    {
        type: "input",
        name: "idiomas",
        message:
            "Quais os idiomas? Utilize a ISO 639-1, por exemplo: pt, en, es. Separe por vírgula",
        default: args.idiomas,
        when: (answers) => answers.multiIdioma,
    },
    {
        type: "input",
        name: "idiomaPadrao",
        message:
            "Qual o idioma padrão? Utilize a ISO 639-1, por exemplo: pt, en, es",
        default: args.idiomaPrincipal,
        when: (answers) => !answers.multiIdioma,
    },
    {
        type: "confirm",
        name: "instalarDependencias",
        message: "Instalar dependências?",
        default: args.instalarDependencias,
    },
];
