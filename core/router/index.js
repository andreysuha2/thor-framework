class Router {
    #routes = {};

    handleRequest() {}

    addRoute(method, path, route) {
        if(this.#routes.hasOwnProperty(method) && this.#routes[method].hasOwnProperty(path)) throw `Path ${path} already registred`
    }
}

export default new Router();