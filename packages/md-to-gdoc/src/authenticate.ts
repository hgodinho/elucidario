import { Auth, Credentials } from "./classes/Auth";
import { SCOPES as EnumScopes } from "./enums";
import type { SCOPES } from "./classes/Auth";
import fs, { PathOrFileDescriptor } from "fs";
import { parseArgs } from "@elucidario/pkg-parse-args";

export const authenticate = async (
    credentials: Credentials | undefined = undefined,
    scopes: SCOPES | undefined = undefined,
    path: PathOrFileDescriptor | undefined = undefined
) => {
    try {
        const options = parseArgs();

        if (!credentials) {
            credentials = JSON.parse(
                fs.readFileSync(options.path + "credentials.json", "utf8")
            ).installed as Credentials;
        }
        if (!scopes) {
            scopes = EnumScopes as SCOPES;
        }

        path = path ? path : (options.path as string);

        const auth = new Auth(credentials, scopes, path);
        await auth.authenticate();
    } catch (err) {
        console.error(err);
    }
};
