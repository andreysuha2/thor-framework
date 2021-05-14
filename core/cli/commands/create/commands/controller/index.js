import Command from "core-cli/commands/create/index.js";
import schema from "./schema.js";
import path from "path";
import url from "url";
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

class CreateControllerCommand extends Command {
    fileNamePrefix = "Controller";
    templatePath = path.resolve(__dirname, "template.hbs");
    pathToFolder = `${process.cwd()}/src/controllers`;
    schema = schema;
    default = {
        args: { crud: false }
    }

    constructor() {
        super();
        this.successMessage = `Controller "${this.args.name}" created!`;
    }

    get methods() {
        return this.args.methods ? this.args.methods.split(",") : false
    }

    getTemplateData(name) {
        return { crud: this.args.crud, name, methods: this.methods };
    }
}

export default CreateControllerCommand;