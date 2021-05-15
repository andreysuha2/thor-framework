import { env } from "core-helpers";

export default {
    sql: {
        used: true,
        credentials: {
            host: env("SQL_DB_HOST", "localhost"),
            name: env("SQL_DB_NAME", null),
            user: env("SQL_DB_USER", "root"),
            password: env("SQL_DB_PASSWORD", ""),
            dialect: env("SQL_DB_DIALECT", "mysql")
        },
        config: {
            logging: false
        }
    },
    mongo: {
        used: true,
        credentials: {
            host: env("MONGO_DB_HOST", "localhost"),
            port: env("MONGO_DB_PORT", 27017),
            name: env("MONGO_DB_NAME", "thor_db")
        },
        config: {
            useFindAndModify: false,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        }
    }
};