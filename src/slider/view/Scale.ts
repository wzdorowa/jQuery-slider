import EventEmitter from '../EventEmitter';
import createElement from '../functions/createElement';
import findNearestThumb from '../functions/findNearestThumb';
import { IAdapter } from '../interfaces/IAdapter';
import { IModelState } from '../interfaces/iModelState';

class Scale {
  private slider: HTMLElement;

  private emitter: EventEmitter;

  private valuesDivisions: number[];

  private divisionsElements: HTMLElement[];

  private adapter!: IAdapter;

  private thumbsValues!: number[];

  constructor(element: HTMLElement, emitter: EventEmitter, adapter: IAdapter) {
    this.slider = element;
    this.emitter = emitter;
    this.adapter = adapter;
    this.divisionsElements = [];
    this.valuesDivisions = [];
  }

  public renderDivisions(state: IModelState): void {
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

  private handleSerifScaleClick(index: number, valuesSerifs: number[]): void {
    const nearestThumb = findNearestThumb(
      valuesSerifs[index],
      this.thumbsValues,
    );

    if (nearestThumb !== null) {
      this.emitter.emit('view:thumbPosition-changed', nearestThumb);
    }
  }
}

export default Scale;
