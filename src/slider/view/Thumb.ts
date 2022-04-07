import EventEmitter from '../EventEmitter';
import createElement from '../functions/createElement';
import { IModelState } from '../interfaces/iModelState';
import { IAdapter } from '../interfaces/IAdapter';
import Tooltip from './Tooltip';
import getPointSize from '../functions/getPointSize';

class Thumb {
  private slider: HTMLElement;

  private emitter: EventEmitter;

  private adapter!: IAdapter;

  private thumb: HTMLElement | null;

  private startMoveAxis: number;

  private tooltip: Tooltip | null;

  private min: number;

  private max: number;

  private index: number;

  constructor(element: HTMLElement, eventEmitter: EventEmitter, index: number) {
    this.slider = element;
    this.emitter = eventEmitter;
    this.thumb = null;
    this.tooltip = null;
    this.startMoveAxis = 0;
    this.min = 0;
    this.max = 0;
    this.index = index;
  }

  public renderThumb(state: IModelState, adapter: IAdapter): void {
    this.adapter = adapter;
    this.min = state.min;
    this.max = state.max;

    this.createThumb();

    if (state.hasTooltips && this.thumb !== null) {
      this.tooltip = new Tooltip();
      this.tooltip.createTooltip(this.thumb, state.orientation);
    }

    this.setValueThumb(state.thumbsValues[this.index]);
  }

  public setValueThumb(thumbValue: number): void {
    const element = this.thumb;

    const percent = ((thumbValue - this.min) / (this.max - this.min)) * 100;

    if (element !== null) {
      element.style[this.adapter?.direction] = `calc((${percent}%) - (24px * ${
        percent / 100
      }))`;
    }

    if (this.tooltip !== null) {
      this.tooltip.setTooltipValue(thumbValue);
    }
  }

  private createThumb(): void {
    const thumb: HTMLElement = createElement(
      'div',
      'slider__thumb js-slider__thumb',
    );
    this.thumb = thumb;

    this.slider.append(thumb);
    this.listenThumbsEvents(thumb);
  }

  private listenThumbsEvents(thumb: HTMLElement): void {
    thumb.addEventListener('pointerdown', this.handleThumbStart.bind(this));
  }

  private processStart(event: MouseEvent): void {
    event.preventDefault();

    if (this.thumb !== null) {
      const currentValueAxis = this.thumb[this.adapter?.offsetDirection];

      this.startMoveAxis = event[this.adapter?.pageAxis] - currentValueAxis;

      document.addEventListener('pointermove', this.handleThumbMove);
      document.addEventListener('pointerup', this.handleThumbStop);
    }
  }

  private processMove(event: MouseEvent): void {
    const currentValueAxis = event[this.adapter?.pageAxis] - this.startMoveAxis;
    const pointSize = getPointSize(
      this.slider,
      this.adapter,
      this.min,
      this.max,
    );

    if (pointSize !== null) {
      const shiftToMinValue = pointSize * this.min;

      const value = (currentValueAxis + shiftToMinValue) / pointSize;

      this.emitter.emit('view:thumbPosition-changed', {
        value,
        index: this.index,
      });
    }
  }

  private processStop(): void {
    document.removeEventListener('pointermove', this.handleThumbMove);
    document.removeEventListener('pointerup', this.handleThumbStop);
  }

  private handleThumbStart(event: MouseEvent): void {
    this.processStart(event);
  }

  private handleThumbMove = (event: MouseEvent): void => {
    this.processMove(event);
  };

  private handleThumbStop = (): void => {
    this.processStop();
  };
}
export default Thumb;
