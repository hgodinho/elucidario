import * as fs from "fs";
import * as readline from "readline";
import { google, Auth as AuthType } from "googleapis";
import * as http from "http";

export interface Credentials {
    client_secret: string;
    client_id: string;
}

export type SCOPES = string[];

const TOKEN_PATH = "token.json";
const PORT = 3000;

export class Auth {
    private auth: AuthType.OAuth2Client | null = null;

    constructor(
        private readonly credentials: Credentials,
        private readonly SCOPES: SCOPES,
        private path: fs.PathOrFileDescriptor | undefined = undefined
    ) {}

    /**
     * Create an OAuth2 client with the given credentials
     */
    async authenticate(): Promise<void> {
        const { client_secret, client_id } = this.credentials;

        const oAuth2Client = new google.auth.OAuth2(
            client_id,
            client_secret,
            `http://localhost:${PORT}/oauth2callback`
        );

        const tokenPath = this.path ? this.path + TOKEN_PATH : TOKEN_PATH;

        try {
            const token = fs.readFileSync(tokenPath);
            oAuth2Client.setCredentials(JSON.parse(token as unknown as string));
            this.auth = oAuth2Client;
            console.log("Token json file found");
        } catch (err) {
            const authUrl = oAuth2Client.generateAuthUrl({
                access_type: "offline",
                scope: this.SCOPES,
            });

            const server = http.createServer(async (req, res) => {
                if (req.url && req.url.startsWith("/oauth2callback")) {
                    const qs = new URLSearchParams(
                        req.url.replace("/oauth2callback?", "")
                    );
                    const code = qs.get("code");
                    if (code) {
                        try {
                            const { tokens } = await oAuth2Client.getToken(
                                code
                            );
                            oAuth2Client.setCredentials(tokens);
                            fs.writeFileSync(
                                tokenPath as fs.PathOrFileDescriptor,
                                JSON.stringify(tokens)
                            );
                            console.log("Token stored to", tokenPath);
                            this.auth = oAuth2Client;
                            res.end(
                                "Authentication successful. You can close this window now."
                            );
                        } catch (err) {
                            console.error("Error retrieving access token", err);
                            res.end("Authentication failed. Please try again.");
                        }
                    } else {
                        res.end("Authentication failed. Please try again.");
                    }
                } else {
                    res.end("Google Drive and Docs Authentication");
                }
            });

            server.listen(PORT, () => {
                console.log(
                    `Server running at http://localhost:${PORT} and waiting for authentication...`
                );
            });

            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
            });

            console.log(
                `Please visit the following URL to authenticate: ${authUrl}`
            );

            await new Promise<void>((resolve) => {
                rl.question(
                    "Press Enter to close server and stop authentication process",
                    () => {
                        rl.close();
                        server.close();
                        resolve();
                    }
                );
            });
        }
    }

    /**
     * Returns the OAuth2 client
     * @returns AuthType.OAuth2Client
     */
    getAuth(): AuthType.OAuth2Client {
        if (!this.auth) {
            throw new Error("Authentication required.");
        }
        return this.auth;
    }
}
