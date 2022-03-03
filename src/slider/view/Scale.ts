import EventEmitter from '../EventEmitter';
import { IAdapter } from '../interfaces/IAdapter';
import { IModelState } from '../interfaces/iModelState';
import createElement from '../functions/createElement';
import utilities from './utilities/utilities';

class Scale {
  private slider: HTMLElement;

  private scale!: HTMLElement | null;

  private activeRange!: HTMLElement;

  private emitter: EventEmitter;

  public serifsElements: HTMLElement[];

  private valuesSerifs: number[];

  private isCreatedScaleOfValue: boolean;

  private adapter!: IAdapter;

  private coefficientPoint!: number;

  private shiftToMinValue!: number;

  private step!: number;

  constructor(element: HTMLElement, emitter: EventEmitter) {
    this.slider = element;
    this.emitter = emitter;
    this.serifsElements = [];
    this.valuesSerifs = [];
    this.isCreatedScaleOfValue = false;
  }

  public renderScale(state: IModelState, adapter: IAdapter): void {
    this.adapter = adapter;
    this.step = state.step;

    this.createScale(state.orientation);

    if (this.scale !== null) {
      this.coefficientPoint =
        this.scale[this.adapter.offsetLength] / (state.max - state.min);
    }
    this.shiftToMinValue = this.coefficientPoint * state.min;

    this.updateActiveRange();

    if (state.isScaleOfValues) {
      this.renderSerifs(state);
    } else {
      this.removeElementsScaleValueContainer();
    }
  }

  /* function createScale adds scale elements to the main html slider structure */
  private createScale(orientation: string): void {
    const scaleToDelete = this.slider.querySelector('.js-slider__scale');

    if (scaleToDelete !== null) {
      scaleToDelete.remove();
    }
    this.scale = null;

    const scale: HTMLElement = createElement(
      'div',
      'slider__scale js-slider__scale',
    );

    const activeRange: HTMLElement = createElement(
      'span',
      'slider__active-range js-slider__active-range',
    );

    if (orientation === 'vertical') {
      scale.classList.add('slider__scale_vertical');
    }

    this.scale = scale;
    this.activeRange = activeRange;
    scale.append(activeRange);
    this.slider.append(scale);

    this.listenScaleClick();
  }

  private listenScaleClick(): void {
    if (this.scale !== null) {
      this.scale.addEventListener(
        'click',
        this.handleScaleClick.bind(this),
        true,
      );
    }
  }

  updateActiveRange(): void {
    const $allThumbs: HTMLElement[] = Array.from(
      $(this.slider).find('.js-slider__thumb'),
    );
    const firstThumb = $allThumbs[0];
    const lastThumb = $allThumbs[$allThumbs.length - 1];

    if ($allThumbs.length === 1) {
      const lengthActiveRange = String(
        firstThumb[this.adapter.offsetDirection],
      );
      this.activeRange.style[this.adapter.margin] = `0px`;
      this.activeRange.style[this.adapter.length] = `${lengthActiveRange}px`;
    } else if ($allThumbs.length > 1) {
      const margin = String(firstThumb[this.adapter.offsetDirection]);

      const lengthActiveRange = String(
        lastThumb[this.adapter.offsetDirection] -
          firstThumb[this.adapter.offsetDirection],
      );

      this.activeRange.style[this.adapter.margin] = `${margin}px`;
      this.activeRange.style[this.adapter.length] = `${lengthActiveRange}px`;
    }
  }

  private renderSerifs(state: IModelState): void {
    const { max, min, step, orientation } = state;

    this.removeElementsScaleValueContainer();
    if (!this.isCreatedScaleOfValue) {
      let stepForScaleValue;
      const maximumNumberOfDivisions = 10;

      let countSteps = (max - min) / step;

      if (countSteps > maximumNumberOfDivisions) {
        countSteps = maximumNumberOfDivisions;
      }

      stepForScaleValue = step * Math.ceil(countSteps / step);

      stepForScaleValue = Math.floor(stepForScaleValue * 100) / 10;

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
      const htmlFragment = this.createElementsSerifs(stepForScaleValue, state);
      scaleValueContainer.append(htmlFragment);
      this.slider.append(scaleValueContainer);
      this.isCreatedScaleOfValue = true;

      this.setSerifsInPlaces();
    }
  }

  private createElementsSerifs(
    stepForScaleValue: number,
    state: IModelState,
  ): DocumentFragment {
    const { max, min, step, orientation } = state;
    const lastStep = max - min - ((max - min) / step) * step;

    let numberOfSerifs: number = Math.ceil((max - min) / stepForScaleValue) + 1;

    if (lastStep > 0) {
      numberOfSerifs += 1;
    }

    let currentValueSerif: number = min;

    const fractionalPartStep =
      stepForScaleValue - Math.floor(stepForScaleValue);

    new Array(numberOfSerifs)
      .fill(1)
      .forEach((_element: number, index: number) => {
        if (index === 0) {
          this.valuesSerifs[index] = min;
          currentValueSerif += stepForScaleValue;
          currentValueSerif = Math.ceil(currentValueSerif * 10) / 10;
        } else if (index === numberOfSerifs - 1) {
          this.valuesSerifs[index] = max;
        } else {
          this.valuesSerifs[index] = currentValueSerif;
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
    this.valuesSerifs.forEach(element => {
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
      this.serifsElements.push(scaleValue);
    });
    this.listenScaleValueEvents();
    return htmlFragment;
  }

  private setSerifsInPlaces(): void {
    this.serifsElements.forEach((element, i) => {
      const serif = element;
      let indentLeft = '';
      if (i === this.serifsElements.length - 1) {
        indentLeft = String(
          this.coefficientPoint * this.valuesSerifs[i] -
            this.shiftToMinValue -
            1,
        );
      } else {
        indentLeft = String(
          this.coefficientPoint * this.valuesSerifs[i] - this.shiftToMinValue,
        );
      }
      serif.style[this.adapter.margin] = `${indentLeft}px`;
    });
  }

  private removeElementsScaleValueContainer(): void {
    const element: HTMLElement | null = this.slider.querySelector(
      '.js-slider__scale-value-container',
    );
    if (element !== null) {
      element.remove();
    }
    this.serifsElements = [];
    this.isCreatedScaleOfValue = false;
  }

  private listenScaleValueEvents(): void {
    this.serifsElements.forEach((element, index) => {
      element.addEventListener(
        'click',
        this.handleSerifScaleClick.bind(this, index, this.valuesSerifs),
        true,
      );
    });
  }

  private handleScaleClick(event: MouseEvent): void {
    if (this.scale !== null) {
      let clickLocationAxis = 0;

      const startAxis = this.scale.getBoundingClientRect();
      const offsetX = event.clientX - startAxis.x;

      clickLocationAxis = offsetX + this.shiftToMinValue;

      const currentValue: number = utilities.calculateValueForClickOnScale(
        clickLocationAxis,
        this.coefficientPoint,
        this.step,
      );

      this.emitter.emit('view:click-on-scale', currentValue);
    }
  }

  private handleSerifScaleClick(index: number, valuesSerifs: number[]): void {
    this.emitter.emit('view:click-on-serif-scale', index, valuesSerifs);
  }
}
export default Scale;
