import EventEmitter from '../EventEmitter';
import { IModelState } from '../interfaces/iModelState';
import { IDriver } from '../interfaces/iDriver';
import driverHorizontal from './drivers/driverHorizontal';
import driverVertical from './drivers/driverVertical';

class Scale {
  private slider: HTMLElement;

  private emitter: EventEmitter;

  private orientation: string | null;

  private driver: IDriver | null;

  private thumbsValues: number[];

  private shiftToMinValue: number;

  private coefficientPoint: number;

  private maxValueSlider: number;

  private minValueSlider: number;

  private stepSlider: number;

  private serifsElements: HTMLElement[];

  private valuesSerifs: number[];

  private isScaleOfValues: boolean;

  private isCreatedScaleOfValue: boolean;

  constructor(element: HTMLElement, emitter: EventEmitter) {
    this.slider = element;
    this.emitter = emitter;
    this.orientation = null;
    this.driver = null;
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

  public initializeScale(state: IModelState): void {
    if (this.orientation !== state.orientation) {
      this.orientation = state.orientation;
    }
    if (state.orientation === 'horizontal') {
      this.driver = driverHorizontal;
    }
    if (state.orientation === 'vertical') {
      this.driver = driverVertical;
    }
    if (state.max !== this.maxValueSlider) {
      this.maxValueSlider = state.max;
    }
    if (state.min !== this.minValueSlider) {
      this.minValueSlider = state.min;
    }
    if (this.thumbsValues !== state.thumbsValues) {
      this.thumbsValues = state.thumbsValues;
    }
    if (this.stepSlider !== state.step) {
      this.stepSlider = state.step;
    }
    if (state.isScaleOfValues) {
      this.isScaleOfValues = true;
    } else if (!state.isScaleOfValues) {
      this.isScaleOfValues = false;
    }

    this.createScale();
  }

  public setConfig(state: IModelState): void {
    if (this.orientation !== state.orientation) {
      if (state.orientation === 'horizontal') {
        this.driver = driverHorizontal;
      }
      if (state.orientation === 'vertical') {
        this.driver = driverVertical;
      }
      this.orientation = state.orientation;
      this.changeOrientation();
    }
    if (this.isScaleOfValues !== state.isScaleOfValues) {
      if (state.isScaleOfValues) {
        this.isScaleOfValues = true;
        this.renderSerifs();
      } else if (!state.isScaleOfValues) {
        this.isScaleOfValues = false;
        this.renderSerifs();
      }
    }
    if (state.max !== this.maxValueSlider) {
      this.maxValueSlider = state.max;
      this.renderSerifs();
    }
    if (state.min !== this.minValueSlider) {
      this.minValueSlider = state.min;
      this.renderSerifs();
    }
    if (this.stepSlider !== state.step) {
      this.stepSlider = state.step;
      this.renderSerifs();
    }
    this.driver?.updateActiveRange(this.slider);
    this.thumbsValues = state.thumbsValues;
  }

  /* function createScale adds scale elements to the main html slider structure */
  private createScale(): void {
    if (this.driver !== null) {
      const scale: HTMLElement = this.driver.createElementScale();
      const activeRange: HTMLElement = this.driver.createElementActiveRange();

      this.slider.append(scale);
      scale.append(activeRange);

      if (this.isScaleOfValues) {
        this.renderSerifs();
      }
    }
    this.listenSizeWindow();
  }

  private renderSerifs(): void {
    if (this.isScaleOfValues) {
      const max: number = this.maxValueSlider;
      const min: number = this.minValueSlider;

      if (this.isCreatedScaleOfValue) {
        this.removeElementsScaleValueContainer();
      }

      if (this.driver !== null) {
        let stepForScaleValue = this.stepSlider;

        if (max - min <= 20) {
          if (max - min > 10) {
            if (this.stepSlider === 1) {
              stepForScaleValue = this.stepSlider * 2;
            }
          }
        } else if (max - min > 20) {
          if (this.stepSlider === 1) {
            stepForScaleValue = this.stepSlider * 5;
          } else if (this.stepSlider === 2) {
            stepForScaleValue = this.stepSlider * 2;
          }
          if (max - min > 50) {
            if (this.stepSlider < 3) {
              stepForScaleValue = this.stepSlider * 5;
            } else if (this.stepSlider === 3) {
              stepForScaleValue = this.stepSlider * 3;
            } else if (this.stepSlider > 3) {
              stepForScaleValue = this.stepSlider * 2;
            }
          }
        }
        const scaleValueContainer = this.driver.createElementScaleValueContainer();
        const htmlFragment = this.createElementsSefifs(stepForScaleValue);
        scaleValueContainer.append(htmlFragment);
        this.slider.append(scaleValueContainer);
        this.isCreatedScaleOfValue = true;
      }
      this.setSefirsInPlaces();
    } else if (!this.isScaleOfValues) {
      this.hideScaleOfValues();
    }
  }

  private createElementsSefifs(stepSerif: number): DocumentFragment {
    const max: number = this.maxValueSlider;
    const min: number = this.minValueSlider;

    this.removeElementsSerifs();

    const countSerifs: number = Math.floor((max - min) / stepSerif + 1);

    let currentValueSerif: number = Math.ceil(min / stepSerif) * stepSerif;
    new Array(countSerifs)
      .fill(1)
      .forEach((_element: number, index: number) => {
        this.valuesSerifs[index] = currentValueSerif;
        currentValueSerif += stepSerif;
      });
    if (
      this.valuesSerifs[this.valuesSerifs.length - 1] !== this.maxValueSlider
    ) {
      this.valuesSerifs[this.valuesSerifs.length - 1] = this.maxValueSlider;
    }

    const htmlFragment = document.createDocumentFragment();
    this.valuesSerifs.forEach(element => {
      if (this.driver !== null) {
        const scaleValue: HTMLElement = this.driver.createElementScaleValue();
        const valueWithNumber: HTMLElement = this.driver.createElementScaleValueWithNumber();
        valueWithNumber.innerHTML = String(element);
        scaleValue.append(valueWithNumber);
        htmlFragment.append(scaleValue);
        this.serifsElements.push(scaleValue);
      }
    });
    this.listenScaleValueEvents();
    return htmlFragment;
  }

  private setSefirsInPlaces(): void {
    if (this.driver !== null) {
      this.calculateShiftToMinValue();
      this.driver.setInPlaceElement({
        elements: this.serifsElements,
        currentThumbIndex: null,
        coefficientPoint: this.coefficientPoint,
        elementsValues: this.valuesSerifs,
        shiftToMinValue: this.shiftToMinValue,
      });
    }
  }

  private removeElementsSerifs(): void {
    this.valuesSerifs = [];
    this.serifsElements = [];
    if (this.driver !== null) {
      const elements = this.driver.searchElementScaleValueToDelete(this.slider);
      elements.forEach(element => {
        element.remove();
      });
    }
  }

  private removeElementsScaleValueContainer(): void {
    if (this.driver !== null) {
      const element = this.driver.searchElementScaleValueBaseContainerToDelete(
        this.slider,
      );
      element.remove();
    }
  }

  private calculateCoefficientPoint(): void {
    if (this.driver !== null) {
      this.coefficientPoint = this.driver.calculateCoefficientPoint(
        this.slider,
        this.maxValueSlider,
        this.minValueSlider,
      );
    }
  }

  private calculateShiftToMinValue(): void {
    this.calculateCoefficientPoint();
    this.shiftToMinValue = Math.ceil(
      this.coefficientPoint * this.minValueSlider,
    );
  }

  private changeOrientation(): void {
    if (this.driver !== null) {
      const activeRangeToRemove: JQuery<HTMLElement> = this.driver.searchElementActiveRangeToDelete(
        this.slider,
      );
      activeRangeToRemove.remove();
      const scaleToDelete: JQuery<HTMLElement> = this.driver.searchElementScaleToDelete(
        this.slider,
      );
      scaleToDelete.remove();
      const scaleValueContainerToRemove: JQuery<HTMLElement> = this.driver.searchElementScaleValueContainerToDelete(
        this.slider,
      );
      scaleValueContainerToRemove.remove();

      this.isCreatedScaleOfValue = false;
      this.createScale();
    }
  }

  private listenScaleValueEvents(): void {
    this.serifsElements.forEach(element => {
      element.addEventListener('click', this.handleScaleClick.bind(this), true);
    });
  }

  private handleScaleClick(event: MouseEvent): void {
    this.emitter.emit('view:click-on-scale', event);
  }

  private listenSizeWindow(): void {
    window.addEventListener('resize', this.handleWindowResize.bind(this));
  }

  private handleWindowResize(): void {
    this.setSefirsInPlaces();
  }

  /* hideTooltip method hides sliders tooltips */
  private hideScaleOfValues(): void {
    if (this.driver !== null) {
      const $allScaleOfValues: HTMLElement = this.driver.searchElementScaleValueBaseContainerToDelete(
        this.slider,
      );
      $allScaleOfValues.classList.add('slider__scale-value-container_hide');
    }
  }
}
export default Scale;