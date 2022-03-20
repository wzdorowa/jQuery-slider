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
  }

  public initialize(state: IModelState): void {
    this.slider.innerHTML = '';
    this.setAdapter(state.orientation);

    this.progressBar = new ProgressBar(this.slider, this.emitter);
    this.thumbs = new Thumbs(this.slider, this.emitter);
    this.tooltips = new Tooltips(this.slider);
  }

  public render(state: IModelState): void {
    this.progressBar.renderProgressBar.call(
      this.progressBar,
      state,
      this.adapter,
    );

    this.thumbs.renderThumbs.call(this.thumbs, state, this.adapter);
    this.progressBar.updateActiveRange(state.thumbsValues);
    this.tooltips.renderTooltips.call(this.tooltips, state);
  }

  public update(thumbsValues: number[]): void {
    this.thumbs.setValuesThumbs(thumbsValues);
    this.tooltips.setTooltipsValues(thumbsValues);
    this.progressBar.updateActiveRange(thumbsValues);
  }

  private setAdapter(orientation: string): void {
    if (orientation === 'horizontal') {
      this.adapter = {
        offsetDirection: 'offsetLeft',
        offsetAxis: 'offsetX',
        offsetLength: 'offsetWidth',
        pageAxis: 'pageX',
        clientAxis: 'clientX',
        currentAxis: 'currentX',
        clientRect: 'x',
        direction: 'left',
        position: 'left',
        length: 'width',
      };
    } else if (orientation === 'vertical') {
      this.adapter = {
        offsetDirection: 'offsetTop',
        offsetAxis: 'offsetY',
        offsetLength: 'offsetHeight',
        pageAxis: 'pageY',
        clientAxis: 'clientY',
        currentAxis: 'currentY',
        clientRect: 'y',
        direction: 'top',
        position: 'top',
        length: 'height',
      };
    }
  }
}
export default View;
