import initConfig from "./config";
import Server from "core-server";

class Bootstrap {
    load() {
        return new Promise((resolve, reject) => {
            initConfig()
                .then(() => this.#initServer())
                .then(() => resolve())
                .catch((e) => reject(e));
        });
    }

    #initServer() {
        return new Promise((resolve) => {
            new Server(
                process.env.SERVER_PROTOCOL,
                process.env.SERVER_HOST,
                process.env.SERVER_PORT
            ).onReady(() => resolve())
        });
    }
}

export default new Bootstrap();