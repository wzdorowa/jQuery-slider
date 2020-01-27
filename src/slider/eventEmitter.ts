interface StringArray {
    [index: string]: Function[];
}
export class EventEmitter {
    handlersByEvent: StringArray;

    constructor() {
        this.handlersByEvent = {}
    }
    subscribe(eventName: string, fn: Function): Function {
        if(!this.handlersByEvent[eventName]) {
            this.handlersByEvent[eventName] = [];
        }

        this.handlersByEvent[eventName].push(fn);
        return (): void => {
            this.handlersByEvent[eventName] = this.handlersByEvent[eventName].filter(eventFn => fn !== eventFn);
        }
    }
    emit(eventName: string, data: object) {
        const handlers: Function[] = this.handlersByEvent[eventName];
        if(handlers) {
            handlers.forEach(fn => { fn.call(null, data) } );
        }
    }
    
}