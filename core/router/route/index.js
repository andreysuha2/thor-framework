import RoutePath from "./path";

class Route {
    #path;
    #handler;

    constructor(path, handler) {
        this.#path = new RoutePath(path);
        this.#handler = handler;
    }

    is(path) {
        return this.#path.compare(path);
    }
}

export default Route;