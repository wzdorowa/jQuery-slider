import EventEmitter from '../EventEmitter';
import { IAdapter } from '../interfaces/IAdapter';
import { IModelState } from '../interfaces/iModelState';
import createElement from '../functions/createElement';
import utilities from './utilities/utilities';

class ProgressBar {
  private slider: HTMLElement;

  public progressBar!: HTMLElement;

  private activeRange!: HTMLElement;

  private emitter: EventEmitter;

  public divisionsElements: HTMLElement[];

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

    if (state.isScaleOfValues) {
      this.renderDivisions(state);
    }
  }

  /* function createProgressBar adds scale elements to the main html slider structure */
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
      this.handleProgressBarClick.bind(this),
      true,
    );
  }

  public updateActiveRange(
    thumbsValues: number[],
    min: number,
    max: number,
  ): void {
    const firstThumb = thumbsValues[0];
    const lastThumb = thumbsValues[thumbsValues.length - 1];

    const firstThumbPosition = ((firstThumb - min) / (max - min)) * 100;
    const lastThumbPosition = ((lastThumb - min) / (max - min)) * 100;

    let margin = 0;
    let lengthActiveRange;

    if (thumbsValues.length === 1) {
      lengthActiveRange = firstThumbPosition;
    } else if (thumbsValues.length > 1) {
      margin = firstThumbPosition;

      lengthActiveRange = lastThumbPosition - firstThumbPosition;
    }

    this.activeRange.style[this.adapter.margin] = `${margin}%`;
    this.activeRange.style[this.adapter.length] = `${lengthActiveRange}%`;
  }

  private renderDivisions(state: IModelState): void {
    const { max, min, step, orientation } = state;

    let stepForScaleValue;
    const maximumNumberOfDivisions = 10;

    let countSteps = (max - min) / step;

    if (countSteps > maximumNumberOfDivisions) {
      countSteps = maximumNumberOfDivisions;
    }

    stepForScaleValue =
      Math.floor(step * Math.ceil(countSteps / step) * 100) / 10;

    const fractionalPart = Math.ceil(stepForScaleValue) - stepForScaleValue;

    if (fractionalPart >= 0.5) {
      stepForScaleValue = Math.floor(stepForScaleValue) / 10;
    } else {
      stepForScaleValue = Math.ceil(stepForScaleValue) / 10;
    }

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

    this.setDivisionsInPlaces();
  }

  private createElementsDivisions(
    stepForScaleValue: number,
    state: IModelState,
  ): DocumentFragment {
    const { max, min, step, orientation } = state;
    const lastStep = max - min - ((max - min) / step) * step;

    let numberOfDivisions: number =
      Math.ceil((max - min) / stepForScaleValue) + 1;

    if (lastStep > 0) {
      numberOfDivisions += 1;
    }

    let currentValueSerif: number = min;

    const fractionalPartStep =
      stepForScaleValue - Math.floor(stepForScaleValue);

    new Array(numberOfDivisions)
      .fill(1)
      .forEach((_element: number, index: number) => {
        if (index === 0) {
          this.valuesDivisions[index] = min;
          currentValueSerif += stepForScaleValue;
          currentValueSerif = Math.ceil(currentValueSerif * 10) / 10;
        } else if (index === numberOfDivisions - 1) {
          this.valuesDivisions[index] = max;
        } else {
          this.valuesDivisions[index] = currentValueSerif;
          currentValueSerif += stepForScaleValue;

          if (fractionalPartStep === 0) {
            currentValueSerif = Math.ceil(currentValueSerif * 10) / 10;
          } else {
            let newValue = Math.floor(currentValueSerif * 100) / 10;

            const fractionalValuePart = Math.ceil(newValue) - newValue;

            if (fractionalValuePart >= 0.5) {
              newValue = Math.floor(newValue) / 10;
            } else {
              newValue = Math.ceil(newValue) / 10;
            }
            currentValueSerif = newValue;
          }
        }
      });

    const htmlFragment = document.createDocumentFragment();
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
      valueWithNumber.innerHTML = String(Math.floor(element * 10) / 10);
      scaleValue.append(valueWithNumber);
      htmlFragment.append(scaleValue);
      this.divisionsElements.push(scaleValue);
    });
    this.listenScaleValueEvents();
    return htmlFragment;
  }

  private setDivisionsInPlaces(): void {
    this.divisionsElements.forEach((element, i) => {
      const pointSize =
        this.progressBar[this.adapter.offsetLength] / (this.max - this.min);

      const shiftToMinValue = pointSize * this.min;

      const serif = element;
      let indent;

      if (i === this.divisionsElements.length - 1) {
        indent = pointSize * this.valuesDivisions[i] - shiftToMinValue - 1;
      } else {
        indent = pointSize * this.valuesDivisions[i] - shiftToMinValue;
      }

      const position = (indent * 100) / this.progressBar.clientWidth;

      serif.style[this.adapter.margin] = `${position}%`;
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
      if (currentSpacingValue !== currentValue) {
        this.emitter.emit('view:thumbValue-changed', {
          value: currentValue,
          index: currentThumbIndex,
        });
      }
    }
  }

  private handleProgressBarClick(event: MouseEvent): void {
    let clickLocationAxis = 0;

    const startAxis = this.progressBar.getBoundingClientRect();
    const offsetX = event.clientX - startAxis.x;

    const pointSize =
      this.progressBar[this.adapter.offsetLength] / (this.max - this.min);
    const shiftToMinValue = pointSize * this.min;

    clickLocationAxis = offsetX + shiftToMinValue;

    const currentValue: number = utilities.calculateValueForClickOnScale(
      clickLocationAxis,
      pointSize,
      this.step,
    );

    this.findAndSetTheNearestThumb(currentValue);
  }

  private handleSerifScaleClick(index: number, valuesSerifs: number[]): void {
    this.findAndSetTheNearestThumb(valuesSerifs[index]);
  }
}
export default ProgressBar;
