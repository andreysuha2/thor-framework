import Command from "core-cli/commands/create/index.js";
import schema from "./schema.js";
import path from "path";
import url from "url";
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

class CreateRequestCommand extends Command {
    templatePath = path.resolve(__dirname, "template.hbs");
    pathToFolder = `${process.cwd()}/src/requests`;
    schema = schema;
    default = {
        args: {
            pre: false,
            post: false
        }
    }

    constructor() {
        super();
        this.successMessage = `Request ${this.args.name} created!`;
    }

    getTemplateData(name) {
        return { ...this.args, name };
    }
}

export default CreateRequestCommand;