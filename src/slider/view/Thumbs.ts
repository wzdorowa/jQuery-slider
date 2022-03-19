import EventEmitter from '../EventEmitter';
import createElement from '../functions/createElement';
import { IModelState } from '../interfaces/iModelState';
import { IAdapter } from '../interfaces/IAdapter';

class Thumbs {
  private slider: HTMLElement;

  private emitter: EventEmitter;

  private adapter!: IAdapter;

  private thumbs: HTMLElement[];

  private startMoveAxis: number;

  private target: HTMLElement | null;

  private indexActiveThumb: number | null;

  private min: number;

  private max: number;

  constructor(element: HTMLElement, eventEmitter: EventEmitter) {
    this.slider = element;
    this.emitter = eventEmitter;
    this.thumbs = [];
    this.startMoveAxis = 0;
    this.target = null;
    this.indexActiveThumb = null;
    this.min = 0;
    this.max = 0;
  }

  public renderThumbs(state: IModelState, adapter: IAdapter): void {
    this.adapter = adapter;
    this.min = state.min;
    this.max = state.max;

    this.createThumbs(state.thumbsValues);
    this.listenThumbsEvents();
    this.setValuesThumbs(state.thumbsValues);
  }

  /* the CreateSlider function adds sliders to the parent of the slider */
  private createThumbs(thumbsValues: number[]): void {
    const htmlFragment = document.createDocumentFragment();
    thumbsValues.forEach(() => {
      const thumb: HTMLElement = createElement(
        'div',
        'slider__thumb js-slider__thumb',
      );

      this.thumbs.push(thumb);
      htmlFragment.append(thumb);
    });
    this.slider.append(htmlFragment);
  }

  /* hangs the 'pointerdown' event handler for each created thumb */
  private listenThumbsEvents(): void {
    this.thumbs.forEach((element: HTMLElement, i: number) => {
      element.addEventListener(
        'pointerdown',
        this.handleThumbStart.bind(this, i),
      );
    });
  }

  /* places thumbs on the slider based on default values */
  public setValuesThumbs(thumbsValues: number[]): void {
    this.thumbs.forEach((_element, i) => {
      if (this.adapter?.direction !== undefined) {
        const element = this.thumbs[i];

        const percent =
          ((thumbsValues[i] - this.min) / (this.max - this.min)) * 100;

        element.style[
          this.adapter?.direction
        ] = `calc((${percent}%) - (24px * ${percent / 100}))`;
      }
    });
  }

  private processStart(event: MouseEvent, index: number): void {
    event.preventDefault();
    this.indexActiveThumb = index;

    this.target = this.thumbs[index];

    const currentValueAxis = this.target[this.adapter?.offsetDirection];

    this.startMoveAxis = event[this.adapter?.pageAxis] - currentValueAxis;

    document.addEventListener('pointermove', this.handleThumbMove);
    document.addEventListener('pointerup', this.handleThumbStop);
  }

  private processMove(event: MouseEvent): void {
    if (this.indexActiveThumb !== null && this.target !== null) {
      const currentValueAxis =
        event[this.adapter?.pageAxis] - this.startMoveAxis;

      const progressBar: HTMLElement | null = this.slider.querySelector(
        '.slider__progress-bar',
      );

      if (progressBar !== null) {
        const pointSize =
          progressBar[this.adapter.offsetLength] / (this.max - this.min);

        const shiftToMinValue = pointSize * this.min;

        const value = (currentValueAxis + shiftToMinValue) / pointSize;

        this.emitter.emit('view:thumbPosition-changed', {
          value,
          index: this.indexActiveThumb,
        });
      }
    }
  }

  private processStop(): void {
    this.target = null;
    this.indexActiveThumb = null;

    document.removeEventListener('pointermove', this.handleThumbMove);
    document.removeEventListener('pointerup', this.handleThumbStop);
  }

  private handleThumbStart(index: number, event: MouseEvent): void {
    this.processStart(event, index);
  }

  private handleThumbMove = (event: MouseEvent): void => {
    this.processMove(event);
  };

  private handleThumbStop = (): void => {
    this.processStop.call(this);
  };
}
export default Thumbs;
