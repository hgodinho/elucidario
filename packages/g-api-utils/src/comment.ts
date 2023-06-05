import { Drive } from "./classes/Drive";
import { Credentials } from "./classes/Auth";
import { PathOrFileDescriptor } from "fs";
import type { SCOPES } from "./classes/Auth";

export const comments = async (
    title: string,
    credentials: Credentials,
    tokenPath: PathOrFileDescriptor,
    scopes: SCOPES | undefined = undefined
) => {
    const drive = new Drive(credentials, tokenPath, scopes);

    console.log(drive);

    // try {
    //     return await googleDocs.createDocument(title);
    // } catch (err) {
    //     console.log("createDoc: catch", err);
    //     await googleDocs.authenticate();
    //     return await googleDocs.createDocument(title);
    // }
};
