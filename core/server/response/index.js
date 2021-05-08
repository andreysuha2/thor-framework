import config from "core-config";
import { isObject } from "core-helpers";
import eventEmitter from "core-services/EventEmitter";

class Response {
    #response;
    #statusCodes = config.read("statusCodes");
    #finished = false;
    #isStarted = false;
    #eventObjectName = "response";

    constructor(response) {
        this.#response = response;
        this.#response.on("finish", () => {
            this.#finished = true;
            this.emit("finished");
        });
    }

    get #started() {
        return this.#isStarted;
    }

    set #started(value) {
        this.#isStarted = Boolean(value);
        if(this.#isStarted) this.emit("startSending");
    }

    once(event, handler, handlerName = null) {
        return eventEmitter.once(this.#eventObjectName, event, handler, handlerName);
    }

    on(event, handler, handlerName = null) {
        return eventEmitter.on(this.#eventObjectName, event, handler, handlerName);
    }

    emit(event, data = {}, handlerName = null) {
        eventEmitter.emit(this.#eventObjectName, event, data, handlerName);
    }

    off(event, handlerName = null) {
        eventEmitter.off(this.#eventObjectName, event, handlerName);
    }

    setStatus(code, message = null) {
        if(!message) {
            if(this.#statusCodes.hasOwnProperty(code)) {
                const status = this.#statusCodes[code];
                this.#response.statusCode = status.code || 200;
                this.#response.statusMessage = status.message || "ok";
            } else this.#response.statusCode = code;
        } else {
            this.#response.statusCode = code;
            this.#response.statusMessage = message;
        }
    }

    setHeader(name, value) {
        this.#response.setHeader(name, value);
    }

    json(data, statusCode = "success", statusMessage = null) {
        this.setHeader("Content-Type", "application/json")
        this.setStatus(statusCode, statusMessage);
        this.end(JSON.stringify(data));
    }

    write(message, statusCode = "success", statusMessage = null) {
        this.#started = true;
        this.setStatus(statusCode, statusMessage);
        this.#response.write(message);
    }

    error(message = "Something went wrong!", statusCode = "internalServerError", statusMessage = null) {
        this.setStatus(statusCode, statusMessage);
        this.send(message, statusCode, statusMessage);
    }

    send(data, statusCode = "success", statusMessage = null) {
        if(isObject(data) || Array.isArray(data)) {
            this.setHeader("Content-Type", "application/json");
            data = JSON.stringify(data);
        } else this.setHeader("Content-Type", "text/html");
        this.setStatus(statusCode, statusMessage);
        this.end(data);
    }

    end() {
        this.#started = true;
        this.#response.end(...arguments);
    }

    useOrigin(handler) {
        handler(this.#response);
    }
}

export default Response;