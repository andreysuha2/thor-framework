import RoutePath from "./path";
import { camelizeObject } from "core-helpers";
import Middlewares from "core-middlewares";
import RouteHandler from "./handler";

class Route {
    #path;
    #handler;
    #method;
    #middlewares;
    #requestPreHandler;
    #group;

    constructor(method, path, handler, group = "default", middlewares = [], requestPreHandler = null) {
        this.#path = new RoutePath(path);
        this.#handler = handler;
        this.#method = method.toUpperCase();
        this.#middlewares = new Middlewares(middlewares);
        this.#requestPreHandler = requestPreHandler;
        this.#group = group;
    }

    async handle(request, response) {
        const handler = new RouteHandler(request, response, this.#path, this.#handler, this.#middlewares, this.#requestPreHandler);
        await handler.handle();
    }

    is(method, path) {
        return this.isPath(path) && this.isMethod(method);
    }

    isGroup(group) {
        return this.#group === group;
    }

    isPath(path) {
        return this.#path.compare(path);
    }

    isMethod(method) {
        return this.#method === method.toUpperCase();
    }

    middlewares(middlewares) {
        this.#middlewares.addList(middlewares).catch((e) => console.log(e));
        return this;
    }

    middleware(middleware) {
        this.#middlewares.addMiddleware(middleware).catch((e) => console.log(e));
        return this;
    }

    async request(request) {
        const [ path, params ] = request.split(":"),
            [ code = null, text = null ] = params ? params.split(",") : [],
            handler = await import(`root-requests/${path}.js`);
        this.#requestPreHandler = { handler: handler.default, code, text };
        return this;
    }

    #getDynamicParams(path) {
        const params = this.#path.getParams(path).map(({ alias, value }) => ([ alias, value ]));
        return camelizeObject(Object.fromEntries(params));
    }
}

export default Route;