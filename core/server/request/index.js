class Request {
    #request;
    #origin;
    #url;

    constructor(request, origin) {
        this.#request = request;
        this.#origin = origin;
        this.#url = new URL(this.#request.url, origin);
    }

    get method() {
        return this.#request.method;
    }

    get path() {
        return this.#url.pathname;
    }

    get origin() {
        return this.#origin;
    }

    get url() {
        return this.#url;
    }

    get query() {
        const params = {};
        this.#url.searchParams.forEach((key, value) => params[key] = value);
        return params;
    }

    get headers() {
        return this.#request.headers;
    }

    get body() {
        const body = [];
        return new Promise((resolve) => {
            this.on('data', chunk => { body.push(chunk) })
                .on('end', () => resolve(Buffer.concat(body).toString()));
        });
    }

    on(name, handler) {
        return this.#request.on(name, handler);
    }

    onError(handler) {
        return this.on("error", handler);
    }

    useOrigin(handler) {
        return handler(this.#request);
    }
}

export default Request;