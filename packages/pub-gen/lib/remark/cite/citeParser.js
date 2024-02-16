import { visit } from "unist-util-visit";
import { mdToMdast, referencesFrom } from "../../utils.js";

import { engine } from "../../reference/csl-engine.js";
import { Console } from "@elucidario/pkg-console";

function citeParser(options) {
    const { publication, pkg } = options;

    const console = new Console(pkg);

    const references = referencesFrom(publication);
    const citeproc = engine(references, options.lang, options.style.csl);

    return async function transformer(tree) {
        const items = [];

        visit(tree, "cite", (node) => {
            const ID = [...Array(6)]
                .map(() => Math.random().toString(36)[2])
                .join("");
            items.push({ node, ID });
        });

        let preProcessed = [];

        await Promise.all(
            items.map(async ({ ID, node }, index) => {
                const itemsIDs = [];

                const cites = node.data.citeItems.map(({ key, ...item }) => {
                    itemsIDs.push(key);
                    return {
                        id: key,
                        ...item,
                    };
                });

                const Items = references.filter((ref) =>
                    itemsIDs.includes(ref.id),
                );

                const pre = items
                    .slice(0, index)
                    .map((citeItem) => [citeItem.ID, 0]);

                const processedCitation = await citeproc.processCitationCluster(
                    {
                        // citation.
                        citationID: ID,
                        properties: {
                            noteIndex: 0,
                        },
                        citationItems: cites,
                        citeItems: Items,
                    },
                    // citationsPre.
                    pre,
                    // citationsPost.
                    [],
                );

                preProcessed.push(...processedCitation[1]);
            }),
        );

        preProcessed.map((citation) => {
            const { ID, node } = items.find((item) => item.ID === citation[2]);
            node.type = "paragraph";
            node.children = mdToMdast(citation[1]);
        });
    };
}

export default citeParser;
