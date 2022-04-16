import EventEmitter from '../EventEmitter';
import { IAdapter } from '../interfaces/IAdapter';
import { IModelState } from '../interfaces/iModelState';
import ProgressBar from './ProgressBar';
import Thumb from './Thumb';

class View {
  private slider: HTMLElement;

  private emitter: EventEmitter;

  private progressBar!: ProgressBar;

  private thumbs!: Thumb[];

  private adapter!: IAdapter;

  constructor(slider: HTMLElement, eventEmitter: EventEmitter) {
    this.slider = slider;
    this.emitter = eventEmitter;
    this.thumbs = [];
  }

  public initialize(state: IModelState): void {
    this.slider.innerHTML = '';
    this.thumbs = [];
    this.setAdapter(state.orientation);

    this.progressBar = new ProgressBar(this.slider, this.emitter);
    state.thumbsValues.forEach((_element, index) => {
      this.thumbs.push(new Thumb(this.slider, this.emitter, index));
    });
  }

  public render(state: IModelState): void {
    this.progressBar.renderProgressBar(state, this.adapter);

    const { getPointSize } = this.progressBar;
    this.thumbs.forEach(thumb => {
      thumb.renderThumb(state, this.adapter, getPointSize);
    });
    this.progressBar.updateActiveRange(state.thumbsValues);
  }

  public update(thumbsValues: number[]): void {
    this.thumbs.forEach((thumb, index) => {
      thumb.setValueThumb(thumbsValues[index]);
    });
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
