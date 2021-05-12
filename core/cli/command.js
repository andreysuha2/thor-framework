class Command {
    name;
    args;
    options;
    params;

    constructor(name, args, options, params) {
        this.name = name;
        this.args = args;
        this.options = options;
        this.params = params;
    }

    hasOption(name) {
        return this.options.includes(name);
    }

    hasArg(name) {
        return this.args.hasOwnProperty(name);
    }

    run() {
        console.log(`Command ${this.name} running`);
    }
}

export default Command;