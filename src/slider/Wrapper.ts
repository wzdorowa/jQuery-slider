import Controller from './Controller';
import { IModelState } from './interfaces/iModelState';

class Wrapper {
  private controller: Controller;

  constructor(controller: Controller) {
    this.controller = controller;
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
    this.controller.emitter.makeSubscribe(
      'model:state-changed',
      (state: IModelState) => {
        handler(state);
      },
    );
  };

  public subscribeToThumbsChanges = (
    handler: (thumbsValues: number[]) => void,
  ): void => {
    this.controller.emitter.makeSubscribe(
      'model:thumbsValues-changed',
      (thumbsValues: number[]) => {
        handler(thumbsValues);
      },
    );
  };
}

export default Wrapper;
