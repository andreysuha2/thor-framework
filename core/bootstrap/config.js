import config from "core-config";
import statusCodes from "core-config/server/statusCodes";
import database from "root-config/database";

export default async function () {
    try {
        config.add("statusCodes", statusCodes);
        config.add("database", database);
        return true;
    } catch (e) {
        return e;
    }
}