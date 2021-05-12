class CliRegisterCommands {
    #commands = {};

    add(name, constructor) {
        if(this.has(name)) throw `Command "${name}" already registered!`;
        else this.#commands[name] = constructor;
    }

    run(name, args, options, params) {
        if(!this.has(name)) throw `Command "${name}" not found!`
        else {
            const command = new this.#commands[name](name, args, options, params);
            command.run();
        }
    }

    has(name) {
        return this.#commands.hasOwnProperty(name);
    }
}

export default new CliRegisterCommands();