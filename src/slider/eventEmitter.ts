import {IModelState} from './interfaces/iModelState';

interface IData {
    currentValue: number
    index: number
}
type CallbackFunctionVariadic = (...args: any[]) => void;
interface StringArray {
    [index: string]: CallbackFunctionVariadic[];
}
export class EventEmitter {
    private handlersByEvent: StringArray;

    constructor() {
        this.handlersByEvent = {}
    }
    public subscribe(eventName: string, fn: CallbackFunctionVariadic): () => void {
        if(!this.handlersByEvent[eventName]) {
            this.handlersByEvent[eventName] = [];
        }

        this.handlersByEvent[eventName].push(fn);
        return (): void => {
            this.handlersByEvent[eventName] = this.handlersByEvent[eventName].filter(eventFn => fn !== eventFn);
        }
    }
    public emit(eventName: string, data: IModelState | IData | number[]): void {
        const handlers: CallbackFunctionVariadic[] = this.handlersByEvent[eventName];
        if(handlers) {
            handlers.forEach(fn => { fn.call(null, data) } );
        }
    }
}