import mongoose from "mongoose";

class MongoDB {
    #connectData = {
        host: null,
        config: {}
    }
    instance;

    constructor({ host, port, name }, config = {}) {
        this.#connectData.host = `mongodb://${host}:${port}/${name}`;
        this.#connectData.config = config;
        this.instance = new mongoose.Mongoose();
    }

    connect() {
        return new Promise((resolve, reject) => {
            this.instance.connect(this.#connectData.host, this.#connectData.config)
                .then(() => {
                    console.log("Mongo connected!");
                    resolve();
                }).catch(e => {
                    console.log("Mongo connection error!");
                    reject(e);
                })
        });
    }
}

export default MongoDB;