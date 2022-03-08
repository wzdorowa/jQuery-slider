import Controller from './Controller';
import { IModelState } from './interfaces/iModelState';
import EventEmitter from './EventEmitter';

class Wrapper {
  public slider: HTMLElement;

  private emitter: EventEmitter;

  private controller: Controller;

  public updateAction: (state: IModelState) => void;

  public modelChangesAction: (handler: (state: IModelState) => void) => void;

  public thumbsChangesAction: (
    handler: (thumbsValues: number[]) => void,
  ) => void;

  constructor(element: HTMLElement, props: IModelState) {
    this.slider = element;

    this.emitter = new EventEmitter();
    this.controller = new Controller(this.slider, this.emitter);

    this.updateAction = this.update.bind(this);
    this.modelChangesAction = this.subscribeToModelChanges.bind(this);
    this.thumbsChangesAction = this.subscribeToThumbsChanges.bind(this);

    this.update(props);
  }

  private update(state: IModelState): void {
    this.controller.updateState(state);
  }

  private subscribeToModelChanges(handler: (state: IModelState) => void): void {
    this.emitter.makeSubscribe('model:state-changed', (state: IModelState) => {
      handler(state);
    });
  }

  private subscribeToThumbsChanges(
    handler: (thumbsValues: number[]) => void,
  ): void {
    this.emitter.makeSubscribe(
      'model:thumbsValues-changed',
      (thumbsValues: number[]) => {
        handler(thumbsValues);
      },
    );
  }
}

export default Wrapper;
