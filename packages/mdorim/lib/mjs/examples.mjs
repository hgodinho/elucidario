// REST
import RestRioJaneiro from "../../static/mdorim/examples/rest/rio-janeiro.json" assert { type: "json" };

// STORAGE
import Options from "../../static/mdorim/examples/storage/options.json" assert { type: "json" };
import StorageRioJaneiro from "../../static/mdorim/examples/storage/rio-janeiro.json" assert { type: "json" };

const examples = {
    rest: {
        RioJaneiro: RestRioJaneiro,
    },
    storage: {
        Options,
        RioJaneiro: StorageRioJaneiro,
    },
};

export default examples;
