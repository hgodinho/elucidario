interface ParsedArgs {
    path: string;
    [key: string]: string | boolean;
}

const parseArgs = (): ParsedArgs => {
    const parsedArgs: ParsedArgs = {
        path: "",
    };

    const args = process.argv;

    args.forEach((arg) => {
        if (arg.startsWith("--")) {
            const [option, value] = arg.slice(2).split("=");
            parsedArgs[option] = value ? value : true;
        } else {
            if (arg.includes("node_modules")) {
                parsedArgs["path"] = arg.split("node_modules")[0];
            } else {
                parsedArgs["path"] = arg.split("src")[0];
            }
        }
    });

    return parsedArgs;
};

export default parseArgs;
