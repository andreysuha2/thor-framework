import http from "http";
import Request from "core-request";

class Server {
    constructor(protocol, host, port) {
        Object.defineProperties(this, {
            protocol: { value: protocol },
            host: { value: protocol },
            port: { value: port },
            url: { value: `${protocol}${host}:${port}` },
            instance: { value: http.createServer(this.#handler.bind(this)) }
        });

        this.instance.listen(port, host, this.#init.bind(this));
    }

    async #handler(req, res) {
        const request = new Request(req, this.url);
        const body = await request.body;
        console.log(body);
        res.setHeader('Content-Type', "application/json");
        res.end(JSON.stringify([ body ]));
    }

    async #init() {
        const time = new Date();
        console.log(`Server runing at: ${this.url},\n${time}`);
    }
}

export default Server;