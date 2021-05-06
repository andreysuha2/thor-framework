import RoutePath from "./path";
import { camelizeObject } from "core-helpers";

class Route {
    #path;
    #handler;
    #method;
    #middlewares = [];
    #validators = [];
    #group;

    constructor(method, path, handler, group = "default", middlewares = [], validators = []) {
        this.#path = new RoutePath(path);
        this.#handler = handler;
        this.#method = method.toUpperCase();
        this.#middlewares.push(...middlewares);
        this.#validators.push(...validators);
        this.#group = group;
    }

    async handle(request, response) {
        const body = await request.body,
            params = this.#path.isDynamic ? this.#getDynamicParams(request.path): null;
        this.#handler({ params, data: body, response, request });
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
        this.#middlewares.push(...middlewares);
        return this;
    }

    validators(validators) {
        this.#validators.push(...validators);
        return this;
    }

    #getDynamicParams(path) {
        const params = this.#path.getParams(path).map(({ alias, value }) => ([ alias, value ]));
        return camelizeObject(Object.fromEntries(params));
    }
}

export default Route;