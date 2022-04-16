import { IModelState } from './interfaces/iModelState';
import { IThumbData } from './interfaces/IThumbData';

type CallbackFunctionVariadic = (...args: any[]) => void;
interface StringArray {
  [index: string]: CallbackFunctionVariadic[];
}
class EventEmitter {
  public handlersByEvent: StringArray;

  constructor() {
    this.handlersByEvent = {};
  }

  public makeSubscribe(
    eventName: string,
    fn: CallbackFunctionVariadic,
  ): () => void {
    if (!this.handlersByEvent[eventName]) {
      this.handlersByEvent[eventName] = [];
    }

    this.handlersByEvent[eventName].push(fn);
    return (): void => {
      this.handlersByEvent[eventName] = this.handlersByEvent[eventName].filter(
        eventFn => fn !== eventFn,
      );
    };
  }

  public emit(
    eventName: string,
    data: IModelState | IThumbData | number[],
  ): void {
    const handlers: CallbackFunctionVariadic[] =
      this.handlersByEvent[eventName];
    if (handlers) {
      handlers.forEach(fn => {
        fn(data);
      });
    }
  }
}
export default EventEmitter;
