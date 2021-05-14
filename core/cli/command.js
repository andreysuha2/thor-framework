import router from "core-cli/router.js";

class Command {
    name = router.arguments.command;
    args = router.arguments.args;
    options = router.arguments.options;
    originParams = router.arguments.params;
    default = {
        child: null,
        args: {}
    }
    validateObject = null;
    validateConfig = null;

    run() {
        console.log(`Command ${this.name} running`);
    }

    isArg(name) {
        return this.args.hasOwnProperty(name);
    }

    isOption(name) {
        return this.options.includes(name);
    }

    initDefault() {
        if (this.default.args) this.args = { ...this.default.args, ...this.args };
    }

    validate() {
        if(this.hasOwnProperty("schema")) {
            return this.schema.validate(
                this.validateObject || { args: this.args, options: this.options },
                this.validateConfig || {}
                );
        }
        return true;
    }
}

export default Command;