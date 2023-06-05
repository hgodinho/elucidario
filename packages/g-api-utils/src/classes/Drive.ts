import { google } from "googleapis";
import { Auth, Credentials } from "./Auth";
import * as fs from "fs";
import { SCOPES as EnumScopes } from "../enums";
import type { SCOPES } from "./Auth";

export interface Document {
    id: string;
    url: string;
    title: string;
    createdTime: string;
    updatedTime?: string;
}

/**
 * Drive class
 */
export class Drive {
    private auth: Auth | undefined;
    private drive: any;

    /**
     * Drive class
     * @param credentials | Credentials object
     * @param scopes | Scopes to use
     * @param path | Path to document.json
     */
    constructor(
        private readonly credentials: Credentials,
        private tokenPath: fs.PathOrFileDescriptor,
        private scopes: SCOPES | undefined
    ) {
        if (!scopes) {
            this.scopes = EnumScopes as SCOPES;
        }
    }

    /**
     * Authenticate with Google
     * @throws | Error
     */
    public async authenticate() {
        this.auth = new Auth(
            this.credentials,
            this.scopes as SCOPES,
            this.tokenPath
        );
        if (this.auth) {
            await this.auth
                .authenticate()
                .then((response) => {
                    this.drive = google.drive({
                        version: "v3",
                        auth: this.auth ? this.auth.getAuth() : undefined,
                    });
                    console.log({ drive: this.drive })

                    // this.docs = google.docs({
                    //     version: "v1",
                    //     auth: this.auth ? this.auth.getAuth() : undefined,
                    // });
                })
                .catch((error) => {
                    throw new Error(error);
                });
        }
    }

}
