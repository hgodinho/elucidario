import { GoogleDocs } from "./classes/GoogleDocs";
import { Credentials } from "./classes/Auth";
import { PathOrFileDescriptor } from "fs";
import type { SCOPES } from "./classes/Auth";

export const updateDoc = async (
    id: string,
    content: string | null = null,
    credentials: Credentials,
    tokenPath: PathOrFileDescriptor,
    scopes: SCOPES | undefined = undefined
) => {
    const googleDocs = new GoogleDocs(credentials, tokenPath, scopes);

    try {
        console.log("updateDoc: try");
        await googleDocs.authenticate();
        return await googleDocs.updateDocument(id, content);
    } catch (err) {
        console.log("updateDoc: catch");
        return err;
    }
};
