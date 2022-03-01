import EventEmitter from '../EventEmitter';
import { IAdapter } from '../interfaces/IAdapter';
import { IModelState } from '../interfaces/iModelState';
import Scale from './Scale';
import Thumbs from './Thumbs';
import Tooltips from './Tooltips';

class View {
  private slider: HTMLElement;

  private isCreatedSlider: boolean;

  private emitter: EventEmitter;

  private scale!: Scale;

  private thumbs!: Thumbs;

  private tooltips!: Tooltips;

  private adapter!: IAdapter;

  constructor(slider: HTMLElement, eventEmitter: EventEmitter) {
    this.slider = slider;
    this.isCreatedSlider = false;
    this.emitter = eventEmitter;
    this.scale = new Scale(this.slider, this.emitter);
    this.thumbs = new Thumbs(this.slider, this.emitter);
    this.tooltips = new Tooltips(this.slider);
    this.emitter.makeSubscribe('model:state-changed', (state: IModelState) => {
      this.setAdapter(state);
      this.initialize(state);
      this.rerender(state);
    });
    this.emitter.makeSubscribe(
      'model:thumbsValue-changed',
      (state: IModelState) => {
        this.rerender(state);
      },
    );
    this.emitter.makeSubscribe('view:click-on-scale', (event: MouseEvent) => {
      this.emitter.emit('view:update-thumbs-position', event);
    });
    this.emitter.makeSubscribe(
      'view:click-on-serif-scale',
      (index: number, valuesSerifs: number[]) => {
        this.emitter.emit(
          'view:update-thumbs-position-on-serif-scale',
          index,
          valuesSerifs,
        );
      },
    );
  }

  private initialize(state: IModelState): void {
    if (!this.isCreatedSlider) {
      this.scale.initializeScale.call(this.scale, state);
      this.thumbs.initializeThumbs.call(this.thumbs, state, this.adapter);
      this.tooltips.initializeTooltips.call(this.tooltips, state);

      this.isCreatedSlider = true;
    }
  }

  private rerender(state: IModelState): void {
    this.scale.setConfig.call(this.scale, state);
    this.thumbs.initializeThumbs.call(this.thumbs, state);
    this.tooltips.setConfig.call(this.tooltips, state);
  }

  private update(thumbsValues: number[]): void {
    this.thumbs.setValuesThumbs(thumbsValues, null);
  }

  private setAdapter(state: IModelState): void {
    if (state.orientation === 'horizontal') {
      this.adapter = {
        offsetDirection: 'offsetLeft',
        offsetAxis: 'offsetX',
        pageAxis: 'pageX',
        currentAxis: 'currentX',
        direction: 'left',
        margin: 'marginLeft',
        length: 'width',
      };
    } else if (state.orientation === 'vertical') {
      this.adapter = {
        offsetDirection: 'offsetTop',
        offsetAxis: 'offsetY',
        pageAxis: 'pageY',
        currentAxis: 'currentY',
        direction: 'top',
        margin: 'marginTop',
        length: 'height',
      };
    }
  }
}
export default View;
