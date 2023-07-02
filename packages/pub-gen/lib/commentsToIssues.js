import { comments } from "@elucidario/pkg-g-api-utils";
import path from "path";
import fs from "fs";
import {
    toMD,
    heading,
    table,
    italic,
    bold,
} from "@elucidario/pkg-docusaurus-md";

import { Console } from "@elucidario/pkg-console";
import { getPaths } from "@elucidario/pkg-paths";

import { getCredentials } from "./getCredentials.js";
import { githubAuthenticate } from "./githubAuthenticate.js";

const paths = getPaths();

export const createIssue = async ({
    issue,
    octokit,
    fileId,
    commentId,
    drive,
}) => {
    const { data } = await octokit.rest.issues.create({
        owner: "hgodinho",
        repo: "elucidario",
        ...issue,
    });

    const reply = await drive.replyComment(
        fileId,
        commentId,
        `[pub-gen] issue: ${data.html_url}`
    );

    console.log(
        {
            reply: {
                created: reply.data.createdDate,
                data: reply.data.content,
            },
            issueUrl: data.html_url,
            issueTitle: data.title,
        },
        {
            title: `Issue criada: ${data.html_url}`,
            type: "success",
            defaultLog: true,
        }
    );
};

export const mountIssue = ({ fileId, comment, pkgName, publication }) => {
    return {
        title: `Comentário em \`${comment.fileTitle}\` - ${comment.htmlContent}`,
        body: toMD([
            heading(
                1,
                `Comentário no arquivo \`${comment.fileTitle}\` de \`${pkgName}\``
            ),
            heading(
                6,
                `por: ${comment.author.displayName} em: ${new Date(
                    comment.modifiedDate
                ).toLocaleString()}`
            ),
            italic(
                `[link para o comentário](https://docs.google.com/document/d/${fileId}/edit?disco=${comment.commentId})`
            ),
            table({
                headers: ["fileId", "fileTitle", "commentId", "status"],
                rows: [
                    [
                        fileId,
                        comment.fileTitle,
                        comment.commentId,
                        comment.status,
                    ],
                ],
            }),
            comment.context
                ? toMD([
                      heading(2, "Contexto do comentário"),
                      `${bold("type:")} ${comment.context.type}`,
                      `> ${comment.context.value}`,
                  ])
                : "",
            heading(2, "Conteúdo do comentário"),
            comment.htmlContent,
            "---",
            italic(
                `issue criada automaticamente por [pub-gen](https://elucidario.art/pub-gen)`
            ),
        ]),
        labels: ["project", `pub-${publication}`],
    };
};

export const commentsToIssues = async ({ fileId, publication }) => {
    if (!publication) {
        throw new Error("Publication not defined");
    }
    if (!fileId) {
        throw new Error("FileId not defined");
    }

    const pkg = JSON.parse(
        fs.readFileSync(
            path.resolve(paths.publications, publication, "package.json")
        )
    );

    const console = new Console(pkg);

    const credentials = getCredentials();

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const octokit = await githubAuthenticate();

    const commentList = await comments({
        fileId,
        credentials,
        tokenPath: paths.root,
        scopes: ["https://www.googleapis.com/auth/drive"],
        options: {
            maxResults: 100,
        },
        callback: async (comments, drive, nextPageToken) => {
            // filter comments
            comments = comments.filter((comment) => {
                // if resolved, ignore
                if (comment.status === "resolved") {
                    return false;
                }

                // if reply includes pub-gen, issue already created, ignore
                let reply = false;
                comment.replies.map((rep) => {
                    if (
                        "content" in rep &&
                        rep.content.includes("[pub-gen] issue: ")
                    ) {
                        reply = true;
                    }
                });
                if (reply) {
                    return false;
                }

                // if open, create issue
                return comment.status === "open";
            });

            console.log(`total: ${comments.length}`);

            comments.map(async (comment) => {
                const issue = mountIssue({
                    fileId,
                    comment,
                    pkgName: pkg.name,
                    publication,
                });

                await delay(1000).then(async () => {
                    await createIssue({
                        issue,
                        octokit,
                        fileId,
                        commentId: comment.commentId,
                        drive,
                    });
                });
            });
        },
    });
};
