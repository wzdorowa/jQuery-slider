import EventEmitter from '../eventEmitter';
import createElement from '../functions/createElement';
import { IModelState } from '../interfaces/iModelState';
import { IThumbsState } from '../interfaces/IThumbsState';
import { IDriver } from '../interfaces/iDriver';
import driverHorizontal from './drivers/driverHorizontal';
import driverVertical from './drivers/driverVertical';
// import { event } from 'jquery';

class Thumbs {
  private slider: HTMLElement;

  private emitter: EventEmitter;

  private state: IThumbsState;

  private driver: IDriver | null;

  constructor(element: HTMLElement, eventEmitter: EventEmitter) {
    this.slider = element;
    this.emitter = eventEmitter;
    this.driver = null;

    this.state = {
      thumbs: [],
      coefficientPoint: 0,
      shiftToMinValue: 0,
      currentThumbIndex: null,
      currentValue: 0,
      currentValueAxis: 0,
      thumbValueAxis: null,
      startValueAxis: 0,
      stopValueAxis: 0,
      valueAxisFromStartMove: 0,
      minValueSlider: 0,
      maxValueSlider: 100,
      stepSlider: 0,
      thumbsCount: 1,
      thumbsValues: [],
      orientation: null,
      target: null,
    };

    this.emitter.makeSubscribe(
      'view:update-thumbs-position',
      (event: MouseEvent) => {
        this.setThumbToNewPosition(event);
      },
    );
  }

  public initializeThumbs(state: IModelState): void {
    if (this.state.minValueSlider !== state.min) {
      this.state.minValueSlider = state.min;
    }
    if (this.state.maxValueSlider !== state.max) {
      this.state.maxValueSlider = state.max;
    }
    if (this.state.stepSlider !== state.step) {
      this.state.stepSlider = state.step;
    }
    if (this.state.thumbsCount !== state.thumbsCount) {
      this.state.thumbsCount = state.thumbsCount;
    }
    if (this.state.thumbsValues !== state.thumbsValues) {
      this.state.thumbsValues = state.thumbsValues;
    }
    if (this.state.orientation !== state.orientation) {
      this.state.orientation = state.orientation;
    }
    if (state.orientation === 'horizontal') {
      this.driver = driverHorizontal;
    }
    if (state.orientation === 'vertical') {
      this.driver = driverVertical;
    }

    this.createThumbs(this.state.thumbsCount);
    this.setValuesThumbs();
    this.listenThumbsEvents();
    this.listenSizeWindow();
  }

  public setConfig(state: IModelState): void {
    if (this.state.minValueSlider !== state.min) {
      this.state.minValueSlider = state.min;
    }
    if (this.state.maxValueSlider !== state.max) {
      this.state.maxValueSlider = state.max;
    }
    if (this.state.stepSlider !== state.step) {
      this.state.stepSlider = state.step;
    }
    if (this.state.thumbsCount !== state.thumbsCount) {
      this.state.thumbsCount = state.thumbsCount;
      this.changeAmountThumbs();
    }
    if (this.state.orientation !== state.orientation) {
      if (state.orientation === 'horizontal') {
        this.driver = driverHorizontal;
      }
      if (state.orientation === 'vertical') {
        this.driver = driverVertical;
      }
      this.state.orientation = state.orientation;
      this.updateThumbsPosition();
    }
    this.updateThumbsPosition();
  }

  /* the CreateSlider function adds sliders to the parent of the slider */
  private createThumbs(thumbsCount: number): void {
    const fragment = document.createDocumentFragment();
    new Array(thumbsCount).fill(1).forEach(() => {
      const thumb: HTMLElement = createElement(
        'div',
        'slider__thumb js-slider__thumb',
      );

      fragment.append(thumb);
      this.state.thumbs.push(thumb);
    });
    this.slider.append(fragment);
  }

  /* changes the number of sliders drawn on the scale */
  private changeAmountThumbs(): void {
    if (this.state.thumbs.length < this.state.thumbsCount) {
      const thumbsCount: number =
        this.state.thumbsCount - this.state.thumbs.length;

      this.createThumbs(thumbsCount);
      this.listenNewThumbsEvents({
        thumbsCount,
      });
    }
    if (this.state.thumbs.length > this.state.thumbsCount) {
      const excessAmount: number =
        this.state.thumbs.length - this.state.thumbsCount;
      const $allThumbs: HTMLElement[] = Array.from(
        $(this.slider).find('.js-slider__thumb'),
      );

      new Array(excessAmount).fill(1).forEach((_element: number, i: number) => {
        this.state.thumbsValues.splice(-1, 1);
        this.state.thumbs.splice(-1, 1);
        const newLength = $allThumbs.length - i;
        $allThumbs[newLength - 1].remove();
      });
    }
  }

  private handleThumbMove(event: MouseEvent): void {
    this.processMove.call(this, event);
  }

  private handleThumbStop(): void {
    this.processStop.call(this);
  }

  /* hangs the 'mousedown' event handler for each created thumb */
  private listenThumbsEvents(): void {
    this.state.thumbs.forEach((element: HTMLElement, i: number) => {
      element.addEventListener(
        'mousedown',
        this.handleThumbStart.bind(this, i),
      );
    });
  }

  private handleThumbStart(index: number, event: MouseEvent): void {
    this.processStart({ event, index });
  }

  /* hangs the 'mousedown' event handler for each added thumb */
  private listenNewThumbsEvents({
    thumbsCount,
  }: {
    thumbsCount: number;
  }): void {
    new Array(thumbsCount).fill(1).forEach((_element: number, i: number) => {
      const index = this.state.thumbs.length - (thumbsCount - i);
      this.state.thumbs[
        this.state.thumbs.length - (thumbsCount - i)
      ].addEventListener('mousedown', this.handleThumbStart.bind(this, index));
    });
  }

  /* listens to the 'resize' event on the slider page */
  private listenSizeWindow(): void {
    window.addEventListener('resize', this.handleWindowResize.bind(this));
  }

  private handleWindowResize(): void {
    this.updateThumbsPosition.call(this);
  }

  /* places thumbs on the slider based on default values */
  private setValuesThumbs(): void {
    if (this.driver !== null) {
      this.driver.setInPlaceThumb(
        this.state.thumbs,
        this.state.currentThumbIndex,
        this.state.coefficientPoint,
        this.state.thumbsValues,
        this.state.shiftToMinValue,
        this.slider,
      );
    }
  }

  /* the method calculates the current value of the thumb */
  private calculateValue(currentValueAxis: number): number {
    if (this.driver !== null) {
      this.state.coefficientPoint = this.driver.calculateCoefficientPoint(
        this.slider,
        this.state.maxValueSlider,
        this.state.minValueSlider,
      );
    }
    let currentValue: number =
      Math.ceil(currentValueAxis / this.state.coefficientPoint) +
      this.state.minValueSlider;

    const multi: number = Math.floor(currentValue / this.state.stepSlider);
    currentValue = this.state.stepSlider * multi;

    return currentValue;
  }

  private calculateValueAxis(value: number): number {
    if (this.driver !== null) {
      this.state.coefficientPoint = this.driver.calculateCoefficientPoint(
        this.slider,
        this.state.maxValueSlider,
        this.state.minValueSlider,
      );
    }
    const multi: number = value / this.state.stepSlider;
    const currentValue: number = multi * this.state.stepSlider;
    const currentValueAxis: number =
      Math.ceil(currentValue * this.state.coefficientPoint) +
      this.state.minValueSlider;

    return currentValueAxis;
  }

  /* the method calculates the value of the position of the thumb on the scale */
  private calculateValueOfPlaceOnScale(i: number): void {
    this.state.currentValue = this.calculateValue(this.state.currentValueAxis);

    if (this.state.thumbsValues[i] !== this.state.currentValue) {
      this.emitter.emit('view:thumbsValues-changed', {
        value: this.state.currentValue,
        index: i,
      });
    }
  }

  /* calculates the potential value of the thumb at the point of click on the scale */
  private calculateValueOfPlaceClickOnScale(currentValueAxis: number): number {
    const currentValue: number | null = this.calculateValue(currentValueAxis);
    if (this.state.currentValue !== null) {
      const halfStep =
        Math.floor(
          (this.state.currentValue + this.state.stepSlider / 2) *
            this.state.coefficientPoint,
        ) - this.state.shiftToMinValue;

      if (this.state.currentValueAxis > halfStep) {
        this.state.currentValue += this.state.stepSlider;
      }
    }
    return currentValue;
  }

  private updateThumbsPosition(): void {
    if (this.driver !== null) {
      this.state.coefficientPoint = this.driver.calculateCoefficientPoint(
        this.slider,
        this.state.maxValueSlider,
        this.state.minValueSlider,
      );

      this.state.shiftToMinValue = Math.ceil(
        this.state.coefficientPoint * this.state.minValueSlider,
      );

      this.driver.setInPlaceThumb(
        this.state.thumbs,
        this.state.currentThumbIndex,
        this.state.coefficientPoint,
        this.state.thumbsValues,
        this.state.shiftToMinValue,
        this.slider,
      );
    }
  }

  private updateThumbPositionOnScale(index: number): void {
    this.calculateValueOfPlaceOnScale(index);
  }

  /* method for setting the closest slider to the clicked position on the slider scale */
  private setThumbToNewPosition(event: MouseEvent): void {
    event.preventDefault();
    if (this.driver !== null) {
      const target: HTMLDivElement = event.target as HTMLDivElement;
      const clickLocationAxis = this.driver.calculateClickLocation(
        event,
        target,
        this.state.shiftToMinValue,
      );

      const currentValue:
        | number
        | null
        | undefined = this.calculateValueOfPlaceClickOnScale(clickLocationAxis);

      let nearestThumbIndex: number | null = null;

      this.state.thumbsValues.forEach((thumbValue: number, i: number) => {
        const isCurrentValue: boolean =
          currentValue !== null && currentValue !== undefined;
        const isFirstThumb: boolean = i === 0 && thumbValue >= currentValue;
        const isLastThumb: boolean =
          i === this.state.thumbsValues.length - 1 &&
          thumbValue <= currentValue;
        const isIntermediateThumb: boolean =
          currentValue >= thumbValue &&
          currentValue <= this.state.thumbsValues[i + 1];

        if (isCurrentValue) {
          if (isFirstThumb) {
            nearestThumbIndex = i;
          } else if (isLastThumb) {
            nearestThumbIndex = i;
          } else if (isIntermediateThumb) {
            const leftSpacing: number = currentValue - thumbValue;
            const rightSpacing: number =
              this.state.thumbsValues[i + 1] - currentValue;

            if (leftSpacing > rightSpacing) {
              nearestThumbIndex = i + 1;
            } else {
              nearestThumbIndex = i;
            }
          }
        }
      });
      if (
        nearestThumbIndex != null &&
        this.state.thumbsValues[nearestThumbIndex] !== this.state.currentValue
      ) {
        this.emitter.emit('view:thumbsValues-changed', {
          value: currentValue,
          index: nearestThumbIndex,
        });
      }
    }
  }

  private processStart({
    event,
    index,
  }: {
    event: MouseEvent;
    index: number;
  }): void {
    this.state.currentThumbIndex = index;

    event.preventDefault();

    const elements: HTMLElement[] = this.state.thumbs;
    this.state.target = elements[index];

    if (this.driver !== null) {
      this.state.currentValueAxis = this.driver.getCurrentValueAxisToProcessStart(
        this.state.target,
      );
      this.state.startValueAxis = this.state.minValueSlider;
      this.state.valueAxisFromStartMove = this.driver.getStartValueAxisToProcessStart(
        event,
        this.state.currentValueAxis,
      );
      this.state.stopValueAxis = this.driver.getMaxValueAxisToProcessStart(
        this.slider,
      );
      this.state.thumbValueAxis = this.calculateValueAxis(
        this.state.thumbsValues[index],
      );
    }
    this.state.currentValue = this.state.thumbsValues[index];

    document.addEventListener('mousemove', this.handleThumbMove.bind(this));
    document.addEventListener('mouseup', this.handleThumbStop.bind(this));
  }

  private processMove(event: MouseEvent): void {
    const elements: HTMLElement[] = this.state.thumbs;
    const index = this.state.currentThumbIndex;

    if (index !== null) {
      if (this.state.thumbValueAxis !== null) {
        if (this.state.target !== null) {
          const isFirstThumb: boolean = index === 0;
          const isIntermediateThumb: boolean =
            index > 0 && index < elements.length - 1;
          const isLastThumb: boolean =
            index === elements.length - 1 && index !== 0;
          const isOneThumb: boolean = elements.length === 1;
          const isMultipleThumbs: boolean = elements.length !== 1;

          if (this.driver !== null) {
            const stepWidth: number = Math.ceil(
              this.state.stepSlider * this.state.coefficientPoint,
            );
            this.state.currentValueAxis = this.driver.getCurrentValueAxisToProcessMove(
              event,
              this.state.valueAxisFromStartMove,
            );

            const nextStepValueAxis: number = this.calculateValueAxis(
              this.state.thumbsValues[index] + this.state.stepSlider,
            );

            const previousStepValueAxis: number = this.calculateValueAxis(
              this.state.thumbsValues[index] - this.state.stepSlider,
            );

            if (isFirstThumb) {
              if (isOneThumb) {
                if (this.state.currentValueAxis > this.state.stopValueAxis) {
                  this.setIndentForTarget(this.state.stopValueAxis, index);
                } else if (
                  this.state.currentValueAxis < this.state.startValueAxis
                ) {
                  this.setIndentForTarget(this.state.startValueAxis, index);
                } else {
                  this.checkPreviousOrNextValueThumb(
                    previousStepValueAxis,
                    nextStepValueAxis,
                    index,
                  );
                }
              }
              if (isMultipleThumbs) {
                const offsetNextSlider: number =
                  this.driver.getElementOffset(elements[index + 1]) - stepWidth;
                if (this.state.currentValueAxis > offsetNextSlider) {
                  this.setIndentForTarget(offsetNextSlider, index);
                } else if (
                  this.state.currentValueAxis < this.state.startValueAxis
                ) {
                  this.setIndentForTarget(this.state.startValueAxis, index);
                } else {
                  this.checkPreviousOrNextValueThumb(
                    previousStepValueAxis,
                    nextStepValueAxis,
                    index,
                  );
                }
              }
            }
            if (isIntermediateThumb) {
              const offsetNextThumb: number =
                this.driver.getElementOffset(elements[index + 1]) - stepWidth;
              const offsetPreviousThumb: number =
                this.driver.getElementOffset(elements[index - 1]) + stepWidth;
              const { currentValueAxis: valueAxis } = this.state;

              if (valueAxis > offsetNextThumb) {
                this.setIndentForTarget(offsetNextThumb, index);
              } else if (valueAxis < offsetPreviousThumb) {
                this.setIndentForTarget(offsetPreviousThumb, index);
              } else {
                this.checkPreviousOrNextValueThumb(
                  previousStepValueAxis,
                  nextStepValueAxis,
                  index,
                );
              }
            }
            if (isLastThumb) {
              const offsetPreviousThumb: number =
                this.driver.getElementOffset(elements[index - 1]) + stepWidth;
              const valueAxis = this.state.currentValueAxis;
              if (valueAxis < offsetPreviousThumb) {
                this.setIndentForTarget(offsetPreviousThumb, index);
              } else if (valueAxis > this.state.stopValueAxis) {
                this.setIndentForTarget(this.state.stopValueAxis, index);
              } else {
                this.checkPreviousOrNextValueThumb(
                  previousStepValueAxis,
                  nextStepValueAxis,
                  index,
                );
              }
            }
          }
        }
      }
    }
  }

  private setIndentForTarget(valueAxis: number, index: number): void {
    if (this.driver !== null) {
      if (this.state.target !== null) {
        this.driver.setIndentForTarget(this.state.target, valueAxis);
      }
    }
    this.state.currentValueAxis = valueAxis;
    this.state.thumbValueAxis = valueAxis;
    this.updateThumbPositionOnScale(index);
  }

  private checkPreviousOrNextValueThumb(
    previousValueAxis: number,
    nextValueAxis: number,
    index: number,
  ): void {
    if (this.driver !== null) {
      if (this.state.target !== null) {
        if (this.state.currentValueAxis > nextValueAxis) {
          this.driver.setIndentForTarget(this.state.target, nextValueAxis);
          this.state.thumbValueAxis = nextValueAxis;
          this.state.currentValueAxis = nextValueAxis;
          this.updateThumbPositionOnScale(index);
        }
        if (this.state.currentValueAxis < previousValueAxis) {
          this.driver.setIndentForTarget(this.state.target, previousValueAxis);
          this.state.currentValueAxis = previousValueAxis;
          this.state.thumbValueAxis = previousValueAxis;
          this.updateThumbPositionOnScale(index);
        }
      }
    }
  }

  private processStop(): void {
    if (this.driver !== null) {
      if (this.state.target !== null) {
        if (this.state.currentValue !== null) {
          this.driver.setIndentForTargetToProcessStop(
            this.state.target,
            this.state.coefficientPoint,
            this.state.currentValue,
            this.state.shiftToMinValue,
          );
        }
      }
    }

    document.removeEventListener('mousemove', this.handleThumbMove.bind(this));
    document.removeEventListener('mouseup', this.handleThumbStop.bind(this));

    this.state.currentValue = null;
    this.state.currentThumbIndex = null;
  }
}
export default Thumbs;
