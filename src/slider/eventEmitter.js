import {Controller} from './controller.js';

export class EventEmitter {
    constructor() {
        this.handlersByEvent = {};
    }
    emit(eventName, data) {
        const handlers = this.handlersByEvent[eventName];
        if(handlers) {
            handlers.forEach(fn => {
                fn.call(null, data);
            });
        }
    }
    subscribe(eventName, fn) {
        if(!this.handlersByEvent[eventName]) {
            this.handlersByEvent[eventName] = [];
        }

        this.handlersByEvent[eventName].push(fn);
        return () => {
            this.handlersByEvent[eventName] = this.handlersByEvent[eventName].filter(eventFn => fn !== eventFn);
        }
    }
}