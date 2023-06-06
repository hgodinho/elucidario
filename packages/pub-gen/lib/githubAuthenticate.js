import { config } from "dotenv";
import { App } from "octokit";
import path from "path";
import { getPaths } from "@elucidario/pkg-paths";

config({
    path: path.resolve(getPaths().packages, "pub-gen", ".env"),
});

export const githubAuthenticate = async () => {
    const app = new App({
        appId: process.env.GITHUB_APP_ID,
        privateKey: process.env.GITHUB_APP_PRIVATE_KEY,
    });
    const octokit = await app.getInstallationOctokit(
        process.env.GITHUB_INSTALLATION_ID
    );
    return octokit;
};
