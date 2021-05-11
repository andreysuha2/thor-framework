import Route from "./route";
import generator from "core-helpers/generator";
import { pathCatSlashes, isObject } from "core-helpers";
import controllers from "core-controllers";

class RouteRegister {
    #path;
    #middlewares = [];
    #request;
    #group;
    #router;

    constructor(router, path = "", middlewares = [], request = null, group = "default") {
        this.#path = pathCatSlashes(path);
        this.#middlewares = middlewares;
        this.#request = request;
        this.#group = group;
        this.#router = router;
    }

    request(method, path, handler, { middlewares = [], request = null } = {}) {
        return this.#register(method, path, handler, middlewares, request);
    }

    get(path, handler, { middlewares = [], request = null } = {}) {
        return this.request("GET", path, handler, { middlewares, request });
    }

    post(path, handler, { middlewares = [], request = null } = {}) {
        return this.request("POST", path, handler, { middlewares, request });
    }

    put(path, handler, { middlewares = [], request = null } = {}) {
        return this.request("PUT", path, handler,{ middlewares, request });
    }

    delete(path, handler, { middlewares = [], request = null } = {}) {
        return this.request("DELETE", path, handler, { middlewares, request });
    }

    group({ path = "", middlewares = [] } = {}, handler) {
        const [groupName, group] = this.#createGroup();
        const r = new RouteRegister(
            this.#router,
            path, [...this.#middlewares, ...middlewares],
            null,
            groupName
        );
        handler(r);
        return group;
    }


    #createGroup() {
        const groupName = generator.genKey("ROUTE_GROUP"),
            router = this.#router,
            group = {
                middlewares(middlewares = []) {
                    router.groupMiddlewares(groupName, middlewares);
                    return group;
                },
                middleware(middleware) {
                    router.groupMiddlewares(groupName, [ middleware ]);
                    return group;
                }
            };
        return [ groupName, group ];
    }

    #register(method, path, handler, middlewares = [], request = null) {
        if(isObject(handler)) {
            const [ path ] = handler.use.split("@");
            controllers.add(path, handler.dynamic);
        }
        const fullPath = `${this.#path}/${pathCatSlashes(path)}`;
        const route = new Route(
            method,
            fullPath,
            handler,
            this.#group,
            [ ...this.#middlewares, ...middlewares ],
            request);
        this.#router.addRoute(method, fullPath, route);
        return route;
    }
}

export default RouteRegister;