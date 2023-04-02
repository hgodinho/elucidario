import { GoogleDocs } from "./classes/GoogleDocs";
import { Credentials } from "./classes/Auth";
import parseArgs from "./parseArgs";
import fs from "fs";
import type { SCOPES } from "./classes/Auth";

const createDoc = async (
    title: string | undefined = undefined,
    credentials: Credentials | undefined = undefined,
    scopes: SCOPES | undefined = undefined,
    path: fs.PathOrFileDescriptor | undefined = undefined
) => {
    const options = parseArgs();
    if (!options.title) {
        throw new Error("No title provided");
    }

    if (!credentials) {
        credentials = JSON.parse(
            fs.readFileSync(options.path + "credentials.json", "utf8")
        ).installed as Credentials;
    }

    if (!path) {
        path = options.path as string;
    }

    if (!title) {
        title = options.title as string;
    }

    if (!title) {
        throw new Error("No title provided");
    }

    const googleDocs = new GoogleDocs(credentials, scopes, path);
    try {
        googleDocs.createDocument(title);
    } catch (err) {
        await googleDocs.authenticate();
        googleDocs.createDocument(title);
    }
};

createDoc();
