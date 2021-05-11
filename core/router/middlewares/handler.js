import eventEmitter from "core-services/EventEmitter";
import generator from "core-helpers/generator";

class MiddlewaresHandler {
    #request;
    #response;
    #middlewares;
    #current = 0;
    #routeParams;
    #stopped = false;
    #eventObjectName = "middlewareHandler";
    #onResponseHandlerName;

    constructor(request, response, middlewares, routeParams) {
        this.#request = request;
        this.#response = response;
        this.#middlewares = middlewares;
        this.#routeParams = routeParams;
        this.#onResponseHandlerName = this.#handledStopped();
        this.#eventObjectName = generator.genKey(this.#eventObjectName);
    }

    get #currentMiddleware() {
        return this.#middlewares[this.#current] || null;
    }

    handle() {
        if(this.#currentMiddleware && !this.#stopped) this.#runMiddleware(this.#currentMiddleware);
        else if(!this.#stopped) {
            eventEmitter.emit(this.#eventObjectName, "finished");
            this.#response.off("startSending", this.#onResponseHandlerName);
        }
    }

    onFinished(handler) {
        eventEmitter.once(this.#eventObjectName, "finished", (data) => {
            eventEmitter.off(this.#eventObjectName, "stopped");
            handler(data)
        });
        return this;
    }

    onStopped(handler) {
        eventEmitter.once(this.#eventObjectName, "stopped", (data) => {
            eventEmitter.off(this.#eventObjectName, "finished");
            handler(data);
        });
        return this;
    }

    #runMiddleware([ Middleware, params ]) {
        const middleware = new Middleware(params, this.#routeParams);
        middleware.handle(() => this.#next(), { response: this.#response, request: this.#request });
    }

    #next() {
        this.#current++;
        this.handle();
    }

    #handledStopped() {
        this.#response.once(
            "startSending", () => {
                eventEmitter.emit(this.#eventObjectName, "stopped");
                this.#stopped = true;
            }
        );
    }
}

export default MiddlewaresHandler;