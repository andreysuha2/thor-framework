import initConfig from "./config";

class Bootstrap {
    load() {
        return new Promise((resolve, reject) => {
            initConfig()
                .then(() => resolve())
                .catch((e) => reject(e));
        });
    }
}

export default new Bootstrap();