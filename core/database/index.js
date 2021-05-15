import config from "core-config";
import SequelizeDB from "./Sequelize";
import MongoDB from "./Mongo";

class Database {
    #credentials = {
        sql: null,
        mongo: null
    };
    #configs = {
        mongo: null,
        sql: null
    }
    mongo;
    sql;

    constructor() {
        const sqlConfig = config.read("database.sql"),
            mongoConfig = config.read("database.mongo");
        if(sqlConfig.used) {
            this.#credentials.sql = sqlConfig.credentials;
            this.#configs.sql = sqlConfig.config;
            this.sql = new SequelizeDB(this.#credentials.sql, this.#configs.sql);
        } else this.sql = null;
        if(mongoConfig.used) {
            this.#credentials.mongo = mongoConfig.credentials;
            this.#configs.mongo = mongoConfig.config;
            this.mongo = new MongoDB(this.#credentials.mongo, this.#configs.mongo);
        } else this.mongo = null;
    }

    get initDatabases() {
        return [ this.sql, this.mongo ].filter(db => db);
    }

    connect() {
        return Promise.all(this.initDatabases.map(db => db.connect()))
            .then(() => console.log("Databases ready"))
            .catch(e => console.log(e));
    }
}

export default Database;