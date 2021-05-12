class CliRegisterCommands {
    #commands = {};

    add(name, constructor) {
        if(this.has(name)) throw `Command "${name}" already registered!`;
        else this.#commands[name] = constructor;
    }

    run(name, args, options) {
        if(!this.has(name)) throw `Command "${name}" not found!`
        else {
            const command = new this.#commands[name](name, args, options);
            command.run();
        }
    }

    has(name) {
        return this.#commands.hasOwnProperty(name);
    }
}

export default new CliRegisterCommands();