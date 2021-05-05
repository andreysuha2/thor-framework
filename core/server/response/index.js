class Response {
    #response;

    constructor(response) {
        this.#response = response;
    }

    setHeader(name, value) {
        this.#response.setHeader(name, value);
    }

    useOrigin(handler) {
        handler(this.#response);
    }
}

export default Response;