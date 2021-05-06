import Server from "core-server";

class App {
    #server;

    async init() {
        this.#server = await this.#initServer();
        this.#server.onEvent("request", ({ response }) => {
            try {
                response.send({ test: "test" });
            } catch (e) {
                console.log(e);
                response.error("Something went wrong!")
            }
        });
    }

    #initServer() {
        return new Promise((resolve) => {
            const server = new Server(
                process.env.SERVER_PROTOCOL,
                process.env.SERVER_HOST,
                process.env.SERVER_PORT
            );
            server.onReady(() => resolve(server));
        });
    }
}

export default App;