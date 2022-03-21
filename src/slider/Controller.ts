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

  public emitter: EventEmitter;

  private model: Model;

  private view: View;

  constructor(element: HTMLElement, props: IModelState) {
    this.slider = element;
    this.slider.classList.add('slider');

    this.emitter = new EventEmitter();
    this.view = new View(this.slider, this.emitter);
    this.model = new Model(this.emitter);

    this.subscribeToEvents();
    this.updateState(props);
  }

  public getState(): IModelState {
    return this.model.state;
  }

  public updateState(state: IModelState): void {
    this.model.updateState(state);
  }

  private subscribeToEvents(): void {
    this.emitter.makeSubscribe('model:state-changed', (state: IModelState) => {
      this.view.initialize(state);
      this.view.render(state);
    });

    this.emitter.makeSubscribe(
      'model:thumbsValues-changed',
      (thumbsValues: number[]) => {
        this.view.update(thumbsValues);
      },
    );

    this.emitter.makeSubscribe('view:thumbPosition-changed', (data: IData) => {
      this.model.requestThumbValueChange(data.value, data.index);
    });
  }
}
export default Controller;
