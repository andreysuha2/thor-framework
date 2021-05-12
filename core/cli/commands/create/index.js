import Command from "core-cli/command.js";

class CreateCommand extends Command {
    #essences = {
        controller: {},
        middleware: {},
        request: {},
        command: {}
    };

    get #essencesList() {
        return Object.keys(this.#essences).join(", ");
    }

    run() {
        const [ essence ] = this.params;
        if(!essence || !this.#essences.hasOwnProperty(essence)) {
            console.log(`For now you can create only: ${this.#essencesList}`);
        } else console.log(`${essence} created`);
    }
}

export default CreateCommand