import { GoogleDocs } from "./classes/GoogleDocs";
import { Credentials } from "./classes/Auth";
import parseArgs from "./functions/parseArgs";
import readContent from "./functions/readContent";
import fs from "fs";
import type { SCOPES } from "./classes/Auth";

const sync = async (
    credentials: Credentials | undefined = undefined,
    scopes: SCOPES | undefined = undefined,
    path: fs.PathOrFileDescriptor | undefined = undefined
) => {
    const options = parseArgs();

    if (!credentials) {
        credentials = JSON.parse(
            fs.readFileSync(options.path + "credentials.json", "utf8")
        ).installed as Credentials;
    }

    if (!path) {
        path = options.path as string;
    }

    const content = readContent(options.path + 'content')

    console.log("Syncing document: ", {options, content});
    

    // const googleDocs = new GoogleDocs(credentials, scopes, path);
    // try {
    //     googleDocs.updateDocument();
    // } catch (err) {
    //     await googleDocs.authenticate();
    //     googleDocs.createDocument(title);
    // }
};

sync();
