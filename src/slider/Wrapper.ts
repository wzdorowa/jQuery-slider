import Controller from './Controller';
import { IModelState } from './interfaces/iModelState';
import EventEmitter from './EventEmitter';

class Wrapper {
  public slider: HTMLElement;

  private emitter: EventEmitter;

  private controller: Controller;

  public updateAction: (state: IModelState) => void;

  public subscribeAction: (handler: (state: IModelState) => void) => void;

  constructor(element: HTMLElement, props: IModelState) {
    this.slider = element;

    this.emitter = new EventEmitter();
    this.controller = new Controller(this.slider, this.emitter);

    this.updateAction = this.update.bind(this);
    this.subscribeAction = this.subscribe.bind(this);

    this.update(props);
  }

  private update(state: IModelState): void {
    this.controller.updateState(state);
  }

  private subscribe(handler: (state: IModelState) => void): void {
    this.emitter.makeSubscribe('model:state-changed', (state: IModelState) => {
      handler(state);
    });
  }
}

export default Wrapper;
