import config from "core-config";
import statusCodes from "core-config/server/statusCodes";

export default async function () {
    try {
        config.add("statusCodes", statusCodes);
        return true;
    } catch (e) {
        return e;
    }
}