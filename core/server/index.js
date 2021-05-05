import http from "http";
import Request from "core-request";
import Response from "core-response";

class Server {
    #isReady = false;
    #instance;
    #readyHandlers = [];

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
        this.#isReady ? handler() : this.#readyHandlers.push(handler);
    }

    async #handler(req, res) {
        const request = new Request(req, this.url);
        const response = new Response(res);
        const body = await request.body;
        console.log(body);
        res.setHeader('Content-Type', "application/json");
        res.end(JSON.stringify([ body ]));
    }

    async #init() {
        console.log(`Server running at: ${this.url},\n${new Date()}`);
        this.#readyHandlers.forEach((handler) => handler());
        this.#readyHandlers = [];
    }
}

export default Server;