import { IModelState } from './interfaces/iModelState';
import Model from './Model/Model';
import View from './view/View';
import EventEmitter from './EventEmitter';

interface IData {
  value: number;
  index: number;
}

class Controller {
  public slider: HTMLElement;

  public model: Model;

  constructor(element: HTMLElement, eventEmitter: EventEmitter) {
    this.slider = element;
    this.slider.classList.add('slider');

    new View(this.slider, eventEmitter);
    this.model = new Model(eventEmitter);

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
