import EventEmitter from '../EventEmitter';
import { IModelState } from '../interfaces/iModelState';
import { IDriver } from '../interfaces/iDriver';
import driverHorizontal from './drivers/driverHorizontal';
import driverVertical from './drivers/driverVertical';

class Scale {
  private slider: HTMLElement;

  private emitter: EventEmitter;

  private scale!: HTMLElement;

  private orientation: string | null;

  private driver: IDriver | null;

  private thumbsValues: number[];

  private shiftToMinValue: number;

  private coefficientPoint: number;

  private maxValueSlider: number;

  private minValueSlider: number;

  private serifsElements: HTMLElement[];

  private valuesSerifs: number[];

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
    this.serifsElements = [];
    this.valuesSerifs = [];
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

    this.createScale();
    this.listenScaleEvents();
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
    if (state.max !== this.maxValueSlider) {
      this.maxValueSlider = state.max;
      this.renderSerifs();
    }
    if (state.min !== this.minValueSlider) {
      this.minValueSlider = state.min;
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
      // const scaleValueContainer: HTMLElement = this.driver.createElementScaleValueContainer();

      this.slider.append(scale);
      scale.append(activeRange);
      // this.slider.append(scaleValueContainer);

      this.scale = scale;
      // this.scaleValue = scaleValueContainer;
      this.renderSerifs();
    }
    this.listenSizeWindow();
  }

  private renderSerifs() {
    const max: number = this.maxValueSlider;
    const min: number = this.minValueSlider;

    if (max - min > 20) {
      if (max - min <= 100) {
        const htmlFragment = this.createElementsSefifs({
          stepSerif: 10,
          isValueWithNumber: false,
        });
        this.scale.append(htmlFragment);
        this.setSefirsInPlaces();
      }
      if (max - min > 100) {
        const htmlFragment = this.createElementsSefifs({
          stepSerif: 20,
          isValueWithNumber: false,
        });
        this.scale.append(htmlFragment);
        this.setSefirsInPlaces();
      }
    }
    if (max - min <= 20) {
      if (max - min <= 10) {
        const htmlFragment = this.createElementsSefifs({
          stepSerif: 1,
          isValueWithNumber: true,
        });
        this.scale.append(htmlFragment);
        this.setSefirsInPlaces();
      } else {
        const htmlFragment = this.createElementsSefifs({
          stepSerif: 5,
          isValueWithNumber: true,
        });
        this.scale.append(htmlFragment);
        this.setSefirsInPlaces();
      }
    }
  }

  private createElementsSefifs({
    stepSerif,
    isValueWithNumber,
  }: {
    stepSerif: number;
    isValueWithNumber: boolean;
  }): DocumentFragment {
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

    const htmlFragment = document.createDocumentFragment();
    if (isValueWithNumber) {
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
    } else {
      this.valuesSerifs.forEach(() => {
        if (this.driver !== null) {
          const scaleValue: HTMLElement = this.driver.createElementScaleValue();
          htmlFragment.append(scaleValue);
          this.serifsElements.push(scaleValue);
        }
      });
    }
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

  private removeElementsSerifs() {
    this.valuesSerifs = [];
    this.serifsElements = [];
    if (this.driver !== null) {
      const elements = this.driver.searchElementScaleValueToDelete(this.slider);
      elements.forEach(element => {
        element.remove();
      });
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

      this.createScale();
      this.listenScaleEvents();
    }
  }

  private listenScaleEvents(): void {
    this.scale.addEventListener('click', this.handleScaleClick.bind(this));
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
}
export default Scale;
