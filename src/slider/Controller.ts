import { IModelState } from './interfaces/iModelState';
import Model from './Model/Model';
import View from './view/View';
import EventEmitter from './EventEmitter';

interface IData {
  value: number;
  index: number;
}

class Controller {
  private slider: HTMLElement;

  private model: Model;

  private view: View;

  constructor(element: HTMLElement, eventEmitter: EventEmitter) {
    this.slider = element;
    this.slider.classList.add('slider');

    this.view = new View(this.slider, eventEmitter);
    this.model = new Model(eventEmitter);

    eventEmitter.makeSubscribe('model:state-changed', (state: IModelState) => {
      this.view.initialize(state);
      this.view.render(state);
    });

    eventEmitter.makeSubscribe(
      'model:thumbsValues-changed',
      (thumbsValues: number[]) => {
        this.view.update(thumbsValues);
      },
    );

    eventEmitter.makeSubscribe('view:thumbPosition-changed', (data: IData) => {
      this.model.requestThumbValueChange(data.value, data.index);
    });
  }

  public getState(): IModelState {
    return this.model.state;
  }

  public updateState(state: IModelState): void {
    this.model.updateState(state);
  }
}
export default Controller;
