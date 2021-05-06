class Router {
    #routes = [];

    async handleRequest(request, response) {
       const route = this.#getRoute(request.method, request.path);
       if(!route) response.error("Not found", "notFound");
       else await route.handle(request, response);
    }

    addRoute(method, path, route) {
        if(this.#hasRoute(method, path)) throw `Route: "${method}:${path}", already registered!`;
        this.#routes.push(route);
    }

    groupMiddlewares(group, middlewares) {
        const routes = this.#routes.filter(route => route.isGroup(group));
        routes.forEach(route => route.middlewares(middlewares));
    }

    groupValidators(group, validators) {
        const routes = this.#routes.filter(route => route.isGroup(group));
        routes.forEach(route => route.validators(validators));
    }

    #hasRoute(method, path) {
        return this.#routes.some(route => route.is(method, path));
    }

    #getRoute(method, path) {
        return this.#routes.find(route => route.is(method, path));
    }
}

export default Router;