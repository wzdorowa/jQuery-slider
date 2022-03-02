import EventEmitter from '../EventEmitter';
import { IAdapter } from '../interfaces/IAdapter';
import { IModelState } from '../interfaces/iModelState';
import Scale from './Scale';
import Thumbs from './Thumbs';
import Tooltips from './Tooltips';

class View {
  private slider: HTMLElement;

  private emitter: EventEmitter;

  private scale!: Scale;

  private thumbs!: Thumbs;

  private tooltips!: Tooltips;

  private adapter!: IAdapter;

  constructor(slider: HTMLElement, eventEmitter: EventEmitter) {
    this.slider = slider;
    this.emitter = eventEmitter;
    this.scale = new Scale(this.slider, this.emitter);
    this.thumbs = new Thumbs(this.slider, this.emitter);
    this.tooltips = new Tooltips(this.slider);
    this.emitter.makeSubscribe('model:state-changed', (state: IModelState) => {
      this.setAdapter(state);
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

  private rerender(state: IModelState): void {
    this.scale.renderScale.call(this.scale, state, this.adapter);
    this.thumbs.initializeThumbs.call(this.thumbs, state, this.adapter);
    this.tooltips.renderTooltips.call(this.tooltips, state);
  }

  private update(thumbsValues: number[]): void {
    this.thumbs.setValuesThumbs(thumbsValues, null);
  }

  private setAdapter(state: IModelState): void {
    if (state.orientation === 'horizontal') {
      this.adapter = {
        offsetDirection: 'offsetLeft',
        offsetAxis: 'offsetX',
        offsetLength: 'offsetWidth',
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
        offsetLength: 'offsetHeight',
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
