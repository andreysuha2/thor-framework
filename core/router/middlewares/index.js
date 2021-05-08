import MiddlewareAbstract from "./middleware";
import eventEmitter from "core-services/EventEmitter";
import MiddlewaresHandler from "./handler";

class Middlewares {
    #middlewares = [];

    constructor(middlewares) {
        this.addList(middlewares).catch(e => console.log(e));
    }

    handler(request, response, params) {
        return new MiddlewaresHandler(request, response, this.#middlewares, params);
    }

    addList(middlewaresList) {
        return Promise.all(middlewaresList.map(async middleware => this.addMiddleware(middleware)));
    }

    addMiddleware(middlewareData) {
        return new Promise((resolve, reject) => {
            let [ path, params ] = middlewareData.split(":");
            params = params ? params.split(",").map(param => param.trim()) : [];
            import(`root-middlewares/${path}.js`)
                .then((middleware) => {
                    const middlewareData = [ middleware.default, params ];
                    this.#middlewares.push(middlewareData);
                    resolve(middlewareData);
                })
                .catch((e) => reject(e));
        });
    }
}

export default Middlewares;