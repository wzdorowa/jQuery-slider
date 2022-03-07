import Controller from './Controller';
import { IModelState } from './interfaces/iModelState';
import EventEmitter from './EventEmitter';

class Wrapper {
  public slider: HTMLElement;

  private emitter: EventEmitter;

  private controller: Controller;

  public updateAction: (state: IModelState) => void;

  public subscribeAction: () => void;

  constructor(element: HTMLElement, props: IModelState) {
    this.slider = element;

    this.emitter = new EventEmitter();
    this.controller = new Controller(this.slider, this.emitter);

    this.update(props);
    this.updateAction = this.update.bind(this);
    this.subscribeAction = this.subscribe.bind(this);
  }

  private update(state: IModelState): void {
    this.controller.updateState(state);
  }

  private subscribe(): void {
    this.emitter.makeSubscribe('model:state-changed', (state: IModelState) => {
      return state;
    });
  }
}

export default Wrapper;
