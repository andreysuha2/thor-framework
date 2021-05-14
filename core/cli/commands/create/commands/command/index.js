import Command from "core-cli/commands/create/index.js";
import schema from "./schema.js";
import path from "path";
import url from "url";
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
import fs from "fs";
import outputFile from "output-file";

class CreateCommandCommand extends Command {
    templatePath = path.resolve(__dirname, "template.hbs");
    schemaTemplatePath = path.resolve(__dirname, "schemaTemplate.hbs");
    pathToFolder = `${process.cwd()}/src/commands`;
    schema = schema;
    indexAsName = true;
    default = { args: { parent: false } };

    constructor() {
        super();
        const { parent, name } = this.args;
        if (parent) this.pathToFolder = `${this.pathToFolder}/${parent}/commands/${name}`;
        else this.pathToFolder = `${this.pathToFolder}/${name}`;
        this.successMessage = `Command "${this.args.name}" created!`;
    }

    get templateData() {
        return {
            children: this.isOption("c") && !this.args.parent,
            schema: this.isOption("s"),
            validation: this.isOption("v"),
            defaults: this.isOption("d"),
            parent: this.args.parent
        }
    }

    run() {
        if(this.isOption("s")) {
            this.createSchema()
                .then(() => super.run())
                .catch(e => {
                    console.log(`Create command failed!`);
                    console.log(e);
                });
        } else super.run();
    }

    getTemplateData(name) {
        return { name, ...this.templateData }
    }

    createSchema() {
        return new Promise((resolve, reject) => {
            this.loadSchemaTemplate()
                .then(async schema => {
                    await outputFile(`${this.pathToFolder}/schema.js`, schema, {
                        dirMode: "0755",
                        fileMode: "0644"
                    });
                    resolve();
                }).catch(e => reject(e));
        });
    }

    loadSchemaTemplate() {
        return new Promise((resolve, reject) => {
            fs.readFile(this.schemaTemplatePath, (err, data) => {
                if(err) reject(err);
                else resolve(Buffer.from(data).toString());
            });
        });
    }
}

export default CreateCommandCommand;