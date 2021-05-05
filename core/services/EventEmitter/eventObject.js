import generator from "core-helpers/generator";

class EventObject {
    #events = {};

    on(eventName, handler, handlerName = false) {
        const name = handlerName || generator.genKey(`event_${event}`);
        if(!this.#events.hasOwnProperty(eventName)) this.#events[eventName] = {};
        if(!this.#events[name].hasOwnProperty(name)) this.#events[eventName][name] = [];
        this.#events[eventName][name].push(handler);
        return handlerName;
    }
}

export default EventObject;