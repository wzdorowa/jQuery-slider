import { IModelState } from './interfaces/iModelState';
import { IThumbData } from './interfaces/IThumbData';
import Model from './Model/Model';
import View from './view/View';
import EventEmitter from './EventEmitter';
import validateState from './functions/validateState';

class Controller {
  private slider: HTMLElement;

  public emitter: EventEmitter;

  private model: Model;

  private view: View;

  constructor(element: HTMLElement, props: unknown) {
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

  public updateState(state: unknown): void {
    const newState: IModelState = validateState(state, this.model.state);
    this.model.updateState(newState);
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

    this.emitter.makeSubscribe(
      'view:thumbPosition-changed',
      (data: IThumbData) => {
        this.model.requestThumbValueChange(data.value, data.index);
      },
    );
  }
}
export default Controller;
