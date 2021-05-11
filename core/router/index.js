class Router {
    #routes = [];

    async handleRequest(request, response) {
       const route = this.#getRoute(request.method, request.path);
       if(!route) {
           let error = [ "Not found", "notFound" ];
           if(this.#hasPath(request.path)) error = [ "Method not allowed", "methodNotAllowed" ];
           response.error(...error);
       }
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

    #hasRoute(method, path) {
        return this.#routes.some(route => route.is(method, path));
    }

    #hasPath(path) {
        return this.#routes.some(route => route.isPath(path));
    }

    #getRoute(method, path) {
        return this.#routes.find(route => route.is(method, path));
    }
}

export default Router;