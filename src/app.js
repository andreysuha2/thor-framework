import Server from "core-server";
import Router from "core-router";
import Database from "core-db";
import RouteRegister from "core-router/register";
import webRoutes from "root-routes/web";

class App {
    #server;
    #router;
    #database;

    async init() {
        this.#database = await this.#initDatabase();
        this.#server = await this.#initServer();
        this.#router = new Router();
        this.#server.onEvent("request", this.#onRequest.bind(this));
        webRoutes(new RouteRegister(this.#router));
    }

    async #onRequest({ request, response }) {
        try {
            await this.#router.handleRequest(request, response);
        } catch (e) {
            console.log(e);
            response.error("Something went wrong!");
        }
    }

    #initDatabase() {
        return new Promise((resolve, reject) => {
            const database = new Database();
            database.connect()
                .then(() => resolve(database))
                .catch((e) => reject(e));
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