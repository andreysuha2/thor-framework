import { camelizeObject } from "core-helpers";

class RouteHandler {
    #response;
    #request;
    #path;
    #middlewares;
    #preHandler;
    #handler;
    #params = null;
    #data = null;

    constructor(request, response, path, handler, middlewares = [], preHandler = null) {
        this.#request = request;
        this.#response = response;
        this.#path = path;
        this.#handler = handler;
        this.#middlewares = middlewares;
        this.#preHandler = preHandler;
    }

    async handle() {
        this.#data = await this.#request.body;
        this.#params = await this.#path.isDynamic ? this.#getDynamicParams(this.#request.path): null;
        this.#middlewaresHandle()
            .then(() => this.#handlePath())
            .then(() => this.#preHandle())
            .then(() => this.#handler({
                params: this.#params,
                query: this.#request.query,
                data: this.#data,
                response: this.#response,
                request: this.#request
            })).catch((e) => console.log(e));
    }

    #middlewaresHandle() {
        return new Promise((resolve, reject) => {
            this.#middlewares.handler(this.#request, this.#response, this.#params)
                .onFinished(() => resolve())
                .onStopped(() => reject("Middleware stopped"))
                .handle();
        });
    }

    #preHandle() {
        return new Promise((resolve, reject) => {
            if(this.#preHandler) {
                const { handler: Handler, code, text } = this.#preHandler;
                const preHandler = new Handler(this.#params, this.#data, this.#request, this.#response, code, text);
                preHandler.handle()
                    .then(() => resolve())
                    .catch((e) => reject(e))

            } else resolve();
        });
    }

    #getDynamicParams(path) {
        const params = this.#path.getParams(path).map(({ alias, value }) => ([ alias, value ]));
        return camelizeObject(Object.fromEntries(params));
    }

    #handlePath(params) {
        return true;
    }
}

export default RouteHandler;