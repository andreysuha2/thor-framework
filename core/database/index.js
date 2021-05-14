import SequelizeDB from "./Sequelize";
import MongoDB from "./Mongo";

class Database {
    #credentials = {
        sql: {
            host: process.env.SQL_DB_HOST,
            name: process.env.SQL_DB_NAME,
            user: process.env.SQL_DB_USER,
            password: process.env.SQL_DB_PASSWORD,
            dialect: process.env.SQL_BD_DIALECT
        },
        mongo: {
            host: process.env.MONGO_DB_HOST,
            port: process.env.MONGO_DB_PORT,
            name: process.env.MONGO_DB_NAME
        }
    };
    #configs = {
        mongo: {
            useFindAndModify: false,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        },
        sql: {
            logging: false
        }
    }
    mongo;
    sql;

    constructor() {
        this.mongo = new MongoDB(this.#credentials.mongo, this.#configs.mongo);
        this.sql = new SequelizeDB(this.#credentials.sql, this.#configs.sql);
    }

    connect() {
        return Promise.all([
            this.sql.connect(),
            this.mongo.connect()
        ]).then(() => console.log("Databases ready"))
            .catch(e => console.log(e));
    }
}

export default Database;