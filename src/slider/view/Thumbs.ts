import EventEmitter from '../EventEmitter';
import createElement from '../functions/createElement';
import { IModelState } from '../interfaces/iModelState';
import { IAdapter } from '../interfaces/IAdapter';
import utilities from './utilities/utilities';

class Thumbs {
  private slider: HTMLElement;

  private emitter: EventEmitter;

  private adapter!: IAdapter;

  private thumbs: HTMLElement[];

  private pointSize: number;

  private shiftToMinValue: number;

  private startMoveAxis: number;

  private target: HTMLElement | null;

  private indexActiveThumb: number | null;

  constructor(element: HTMLElement, eventEmitter: EventEmitter) {
    this.slider = element;
    this.emitter = eventEmitter;
    this.thumbs = [];
    this.pointSize = 0;
    this.shiftToMinValue = 0;
    this.startMoveAxis = 0;
    this.target = null;
    this.indexActiveThumb = null;
  }

  public renderThumbs(
    state: IModelState,
    adapter: IAdapter,
    pointSize: number,
  ): void {
    this.adapter = adapter;
    this.pointSize = pointSize;
    this.shiftToMinValue = this.pointSize * state.min;

    this.createThumbs(state.thumbsCount);
    this.listenThumbsEvents();
    this.setValuesThumbs(state.thumbsValues, null);
  }

  /* the CreateSlider function adds sliders to the parent of the slider */
  private createThumbs(thumbsCount: number): void {
    const htmlFragment = document.createDocumentFragment();
    new Array(thumbsCount).fill(1).forEach(() => {
      const thumb: HTMLElement = createElement(
        'div',
        'slider__thumb js-slider__thumb',
      );

      this.thumbs.push(thumb);
      htmlFragment.append(thumb);
    });
    this.slider.append(htmlFragment);
  }

  /* hangs the 'mousedown' event handler for each created thumb */
  private listenThumbsEvents(): void {
    this.thumbs.forEach((element: HTMLElement, i: number) => {
      element.addEventListener(
        'mousedown',
        this.handleThumbStart.bind(this, i),
      );
    });
  }

  /* places thumbs on the slider based on default values */
  public setValuesThumbs(thumbsValues: number[], index: number | null): void {
    this.thumbs.forEach((_element, i) => {
      if (this.adapter?.direction !== undefined) {
        if (i !== index) {
          const element = this.thumbs[i];
          const indent = String(
            this.pointSize * thumbsValues[i] - this.shiftToMinValue,
          );

          element.style[this.adapter?.direction] = `${indent}px`;
        }
      }
    });
  }

  private processStart(event: MouseEvent, index: number): void {
    event.preventDefault();
    this.indexActiveThumb = index;

    this.target = this.thumbs[index];

    const currentValueAxis = this.target[this.adapter?.offsetDirection];

    this.startMoveAxis = event.pageX - currentValueAxis;

    document.addEventListener('mousemove', this.handleThumbMove.bind(this));
    document.addEventListener('mouseup', this.handleThumbStop.bind(this));
  }

  private processMove(event: MouseEvent): void {
    if (this.indexActiveThumb !== null && this.target !== null) {
      const currentValueAxis =
        event[this.adapter?.pageAxis] - this.startMoveAxis;

      const value = utilities.calculateValue(
        currentValueAxis,
        this.pointSize,
        this.shiftToMinValue,
      );

      this.emitter.emit('view:thumbValue-changed', {
        value,
        index: this.indexActiveThumb,
      });
    }
  }

  private processStop(): void {
    this.target = null;
    this.indexActiveThumb = null;

    document.removeEventListener('mousemove', this.handleThumbMove.bind(this));
    document.removeEventListener('mouseup', this.handleThumbStop.bind(this));
  }

  private handleThumbStart(index: number, event: MouseEvent): void {
    this.processStart(event, index);
  }

  private handleThumbMove(event: MouseEvent): void {
    this.processMove(event);
  }

  private handleThumbStop(): void {
    this.processStop.call(this);
  }
}
export default Thumbs;
