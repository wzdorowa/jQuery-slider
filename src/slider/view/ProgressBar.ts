import EventEmitter from '../EventEmitter';
import { IAdapter } from '../interfaces/IAdapter';
import { IModelState } from '../interfaces/iModelState';
import createElement from '../functions/createElement';

class ProgressBar {
  private slider: HTMLElement;

  public progressBar!: HTMLElement;

  public divisionsElements: HTMLElement[];

  private activeRange!: HTMLElement;

  private emitter: EventEmitter;

  private valuesDivisions: number[];

  private adapter!: IAdapter;

  private step!: number;

  private thumbsValues!: number[];

  private min: number;

  private max: number;

  constructor(element: HTMLElement, emitter: EventEmitter) {
    this.slider = element;
    this.emitter = emitter;
    this.divisionsElements = [];
    this.valuesDivisions = [];
    this.min = 0;
    this.max = 0;
  }

  public renderProgressBar(state: IModelState, adapter: IAdapter): void {
    this.adapter = adapter;
    this.step = state.step;
    this.thumbsValues = state.thumbsValues;
    this.min = state.min;
    this.max = state.max;

    this.createProgressBar(state.orientation);

    if (state.hasScaleValues) {
      this.renderDivisions(state);
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

  public findAndSetTheNearestThumb(currentValue: number): void {
    const leftSpacing: number[] = [];
    const rightSpacing: number[] = [];

    this.thumbsValues.forEach((thumbValue: number) => {
      const valueLeftSpacing = thumbValue - currentValue;
      leftSpacing.push(Math.abs(valueLeftSpacing));

      const valueRightSpacing = thumbValue + currentValue;
      rightSpacing.push(Math.abs(valueRightSpacing));
    });

    let currentSpacingValue: number | null = null;
    let currentThumbIndex: number | null = null;

    const checkValueSpacing = (element: number, index: number) => {
      if (currentSpacingValue === null) {
        currentSpacingValue = element;
      }
      if (currentThumbIndex === null) {
        currentThumbIndex = index;
      }
      if (element < currentSpacingValue) {
        currentSpacingValue = element;
        currentThumbIndex = index;
      }
    };
    leftSpacing.forEach((element, index) => {
      checkValueSpacing(element, index);
    });
    rightSpacing.forEach((element, index) => {
      checkValueSpacing(element, index);
    });

    if (currentThumbIndex !== null) {
      this.emitter.emit('view:thumbPosition-changed', {
        value: currentValue,
        index: currentThumbIndex,
      });
    }
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

  private renderDivisions(state: IModelState): void {
    const { max, min, step, orientation } = state;

    const maximumNumberOfDivisions = 5;

    const numberOfDivisions = Math.round((max - min) / step);

    let stepSize = (max - min) / numberOfDivisions;

    if (numberOfDivisions > maximumNumberOfDivisions) {
      stepSize = (max - min) / maximumNumberOfDivisions;
    }

    const stepForScaleValue = Math.round(stepSize / step) * step;

    const scaleValueContainer: HTMLElement = createElement(
      'div',
      'slider__scale-value-container js-slider__scale-value-container',
    );
    if (orientation === 'vertical') {
      scaleValueContainer.classList.add(
        'slider__scale-value-container_vertical',
      );
    }
    const htmlFragment = this.createElementsDivisions(stepForScaleValue, state);
    scaleValueContainer.append(htmlFragment);
    this.slider.append(scaleValueContainer);

    this.setDivisionsInPlaces(min, max);
  }

  private createElementsDivisions(
    stepForScaleValue: number,
    state: IModelState,
  ): DocumentFragment {
    const { max, min, step, orientation } = state;
    const htmlFragment = document.createDocumentFragment();

    const lastStep = max - min - ((max - min) / step) * step;

    let numberOfDivisions: number =
      Math.ceil((max - min) / stepForScaleValue) + 1;

    if (lastStep > 0) {
      numberOfDivisions += 1;
    }

    let currentValueSerif: number = min;

    new Array(numberOfDivisions)
      .fill(1)
      .forEach((_element: number, index: number) => {
        if (index === 0) {
          this.valuesDivisions[index] = min;
          currentValueSerif += stepForScaleValue;
        } else if (index === numberOfDivisions - 1) {
          this.valuesDivisions[index] = max;
        } else {
          this.valuesDivisions[index] = currentValueSerif;

          currentValueSerif =
            Math.round((currentValueSerif + stepForScaleValue) * 100) / 100;
        }
      });

    this.valuesDivisions.forEach(element => {
      const scaleValue: HTMLElement = createElement(
        'div',
        'slider__scale-value js-slider__scale-value',
      );

      const valueWithNumber: HTMLElement = createElement(
        'span',
        'slider__scale-value-with-number js-slider__scale-value-with-number',
      );

      if (orientation === 'vertical') {
        scaleValue.classList.add('slider__scale-value_vertical');
        valueWithNumber.classList.add(
          'slider__scale-value-with-number_vertical',
        );
      }
      valueWithNumber.innerHTML = String(element);
      scaleValue.append(valueWithNumber);
      htmlFragment.append(scaleValue);
      this.divisionsElements.push(scaleValue);
    });

    this.listenScaleValueEvents();
    return htmlFragment;
  }

  private setDivisionsInPlaces(min: number, max: number): void {
    this.divisionsElements.forEach((element, i) => {
      const percent = ((this.valuesDivisions[i] - min) / (max - min)) * 100;

      const serif = element;

      serif.style[this.adapter.position] = `${percent}%`;
    });
  }

  private listenScaleValueEvents(): void {
    this.divisionsElements.forEach((element, index) => {
      element.addEventListener(
        'click',
        this.handleSerifScaleClick.bind(this, index, this.valuesDivisions),
        true,
      );
    });
  }

  private handleProgressBarClick = (event: MouseEvent): void => {
    let clickLocationAxis = 0;

    const startAxis = this.progressBar.getBoundingClientRect();
    const offset =
      event[this.adapter.clientAxis] - startAxis[this.adapter.clientRect];

    const pointSize =
      this.progressBar[this.adapter.offsetLength] / (this.max - this.min);

    const shiftToMinValue = pointSize * this.min;

    clickLocationAxis = offset + shiftToMinValue;

    let currentValue: number = clickLocationAxis / pointSize;

    const minValue: number = Math.floor(currentValue / this.step) * this.step;
    const halfStep = minValue + this.step / 2;

    if (currentValue > halfStep) {
      currentValue = minValue + this.step;
    } else {
      currentValue = minValue;
    }

    this.findAndSetTheNearestThumb(currentValue);
  };

  private handleSerifScaleClick(index: number, valuesSerifs: number[]): void {
    this.findAndSetTheNearestThumb(valuesSerifs[index]);
  }
}
export default ProgressBar;
