import EventEmitter from '../EventEmitter';
import { IAdapter } from '../interfaces/IAdapter';
import { IModelState } from '../interfaces/iModelState';
import createElement from '../functions/createElement';

class Scale {
  private slider: HTMLElement;

  private scale: HTMLElement | null;

  private emitter: EventEmitter;

  private orientation: string | null;

  private thumbsValues: number[];

  private shiftToMinValue: number;

  private coefficientPoint: number;

  private maxValueSlider: number;

  private minValueSlider: number;

  private stepSlider: number;

  public serifsElements: HTMLElement[];

  private valuesSerifs: number[];

  private isScaleOfValues: boolean;

  private isCreatedScaleOfValue: boolean;

  private adapter!: IAdapter;

  constructor(element: HTMLElement, emitter: EventEmitter) {
    this.slider = element;
    this.scale = null;
    this.emitter = emitter;
    this.orientation = null;
    this.thumbsValues = [];
    this.shiftToMinValue = 0;
    this.coefficientPoint = 0;
    this.maxValueSlider = 0;
    this.minValueSlider = 0;
    this.stepSlider = 0;
    this.serifsElements = [];
    this.valuesSerifs = [];
    this.isScaleOfValues = true;
    this.isCreatedScaleOfValue = false;
  }

  public initializeScale(state: IModelState, adapter: IAdapter): void {
    this.adapter = adapter;

    if (state.isScaleOfValues) {
      this.isScaleOfValues = true;
    } else if (!state.isScaleOfValues) {
      this.isScaleOfValues = false;
    }

    this.createScale();
  }

  /* function createScale adds scale elements to the main html slider structure */
  private createScale(): void {
    const scale: HTMLElement = createElement(
      'div',
      'slider__scale js-slider__scale',
    );

    const activeRange: HTMLElement = createElement(
      'span',
      'slider__active-range js-slider__active-range',
    );

    if (this.orientation === 'vertical') {
      scale.classList.add('slider__scale_vertical');
    }

    this.slider.append(scale);
    this.scale = scale;
    scale.append(activeRange);

    if (this.isScaleOfValues) {
      this.renderSerifs();
    }
    this.listenScaleClick();
    // this.listenSizeWindow();
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

  private renderSerifs(): void {
    if (this.isScaleOfValues) {
      const max: number = this.maxValueSlider;
      const min: number = this.minValueSlider;

      if (this.isCreatedScaleOfValue) {
        this.removeElementsScaleValueContainer();
      }

      let stepForScaleValue = this.stepSlider;

      const countSteps = (max - min) / this.stepSlider;
      if (countSteps >= 10) {
        stepForScaleValue = this.stepSlider * 2;
      }
      if (countSteps >= 20) {
        stepForScaleValue = this.stepSlider * 3;
      }
      if (countSteps >= 30) {
        stepForScaleValue = this.stepSlider * 5;
      }
      if (countSteps >= 50) {
        stepForScaleValue = this.stepSlider * 10;
      }
      if (countSteps >= 100) {
        stepForScaleValue = this.stepSlider * 20;
      }
      if (countSteps >= 200) {
        stepForScaleValue = this.stepSlider * 30;
      }
      if (countSteps >= 300) {
        stepForScaleValue = this.stepSlider * 40;
      }

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
      if (this.orientation === 'vertical') {
        scaleValueContainer.classList.add(
          'slider__scale-value-container_vertical',
        );
      }
      const htmlFragment = this.createElementsSerifs(stepForScaleValue);
      scaleValueContainer.append(htmlFragment);
      this.slider.append(scaleValueContainer);
      this.isCreatedScaleOfValue = true;

      this.setSefirsInPlaces();
    } else if (!this.isScaleOfValues) {
      this.hideScaleOfValues();
    }
  }

  private createElementsSerifs(stepSerif: number): DocumentFragment {
    const max: number = this.maxValueSlider;
    const min: number = this.minValueSlider;

    const lastStep =
      max - min - ((max - min) / this.stepSlider) * this.stepSlider;

    this.removeElementsSerifs();

    let countSerifs: number = Math.ceil((max - min) / stepSerif) + 1;

    let currentValueSerif: number = min;

    if (lastStep > 0) {
      countSerifs += 1;
    }

    const fractionalPartStep = stepSerif - Math.floor(stepSerif);

    new Array(countSerifs)
      .fill(1)
      .forEach((_element: number, index: number) => {
        if (index === 0) {
          this.valuesSerifs[index] = min;
          currentValueSerif += stepSerif;
          currentValueSerif = Math.ceil(currentValueSerif * 10) / 10;
        } else if (index === countSerifs - 1) {
          this.valuesSerifs[index] = max;
        } else {
          this.valuesSerifs[index] = currentValueSerif;
          currentValueSerif += stepSerif;

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

      if (this.orientation === 'vertical') {
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

  private setSefirsInPlaces(): void {
    if (this.scale !== null) {
      this.coefficientPoint =
        this.scale[this.adapter.offsetLength] /
        (this.maxValueSlider - this.minValueSlider);
    }

    this.shiftToMinValue = this.coefficientPoint * this.minValueSlider;

    const currentThumbIndex = null;

    this.serifsElements.forEach((_element, i) => {
      if (i !== currentThumbIndex) {
        const element = this.serifsElements[i];
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
        element.style[this.adapter.margin] = `${indentLeft}px`;
      }
    });
  }

  private removeElementsSerifs(): void {
    this.valuesSerifs = [];
    this.serifsElements = [];
    const elements: HTMLElement[] = Array.from(
      $(this.slider).find('.js-slider__scale-value'),
    );
    elements.forEach(element => {
      element.remove();
    });
  }

  private removeElementsScaleValueContainer(): void {
    const element: HTMLElement | null = this.slider.querySelector(
      '.js-slider__scale-value-container',
    );
    if (element !== null) {
      element.remove();
    }
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
    this.emitter.emit('view:click-on-scale', event);
  }

  private handleSerifScaleClick(index: number, valuesSerifs: number[]): void {
    this.emitter.emit('view:click-on-serif-scale', index, valuesSerifs);
  }

  // private listenSizeWindow(): void {
  //   window.addEventListener('resize', this.handleWindowResize.bind(this));
  // }

  // private handleWindowResize(): void {
  //   this.setSefirsInPlaces();
  // }

  /* hideTooltip method hides sliders tooltips */
  private hideScaleOfValues(): void {
    const element: HTMLElement | null = this.slider.querySelector(
      '.js-slider__scale-value-container',
    );
    if (element !== null) {
      element.classList.add('slider__scale-value-container_hide');
    }
  }
}
export default Scale;
