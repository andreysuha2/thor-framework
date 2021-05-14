import Command from "core-cli/commands/create/index.js";
import schema from "./schema.js";
import path from "path";
import url from "url";
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

class CreateMiddlewareCommand extends Command {
    templatePath = path.resolve(__dirname, "template.hbs");
    pathToFolder = `${process.cwd()}/src/middlewares`;
    schema = schema;

    constructor() {
        super();
        this.successMessage = `Middleware "${this.args.name}" created!`;
    }
}

export default CreateMiddlewareCommand;