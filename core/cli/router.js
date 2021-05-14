class CliCommandsRouter {
    #commands = {};
    arguments = null;

    add(name, constructor, rootPath) {
        if(this.has(name)) throw `Command "${name}" already registered!`;
        else this.#commands[name] = { constructor, rootPath };
    }

    run(name, subName, args, options, params) {
        if(!this.has(name)) throw `Command "${name}" not found!`
        else {
            this.#initArguments(name, subName, args, options, params);
            const command = this.#commands[name];
            if(subName) this.#runSubCommand(command, name, subName);
            else this.#runCommand(command.constructor);
        }
    }

    has(name) {
        return this.#commands.hasOwnProperty(name);
    }

    #runSubCommand({ constructor: command, rootPath }, name, subName) {
        if(!command.hasOwnProperty("children")) console.log(`Command ${name} don't have child commands`);
        else if(!command.children.includes(subName)) {
            const childrenList = command.children.join(", ");
            console.log(`Child command ${subName} not found for ${name}. Allowed next list: ${childrenList}`);
        } else {
            this.#loadSubCommand(rootPath, name, subName)
                .then((subCommand) => this.#runCommand(subCommand))
                .catch(({ e, path }) => {
                    console.log(`Child command of ${name} declaration but not exist on path ${path}`);
                    console.log(e);
                });
        }
    }

    #loadSubCommand(rootPath, name, subName) {
        const path = `${rootPath}/${name}/commands/${subName}/index.js`;
        return new Promise((resolve, reject) => {
            import(path).then((module) => resolve(module.default))
                .catch(e => reject({ e, path }));
        })
    }

    #runCommand(Command) {
        const command = new Command();
        command.initDefault();
        const isValid = command.validate();
        if(isValid === true || !isValid.error) command.run();
        else console.log(isValid.error.details[0].message);
    }

    #initArguments(command, subCommand, args, options, params) {
        this.arguments = { command, subCommand, args, options, params };
    }
}

export default new CliCommandsRouter();