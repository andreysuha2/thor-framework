import register from "core-cli";
import coreCommands from "core-commands/register";
import rootCommands from "root-commands/register";

class Cli {
    #args = {};
    #options = [];
    #commandsLists = [ coreCommands, rootCommands ];

    constructor([ command, ...params ]) {
        this.#registerCommands();
        if(register.has(command)) throw `Command "${name}" already registered!`;
        else {
            this.#initArgsOptions(params);
            register.run(command, this.#args, this.#options);
        }
    }

    #registerCommands() {
        this.#commandsLists.forEach(list => {
            Object.entries(list).forEach(([ name, command ]) => register.add(name, command));
        });
    }

    #initArgsOptions(params) {
        const args = params.filter((param) => param[0] !== "-"),
            opts = params.filter((param) => param[0] === "-");
        this.#args = Object.fromEntries(args.map(arg => arg.split("=").map((item) => item.trim())));
        this.#options = opts.map(opt => opt.substr(1, opt.length).split(""))
            .reduce((list, opts) => {
                list.push(...opts);
                return list;
            }, []);
    }
}

export default Cli;