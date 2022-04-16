import EventEmitter from '../EventEmitter';
import { IAdapter } from '../interfaces/IAdapter';
import { IModelState } from '../interfaces/iModelState';
import createElement from '../functions/createElement';
import findNearestThumb from '../functions/findNearestThumb';
import Scale from './Scale';

class ProgressBar {
  private slider: HTMLElement;

  public progressBar!: HTMLElement;

  private activeRange!: HTMLElement;

  private emitter: EventEmitter;

  private adapter!: IAdapter;

  private step!: number;

  private thumbsValues!: number[];

  private min: number;

  private max: number;

  constructor(element: HTMLElement, emitter: EventEmitter) {
    this.slider = element;
    this.emitter = emitter;
    this.min = 0;
    this.max = 0;
  }

  public renderProgressBar({
    state,
    adapter,
  }: {
    state: IModelState;
    adapter: IAdapter;
  }): void {
    this.adapter = adapter;
    this.step = state.step;
    this.thumbsValues = state.thumbsValues;
    this.min = state.min;
    this.max = state.max;

    this.createProgressBar(state.orientation);

    if (state.hasScaleValues) {
      const scale = new Scale(this.slider, this.emitter, this.adapter);
      scale.renderDivisions(state);
    }
  }

  public updateActiveRange(thumbsValues: number[]): void {
    const firstThumb = thumbsValues[0];
    const lastThumb = thumbsValues[thumbsValues.length - 1];

    const firstThumbPosition =
      ((firstThumb - this.min) / (this.max - this.min)) * 100;
    const lastThumbPosition =
      ((lastThumb - this.min) / (this.max - this.min)) * 100;

    let margin = 0;
    let lengthActiveRange;

    if (thumbsValues.length === 1) {
      lengthActiveRange = firstThumbPosition;
    } else if (thumbsValues.length > 1) {
      margin = firstThumbPosition;

      lengthActiveRange = lastThumbPosition - firstThumbPosition;
    }

    this.activeRange.style[this.adapter.position] = `${margin}%`;
    this.activeRange.style[this.adapter.length] = `${lengthActiveRange}%`;
  }

  public getPointSize(min: number, max: number): number | null {
    const progressBar: HTMLElement | null = this.slider.querySelector(
      '.slider__progress-bar',
    );
    if (progressBar !== null) {
      return progressBar[this.adapter.offsetLength] / (max - min);
    }
    return null;
  }

  private createProgressBar(orientation: string): void {
    const progressBar: HTMLElement = createElement(
      'div',
      'slider__progress-bar js-slider__progress-bar',
    );

    const activeRange: HTMLElement = createElement(
      'span',
      'slider__active-range js-slider__active-range',
    );

    if (orientation === 'vertical') {
      progressBar.classList.add('slider__progress-bar_vertical');
    }

    this.progressBar = progressBar;
    this.activeRange = activeRange;
    progressBar.append(activeRange);
    this.slider.append(progressBar);

    this.listenProgressBarClick();
  }

  private listenProgressBarClick(): void {
    this.progressBar.addEventListener(
      'click',
      this.handleProgressBarClick,
      true,
    );
  }

  private handleProgressBarClick = (event: MouseEvent): void => {
    let clickLocationAxis = 0;

    const startAxis = this.progressBar.getBoundingClientRect();
    const offset =
      event[this.adapter.clientAxis] - startAxis[this.adapter.clientRect];

    const pointSize = this.getPointSize(this.min, this.max);

    if (pointSize !== null) {
      const shiftToMinValue = pointSize * this.min;
      clickLocationAxis = offset + shiftToMinValue;

      let currentValue: number = clickLocationAxis / pointSize;

      const minValue: number = Math.floor(currentValue / this.step) * this.step;
      const halfStep = minValue + this.step / 2;

      const lastStep =
        Math.round(((this.max - this.min) % this.step) * 10) / 10;
      const halfLastStep = this.max - lastStep / 2;

      if (currentValue > halfLastStep) {
        currentValue = minValue + lastStep;
      } else if (currentValue > halfStep) {
        currentValue = minValue + this.step;
      } else {
        currentValue = minValue;
      }

      const nearestThumb = findNearestThumb(currentValue, this.thumbsValues);

      if (nearestThumb !== null) {
        this.emitter.emit('view:thumbPosition-changed', nearestThumb);
      }
    }
  };
}
export default ProgressBar;
