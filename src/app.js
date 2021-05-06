import Server from "core-server";
import RouteParh from "core-router/route/path";

class App {
    #server;

    async init() {
        this.#server = await this.#initServer();
        this.#server.onEvent("request", async ({ response, request }) => {
            try {
                const { data } = await request.body;
                const path = new RouteParh(data.path);
                response.send(path);
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