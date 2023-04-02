interface ParsedArgs {
    [key: string]: string | boolean;
}

const parseArgs = (): ParsedArgs => {
    const parsedArgs: ParsedArgs = {};

    // Ignora os primeiros dois elementos do `process.argv`, pois eles contêm o caminho para o executável e o nome do script
    const args = process.argv;

    args.forEach((arg) => {
        // Verifica se o argumento começa com '--', indicando que é uma opção
        if (arg.startsWith("--")) {
            // Remove o '--' e separa o argumento em duas partes, o nome da opção e o valor
            const [option, value] = arg.slice(2).split("=");
            // Define o valor da opção como `true` se não houver um valor definido
            parsedArgs[option] = value ? value : true;
        } else {
            // Define o argumento como uma propriedade com valor `true`
            if ( arg.includes('node_modules') ) {
                parsedArgs['path'] = arg.split( 'node_modules' )[0];
            } else {
                parsedArgs[arg] = true;
            }
        }
    });

    return parsedArgs;
};

export default parseArgs;