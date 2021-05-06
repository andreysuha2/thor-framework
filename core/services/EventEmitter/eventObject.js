import generator from "core-helpers/generator";
import { isObjectEmpty } from "core-helpers";

class EventObject {
    #events = {};
    #name;

    constructor(name) {
        this.#name = name;
    }

    get hasEvents() {
        return isObjectEmpty(this.#events);
    }

    on(eventName, handler, handlerName = null) {
        const name = handlerName || generator.genKey(`${this.#name}_event_${eventName}_handler`);
        if(!this.#events.hasOwnProperty(eventName)) this.#events[eventName] = {};
        if(!this.#events[eventName].hasOwnProperty(name)) this.#events[eventName][name] = [];
        this.#events[eventName][name].push(handler);
        return handlerName;
    }

    emit(eventName, data={}, handlerName = null) {
        if(this.#events.hasOwnProperty(eventName)) {
            let handlersList = this.#events[eventName],
                handlers = null;
            if(!handlerName) {
                handlers = Object.values(handlersList).reduce((list, handlers) => {
                    list.push(...handlers);
                    return list;
                }, []);
            } else handlers = handlersList[handlerName];
            handlers.forEach((handler) => handler(data));
        }
    }

    off(eventName, handlerName = null) {
        if(this.#events.hasOwnProperty(eventName)) {
            if(!handlerName) delete this.#events[eventName];
            else {
                if(this.#events[eventName].hasOwnProperty(handlerName)) delete this.#events[eventName][handlerName];
                if(isObjectEmpty(this.#events[eventName])) delete this.#events[eventName];
            }
        }
    }
}

export default EventObject;