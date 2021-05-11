class Controllers {
    #controllers = {};

    add(path, dynamic = true) {
        if(dynamic !== false) dynamic = true;
        const exist = this.#controllers[path];
        if(!this.#controllers.hasOwnProperty(path)) {
            this.#loadController(path).then((Controller) => {
                const controller = dynamic ? null : new Controller();
                this.#controllers[path] = { Controller, dynamic, controller };
            }).catch(e => console.log(e));
        } else if(!exist.dynamic && dynamic) {
            exist.controller = new exist.Controller();
        }
    }

    get(path) {
        if(this.#controllers.hasOwnProperty(path)) return this.#controllers[path];
        return null;
    }

    #loadController(path) {
        return new Promise(async (resolve, reject) => {
            try {
                const controller = await import(`root-controllers/${path}.js`);
                resolve(controller.default);
            } catch (e) {
                reject(e);
            }
        });
    }
}


export default new Controllers();