import { Drive } from "./classes/Drive";
import { Credentials } from "./classes/Auth";
import { PathOrFileDescriptor } from "fs";
import type { SCOPES } from "./classes/Auth";

export interface Reply {
    id: string,
    kind: string,
    createdTime: string,
    modifiedTime: string,
    action: string,
    author: User,
    deleted: boolean,
    htmlContent: string,
    content: string
}

export interface User {
    displayName: string,
    kind: string,
    me: boolean,
    permissionId: string,
    emailAddress: string,
    photoLink: string
}

export interface Comment {
    id: string,
    kind: string,
    createdTime: string,
    modifiedTime: string,
    resolved: boolean,
    anchor: string,
    replies: Reply[],
    author: User,
    deleted: boolean,
    htmlContent: string,
    content: string,
    quotedFileContent: {
        mimeType: string,
        value: string
    }
}

export interface CommentsArgs {
    fileId: string;
    credentials: Credentials;
    tokenPath: PathOrFileDescriptor;
    scopes?: SCOPES;
    callback?: (comments: Comment[], drive: Drive) => Promise<void>;
}

export const comments = async ({
    fileId,
    credentials,
    tokenPath,
    scopes,
    callback,
}: CommentsArgs) => {
    const drive = new Drive(credentials, tokenPath, scopes);

    await drive.authenticate();

    const comments = await drive
        .getComments(fileId, {
            pageSize: 50,
        })
        .then(async (response) => {
            if (callback) {
                return await callback(response.data.items, drive);
            }
            return response.data;
        });

    return comments;
};
