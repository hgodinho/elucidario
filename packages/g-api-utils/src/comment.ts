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
    options?: {
        includeDeleted?: boolean;
        pageSize?: number;
        pageToken?: string;
        updateMin?: string;
    }
    callback?: (comments: Comment[], drive: Drive, nextPageToken?: string) => Promise<void>;
}

/**
 * 
 * @param param0 | CommentsArgs
 * @param param0.fileId | File ID
 * @param param0.credentials | Credentials object
 * @param param0.tokenPath | Path to token.json
 * @param param0.scopes | Scopes to use
 * @param param0.options | Options
 * @param param0.callback | Callback function
 * @throws | Error
 * 
 * @returns | Comments 
 */
export const comments = async ({
    fileId,
    credentials,
    tokenPath,
    scopes,
    options,
    callback,
}: CommentsArgs) => {
    const drive = new Drive(credentials, tokenPath, scopes);

    await drive.authenticate();

    const comments = await drive
        .getComments(fileId, options)
        .then(async (response) => {
            if (callback) {
                return await callback(response.data.items, drive, response.data.nextPageToken);
            }
            return response.data;
        });

    return comments;
};
