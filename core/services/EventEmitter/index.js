import EventObject from "./eventObject";

class EventEmitter {
    #list = {};

    once(eventObject, event, handler, handlerName = null) {
        handlerName = this.on(eventObject, event, (data) => {
            handler(data);
            this.off(eventObject, event, handlerName);
        }, handlerName);
        return handlerName;
    }

    on(eventObject, event, handler, handlerName = null) {
        if(!this.#list.hasOwnProperty(eventObject)) this.#list[eventObject] = new EventObject(eventObject);
        return this.#list[eventObject].on(event, handler, handlerName);
    }

    emit(eventObject, event, data={}, handlerName = null) {
        if(this.#list.hasOwnProperty(eventObject)) this.#list[eventObject].emit(event, data, handlerName);
    }

    off(eventObject, event, handlerName = null) {
        if(this.#list.hasOwnProperty(eventObject)) {
            this.#list[eventObject].off(event, handlerName);
            if(!this.#list[eventObject].hasEvents) delete this.#list[eventObject];
        }
    }
}

const eventEmitter = new EventEmitter();

export default eventEmitter;