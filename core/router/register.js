import Route from "./route";
import generator from "core-helpers/generator";
import { pathCatSlashes } from "core-helpers";

class RouteRegister {
    #path;
    #middlewares = [];
    #validators = [];
    #group;
    #router;

    constructor(router, path = "", middlewares = [], validators = [], group = "default") {
        this.#path = pathCatSlashes(path);
        this.#middlewares = middlewares;
        this.#validators = validators;
        this.#group = group;
        this.#router = router;
    }

    request(method, path, handler, { middlewares = [], validators = [] } = {}) {
        return this.#register(method, path, handler, middlewares, validators);
    }

    get(path, handler, { middlewares = [], validators = [] } = {}) {
        return this.request("GET", path, handler, { middlewares, validators });
    }

    post(path, handler, { middlewares = [], validators = [] } = {}) {
        return this.request("POST", path, handler, { middlewares, validators });
    }

    put(path, handler, { middlewares = [], validators = [] } = {}) {
        return this.request("PUT", path, handler,{ middlewares, validators });
    }

    delete(path, handler, { middlewares = [], validators = [] } = {}) {
        return this.request("DELETE", path, handler, { middlewares, validators });
    }

    group({ path = "", middlewares = [], validators = [] } = {}, handler) {
        const [groupName, group] = this.#createGroup();
        const r = new RouteRegister(
            this.#router,
            path, [...this.#middlewares, ...middlewares],
            [...this.#validators, ...validators],
            groupName
        );
        handler(r);
        return group;
    }


    #createGroup() {
        const groupName = generator.genKey("ROUTE_GROUP"),
            group = {
                middlewares(middlewares = []) {
                    router.groupMiddlewares(groupName, middlewares);
                    return group;
                },
                validators(validators = []) {
                    router.groupValidators(groupName, validators);
                    return group
                }
            };
        return [ groupName, group ];
    }

    #register(method, path, handler, middlewares = [], validators = []) {
        const fullPath = `${this.#path}/${pathCatSlashes(path)}`;
        const route = new Route(
            method,
            fullPath,
            handler,
            this.#group,
            [ ...this.#middlewares, ...middlewares ],
            [ ...validators, this.#validators ]);
        this.#router.addRoute(method, fullPath, route);
        return route;
    }
}

export default RouteRegister;