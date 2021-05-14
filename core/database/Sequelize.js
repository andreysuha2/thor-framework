import { Sequelize } from "sequelize"

class SequelizeDB  {
    instance;

    constructor({ host, name, user, password, dialect }, config = {}) {
        this.instance = new Sequelize(name, user, password, { host, dialect, ...config });
    }

    connect() {
        return new Promise((resolve, reject) => {
            this.instance.authenticate()
                .then(() => {
                    console.log("Sequelize connected!");
                    resolve();
                }).catch((e) => {
                    console.log("Sequelize connection error!");
                    reject(e);
                });
        });
    }
}

export default SequelizeDB;