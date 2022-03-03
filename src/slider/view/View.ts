import EventEmitter from '../EventEmitter';
import { IAdapter } from '../interfaces/IAdapter';
import { IModelState } from '../interfaces/iModelState';
import ProgressBar from './ProgressBar';
import Thumbs from './Thumbs';
import Tooltips from './Tooltips';

class View {
  private slider: HTMLElement;

  private emitter: EventEmitter;

  private progressBar!: ProgressBar;

  private thumbs!: Thumbs;

  private tooltips!: Tooltips;

  private adapter!: IAdapter;

  constructor(slider: HTMLElement, eventEmitter: EventEmitter) {
    this.slider = slider;
    this.emitter = eventEmitter;

    this.emitter.makeSubscribe('model:state-changed', (state: IModelState) => {
      this.initialize(state);
      this.render(state);
    });
    this.emitter.makeSubscribe(
      'view:click-on-progress-bar',
      (currentValue: number) => {
        this.emitter.emit('view:update-thumbs-position', currentValue);
      },
    );
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

  private initialize(state: IModelState) {
    this.slider.innerHTML = '';
    this.setAdapter(state.orientation);

    this.progressBar = new ProgressBar(this.slider, this.emitter);
    this.thumbs = new Thumbs(this.slider, this.emitter);
    this.tooltips = new Tooltips(this.slider);
  }

  private render(state: IModelState): void {
    this.progressBar.renderProgressBar.call(
      this.progressBar,
      state,
      this.adapter,
    );

    const pointSize: number =
      this.progressBar.progressBar[this.adapter.offsetLength] /
      (state.max - state.min);

    this.thumbs.renderThumbs.call(this.thumbs, state, this.adapter, pointSize);
    this.progressBar.updateActiveRange();
    this.tooltips.renderTooltips.call(this.tooltips, state);
  }

  private update(thumbsValues: number[]): void {
    this.thumbs.setValuesThumbs(thumbsValues, null);
  }

  private setAdapter(orientation: string): void {
    if (orientation === 'horizontal') {
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
    } else if (orientation === 'vertical') {
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
