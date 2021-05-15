import Command from "core-cli/command.js";
import { capitalizeFirstLetter } from "core-helpers";
import fs from "fs";
import outputFile from "output-file";
import handlebars from "handlebars";


class CreateCommand extends Command {
    successMessage = "Created complete!";
    fileNamePrefix = "";
    indexAsName = false;
    static children = [ "controller", "middleware", "request", "command", "migration" ];


    run() {
        let { name: pathName } = this.args,
            { name, path } = this.parsePath(pathName);
        this.loadTemplate()
            .then((template) => handlebars.compile(template))
            .then((template) => template(this.getTemplateData(name)))
            .then((template) => this.create(template, `${path}/${this.getName(name)}`))
            .then(() => console.log(this.successMessage))
            .catch((e) => console.log(e));
    }

    getTemplateData(name) {
        return { name };
    }

    getName(name) {
        return this.indexAsName ? "index.js" : `${name}${this.fileNamePrefix}.js`;
    }

    async loadTemplate() {
        return new Promise((resolve, reject) => {
            fs.readFile(this.templatePath, (err, data) => {
                if(err) reject(err);
                else resolve(Buffer.from(data).toString());
            });
        });
    }

    async create(file, path) {
        const fullPath = `${this.pathToFolder}${path}`;
        try {
            await outputFile(fullPath, file, {
                dirMode: "0755",
                fileMode: "0644"
            });
            return true;
        } catch (e) {
            return e;
        };
    }

    parsePath(path) {
        path = path.split("/");
        const name = path[path.length - 1]
        path.splice(path.length - 1, 1);
        path = path.length ? `/${path.join("/")}` : "";
        return { name: capitalizeFirstLetter(name), path }
    }
}

export default CreateCommand