import Command from "core-cli/commands/create/index.js";
import schema from "./schema.js";
import { exec } from "child_process";

class CreateMigrationCommand extends Command {
    schema = schema;

    run() {
        const { name } = this.args;
        exec(`npx sequelize migration:generate --name ${name}`);
    }
}

export default CreateMigrationCommand;