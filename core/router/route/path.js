class RoutePath {
    #origin;
    #dynamicRegExp = new RegExp("^\{.*\}$");

    constructor(path) {
        this.#origin = this.#catDashes(path);
    }

    get #path() {
        return this.#origin.split("/")
            .map(item => {
                const dynamic = this.#dynamicRegExp.test(item);
                return  {
                    dynamic,
                    alias: dynamic ? item.substr(1, item.length - 2) : item
                };
            });
    }

    get isDynamic() {
        return this.#path.some(item => item.dynamic);
    }

    getDynamicValues(path) {
        if(!this.compare(path)) throw `"${path}" is no same as "${this.#origin}"`;
        return this.#catDashes(path).split("/")
            .reduce((list, item, i) => {
                if(this.#path[i].dynamic) list.push({ alias: this.#path[i].alias, value: item });
                return list;
            }, []);
    }

    compare(path) {
        path = this.#catDashes(path).split("/");
        if(path.length !== this.#path.length) return false;
        return path.every((item, i) => {
            return this.#path[i].dynamic || item === this.#path[i].alias;
        });
    }

    #catDashes(path) {
        if(path[0] === "/") path = path.substr(1, path.length);
        if(path[path.length - 1] === "/") path = path.substr(0, path.length - 1);
        return path;
    }
}

export default RoutePath;