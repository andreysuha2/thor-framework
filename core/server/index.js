import http from "http";
import Request from "core-request";
import Response from "core-response";
import eventEmitter from "core-services/EventEmitter";

class Server {
    #isReady = false;
    #instance;
    #eventObjectName = "server";

    constructor(protocol, host, port) {
        Object.defineProperties(this, {
            protocol: { value: protocol },
            host: { value: protocol },
            port: { value: port },
            url: { value: `${protocol}${host}:${port}` },
        });

        this.#instance = http.createServer(this.#handler.bind(this));
        this.#instance.listen(port, host, this.#init.bind(this));
    }

    onReady(handler) {
        this.#isReady ? handler() : this.onEvent("ready", handler);
    }

    onEvent(eventName, handler, handlerName = null) {
        eventEmitter.on(this.#eventObjectName, eventName, handler, handlerName);
    }

    emitEvent(eventName, data = {}, handlerName = null) {
        eventEmitter.emit(this.#eventObjectName, eventName, data, handlerName);
    }

    offEvent(eventName, handlerName = null) {
        eventEmitter.off(this.#eventObjectName, eventName, handlerName);
    }

    async #handler(req, res) {
        const request = new Request(req, this.url);
        const response = new Response(res);
        this.emitEvent("request", { request, response });
    }

    async #init() {
        console.log(`Server running at: ${this.url}`);
        this.emitEvent("ready");
        this.offEvent("ready");
    }
}

export default Server;