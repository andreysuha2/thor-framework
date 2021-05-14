import router from "core-cli/router.js";
import coreCommands from "core-commands/register.js";
import rootCommands from "root-commands/register.js";

class Cli {
    #args = {};
    #options = [];
    #commandsLists = [
        { list: coreCommands, root: "core-commands" },
        { list: rootCommands, root: "root-commands" }
    ];

    constructor([ command, ...params ]) {
        this.#registerCommands();
        let [ name, subName ] = command.split(":");
        if(!router.has(name)) {
            console.log(`Command "${name}" is not defined!`);
        } else {
            this.#initArgsOptions(params);
            router.run(name, subName, this.#args, this.#options, params);
        }
    }

    #registerCommands() {
        this.#commandsLists.forEach(({ list, root }) => {
            Object.entries(list).forEach(([ name, command ]) => router.add(name, command, root));
        });
    }

    #initArgsOptions(params) {
        const args = params.filter((param) => param[0] !== "-"),
            opts = params.filter((param) => param[0] === "-");
        this.#args = Object.fromEntries(args.map(arg => arg.split("=")).map(([ name, value ]) => {
            return [ name.trim(), value ? value.trim() : true ];
        }));
        this.#options = opts.map(opt => opt.substr(1, opt.length).split(""))
            .reduce((list, opts) => {
                list.push(...opts);
                return list;
            }, []);
    }
}

export default Cli;