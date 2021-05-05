import http from "http";

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

    async #handler(req, res) {}

    async #init() {
        const time = new Date();
        console.log(`Server runing at: ${this.url},\n${time}`);
    }
}

export default Server;