import Controller from './Controller';
import { IModelState } from './interfaces/iModelState';
import EventEmitter from './EventEmitter';

class Wrapper {
  public slider: HTMLElement;

  private emitter: EventEmitter;

  private controller: Controller;

  constructor(element: HTMLElement, props: IModelState) {
    this.slider = element;

    this.emitter = new EventEmitter();
    this.controller = new Controller(this.slider, this.emitter);

    this.update(props);
  }

  public getState = (): IModelState => {
    return this.controller.getState();
  };

  public update = (state: IModelState): void => {
    this.controller.updateState(state);
  };

  public subscribeToModelChanges = (
    handler: (state: IModelState) => void,
  ): void => {
    this.emitter.makeSubscribe('model:state-changed', (state: IModelState) => {
      handler(state);
    });
  };

  public subscribeToThumbsChanges = (
    handler: (thumbsValues: number[]) => void,
  ): void => {
    this.emitter.makeSubscribe(
      'model:thumbsValues-changed',
      (thumbsValues: number[]) => {
        handler(thumbsValues);
      },
    );
  };
}

export default Wrapper;
