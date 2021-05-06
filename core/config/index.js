import { deepSearch, isObject } from "core-helpers";

class Config {
    #list = {}

    read(path) {
        path = path.split(".");
        const name = path[0];
        path.splice(0, 1);
        if(this.#list.hasOwnProperty(name)) {
            const config = this.#list[name],
                configData = path.length ? deepSearch(path.join("."), config.data) : config.data;
            if(config.updatable) return configData;
            return configData ? JSON.parse(JSON.stringify(configData)) : configData;
        } return undefined;
    }

    add(name, data, updatable = false, canMerge = true) {
        if(this.#list.hasOwnProperty(name)) throw new Error(`Try add config with existing name: "${name}`);
        this.#list[name] = { updatable, data, canMerge };
    }

    merge(name, data, updatable = false, canMerge = false) {
        if(this.#list.hasOwnProperty(name)) {
            if(!this.#list[name].canMerge) throw new Error(`Can't merge config: "${name}"`);
            const existingData = this.#list[name].data,
                newData = isObject(existingData) || Array.isArray(existingData) ? { ...existingData, data } : data;
            this.#list[name] = {
                updatable,
                canMerge,
                data: newData
            }
        } else this.add(name, data, updatable, canMerge);
    };
}

export default new Config();