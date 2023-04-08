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
 * GoogleDocs class
 */
export class GoogleDocs {
    private auth: Auth | undefined;
    private docs: any;

    /**
     * GoogleDocs class
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
                    this.docs = google.docs({
                        version: "v1",
                        auth: this.auth ? this.auth.getAuth() : undefined,
                    });
                })
                .catch((error) => {
                    throw new Error(error);
                });
        }
    }

    /**
     * Creates a new document
     * @param title | Title of the document
     * @returns | Document object
     */
    public async createDocument(title: string): Promise<Document> {
        try {
            const newDocument = await this.docs.documents.create({
                title,
            });
            const docInfo = this.parseDocument(newDocument, true);
            return docInfo;
        } catch (err) {
            await this.authenticate();
            return this.createDocument(title);
        }
    }

    // public async updateDocument(
    //     content: string,
    //     documentId: string | undefined = undefined
    // ): Promise<Document> {
    //     try {
    //         if (!documentId && this.document) {
    //             documentId = this.document.id;
    //         }
    //     } catch (err) {
    //         throw new Error("No document found");
    //     }

    //     const requests = [
    //         {
    //             replaceAllText: {
    //                 containsText: {
    //                     text: "{{content}}",
    //                     matchCase: true,
    //                 },
    //                 replaceText: content,
    //             },
    //         },
    //     ];

    //     console.log("Updating document: ", { documentId, doc: this.document });

    //     // const { data } = await this.docs.documents.batchUpdate({
    //     //     documentId,
    //     //     requestBody: {
    //     //         requests,
    //     //     },
    //     // });

    //     // const documentUrl = `https://docs.google.com/document/d/${documentId}/edit`;

    //     // const documentInfo: Document = {
    //     //     id: documentId,
    //     //     url: documentUrl,
    //     //     title: data.title,
    //     //     createdTime: data.createdTime,
    //     // };

    //     // fs.writeFileSync("document.json", JSON.stringify(documentInfo));

    //     const documentInfo = {};
    //     return documentInfo;
    // }

    /**
     * Parse the document received from the API
     * @param any | API response
     * @param newDocument | Is this a new document?
     * @returns | Document object
     */
    public parseDocument(
        document: any,
        newDocument: boolean = false
    ): Document {
        const documentId = document.data.documentId;
        const documentUrl = `https://docs.google.com/document/d/${documentId}/edit`;
        const documentInfo: Document = {
            id: documentId,
            url: documentUrl,
            title: document.data.title,
            createdTime: newDocument ? document.headers.date : "",
            updatedTime: document.headers.date,
        };
        return documentInfo;
    }
}
