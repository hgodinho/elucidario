import * as fs from "fs";
import * as readline from "readline";
import { google, Auth as AuthType } from "googleapis";
import * as http from "http";
import path from "path";
import chalk from "chalk";

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

        const tokenPath = this.path
            ? path.resolve(this.path as string, TOKEN_PATH)
            : path.resolve(TOKEN_PATH);

        try {
            const token = fs.readFileSync(tokenPath);
            oAuth2Client.setCredentials(JSON.parse(token as unknown as string));
            this.auth = oAuth2Client;
            console.log(chalk.green("Token json file found"));
        } catch (err) {
            const authUrl = oAuth2Client.generateAuthUrl({
                access_type: "offline",
                scope: this.SCOPES,
            });

            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
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
                            console.log(
                                chalk.cyan("Token stored to", tokenPath)
                            );
                            this.auth = oAuth2Client;
                            res.end(
                                "Authentication successful. You can close this window now."
                            );
                            server.close();
                            rl.close();
                        } catch (err) {
                            console.error(
                                chalk.red("Error retrieving access token", err)
                            );
                            res.end("Authentication failed. Please try again.");
                            server.close();
                            rl.close();
                        }
                    } else {
                        res.end("Authentication failed. Please try again.");
                        server.close();
                        rl.close();
                    }
                } else {
                    res.end("Google Drive and Docs Authentication");
                    server.close();
                    rl.close();
                }
            });

            server.listen(PORT, () => {
                console.log(chalk.yellow("Waiting for authentication..."));
            });

            console.log(
                chalk.yellow("Please visit the following URL to authenticate"),
                chalk.green(chalk.underline(authUrl))
            );

            await new Promise<void>((resolve) => {
                rl.question(
                    chalk.redBright(
                        "Press Enter to close server and stop authentication process\n"
                    ),
                    () => {
                        server.close();
                        rl.close();
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
