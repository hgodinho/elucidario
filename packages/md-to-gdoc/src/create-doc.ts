import { GoogleDocs } from "./classes/GoogleDocs";
import { Credentials } from "./classes/Auth";
import { PathOrFileDescriptor } from "fs";
import type { SCOPES } from "./classes/Auth";

export const createDoc = async (
    title: string,
    credentials: Credentials,
    tokenPath: PathOrFileDescriptor,
    scopes: SCOPES | undefined = undefined
) => {
    const googleDocs = new GoogleDocs(credentials, tokenPath, scopes);

    try {
        return await googleDocs.createDocument(title);
    } catch (err) {
        await googleDocs.authenticate();
        return await googleDocs.createDocument(title);
    }
};
