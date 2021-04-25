import EventEmitter from '../eventEmitter';
import { IModelState } from '../interfaces/iModelState';
import Scale from '../view/scale';
import Thumbs from './thumbs';
import Tooltips from '../view/tooltips';

class View {
  private slider: HTMLElement;

  private isCreatedSlider: boolean;

  private emitter: EventEmitter;

  private scale!: Scale;

  private thumbs!: Thumbs;

  private tooltips!: Tooltips;

  constructor(slider: HTMLElement, eventEmitter: EventEmitter) {
    this.slider = slider;
    this.isCreatedSlider = false;
    this.emitter = eventEmitter;
    this.scale = new Scale(this.slider, this.emitter);
    this.thumbs = new Thumbs(this.slider, this.emitter);
    this.tooltips = new Tooltips(this.slider);
    this.emitter.makeSubscribe('model:state-changed', (state: IModelState) => {
      this.initialize(state);
      this.rerender(state);
    });
    this.emitter.makeSubscribe('view:click-on-scale', (event: MouseEvent) => {
      this.emitter.emit('view:update-thumbs-position', event);
    });
  }

  private initialize(state: IModelState) {
    if (!this.isCreatedSlider) {
      this.scale.initializeScale(state);
      this.thumbs.initializeThumbs(state);
      this.tooltips.initializeTooltips(state);

      this.isCreatedSlider = true;
    }
  }

  private rerender(state: IModelState) {
    this.scale.setConfig(state);
    this.thumbs.setConfig(state);
    this.tooltips.setConfig(state);
  }
}
export default View;
