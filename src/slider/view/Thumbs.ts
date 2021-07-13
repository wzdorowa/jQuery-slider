import EventEmitter from '../EventEmitter';
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
      this.changeCountThumbs();
    }
    if (this.state.thumbsValues !== state.thumbsValues) {
      this.state.thumbsValues = state.thumbsValues;
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
    const htmlFragment = document.createDocumentFragment();
    new Array(thumbsCount).fill(1).forEach(() => {
      const thumb: HTMLElement = createElement(
        'div',
        'slider__thumb js-slider__thumb',
      );

      htmlFragment.append(thumb);
      this.state.thumbs.push(thumb);
    });
    this.slider.append(htmlFragment);
  }

  /* changes the number of sliders drawn on the scale */
  private changeCountThumbs(): void {
    if (this.state.thumbs.length < this.state.thumbsCount) {
      const thumbsCount: number =
        this.state.thumbsCount - this.state.thumbs.length;

      this.createThumbs(thumbsCount);
      this.listenNewThumbsEvents(thumbsCount);
    }
    if (this.state.thumbs.length > this.state.thumbsCount) {
      const excessCount: number =
        this.state.thumbs.length - this.state.thumbsCount;
      const $allThumbs: HTMLElement[] = Array.from(
        $(this.slider).find('.js-slider__thumb'),
      );

      new Array(excessCount).fill(1).forEach((_element: number, i: number) => {
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
    this.processStart(event, index);
  }

  /* hangs the 'mousedown' event handler for each added thumb */
  private listenNewThumbsEvents(thumbsCount: number): void {
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
      this.calculateCoefficientPoint();
      this.calculateShiftToMinValue();
      this.driver.setInPlaceThumb({
        elements: this.state.thumbs,
        currentThumbIndex: this.state.currentThumbIndex,
        coefficientPoint: this.state.coefficientPoint,
        thumbsValues: this.state.thumbsValues,
        shiftToMinValue: this.state.shiftToMinValue,
        slider: this.slider,
      });
    }
  }

  /* the method calculates the current value of the thumb */
  private calculateValue(currentValueAxis: number): number {
    this.calculateCoefficientPoint();
    let currentValue: number =
      Math.ceil(currentValueAxis / this.state.coefficientPoint) +
      this.state.minValueSlider;

    const intermediateValue: number = Math.floor(
      currentValue / this.state.stepSlider,
    );
    currentValue = this.state.stepSlider * intermediateValue;

    return currentValue;
  }

  private calculateValueAxis(value: number): number {
    this.calculateShiftToMinValue();
    this.calculateCoefficientPoint();

    const intermediateValue: number = value / this.state.stepSlider;
    const currentValue: number = intermediateValue * this.state.stepSlider;
    const currentValueAxis: number =
      Math.ceil(currentValue * this.state.coefficientPoint) -
      this.state.shiftToMinValue;

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
    const currentValue: number = this.calculateValue(currentValueAxis);
    this.calculateShiftToMinValue();

    return currentValue;
  }

  private calculateShiftToMinValue(): void {
    this.calculateCoefficientPoint();
    this.state.shiftToMinValue = Math.ceil(
      this.state.coefficientPoint * this.state.minValueSlider,
    );
  }

  private calculateCoefficientPoint(): void {
    if (this.driver !== null) {
      this.state.coefficientPoint = this.driver.calculateCoefficientPoint(
        this.slider,
        this.state.maxValueSlider,
        this.state.minValueSlider,
      );
    }
  }

  private updateThumbsPosition(): void {
    this.calculateCoefficientPoint();
    this.calculateShiftToMinValue();

    if (this.driver !== null) {
      this.driver.setInPlaceThumb({
        elements: this.state.thumbs,
        currentThumbIndex: this.state.currentThumbIndex,
        coefficientPoint: this.state.coefficientPoint,
        thumbsValues: this.state.thumbsValues,
        shiftToMinValue: this.state.shiftToMinValue,
        slider: this.slider,
      });
    }
  }

  private updateThumbPositionOnScale(index: number): void {
    this.calculateValueOfPlaceOnScale(index);
  }

  /* method for setting the closest slider to the clicked position on the slider scale */
  private setThumbToNewPosition(event: MouseEvent): void {
    event.preventDefault();
    if (this.driver !== null) {
      this.calculateShiftToMinValue();
      const target: HTMLDivElement = event.target as HTMLDivElement;
      const targetClassList = target.classList;

      let clickLocationAxis = 0;
      if (targetClassList.contains('js-slider__scale')) {
        clickLocationAxis = this.driver.calculateClickLocation(
          event,
          target,
          this.state.shiftToMinValue,
        );
      } else if (targetClassList.contains('js-slider__vertical-scale')) {
        clickLocationAxis = this.driver.calculateClickLocation(
          event,
          target,
          this.state.shiftToMinValue,
        );
      } else if (targetClassList.contains('js-slider__scale-value')) {
        clickLocationAxis = this.driver.calculateClickLocationOnScaleValue(
          event,
          this.state.shiftToMinValue,
          this.slider,
        );
      } else if (targetClassList.contains('js-slider__vertical-scale-value')) {
        clickLocationAxis = this.driver.calculateClickLocationOnScaleValue(
          event,
          this.state.shiftToMinValue,
          this.slider,
        );
      } else if (
        targetClassList.contains('js-slider__scale-value-with-number')
      ) {
        clickLocationAxis = this.driver.calculateClickLocationOnScaleValue(
          event,
          this.state.shiftToMinValue,
          this.slider,
        );
      } else if (
        targetClassList.contains('js-slider__vertical-scale-value-with-number')
      ) {
        clickLocationAxis = this.driver.calculateClickLocationOnScaleValue(
          event,
          this.state.shiftToMinValue,
          this.slider,
        );
      }
      const currentValue: number = this.calculateValueOfPlaceClickOnScale(
        clickLocationAxis,
      );

      const leftSpacing: number[] = [];
      const rightSpacing: number[] = [];

      this.state.thumbsValues.forEach((thumbValue: number) => {
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
        if (currentSpacingValue !== this.state.currentValue) {
          this.emitter.emit('view:thumbsValues-changed', {
            value: currentValue,
            index: currentThumbIndex,
          });
        }
      }
    }
  }

  private processStart(event: MouseEvent, index: number): void {
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
            this.calculateCoefficientPoint();
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
                } else if (this.state.stepSlider === 1) {
                  this.setIndentForTarget(this.state.currentValueAxis, index);
                } else {
                  this.checkPreviousOrNextValueThumb(
                    previousStepValueAxis,
                    nextStepValueAxis,
                    index,
                  );
                }
              }
              if (isMultipleThumbs) {
                const offsetNextThumb: number = this.driver.getOffsetNextThumb(
                  elements[index + 1],
                  stepWidth,
                );
                if (this.state.currentValueAxis > offsetNextThumb) {
                  this.setIndentForTarget(offsetNextThumb, index);
                } else if (
                  this.state.currentValueAxis < this.state.startValueAxis
                ) {
                  this.setIndentForTarget(this.state.startValueAxis, index);
                } else if (this.state.stepSlider === 1) {
                  this.setIndentForTarget(this.state.currentValueAxis, index);
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
              const offsetNextThumb: number = this.driver.getOffsetNextThumb(
                elements[index + 1],
                stepWidth,
              );
              const offsetPreviousThumb: number = this.driver.getOffsetPreviousThumb(
                elements[index - 1],
                stepWidth,
              );

              if (this.state.currentValueAxis > offsetNextThumb) {
                this.setIndentForTarget(offsetNextThumb, index);
              } else if (this.state.currentValueAxis < offsetPreviousThumb) {
                this.setIndentForTarget(offsetPreviousThumb, index);
              } else if (this.state.stepSlider === 1) {
                this.setIndentForTarget(this.state.currentValueAxis, index);
              } else {
                this.checkPreviousOrNextValueThumb(
                  previousStepValueAxis,
                  nextStepValueAxis,
                  index,
                );
              }
            }
            if (isLastThumb) {
              const offsetPreviousThumb: number = this.driver.getOffsetPreviousThumb(
                elements[index - 1],
                stepWidth,
              );

              if (this.state.currentValueAxis < offsetPreviousThumb) {
                this.setIndentForTarget(offsetPreviousThumb, index);
              } else if (
                this.state.currentValueAxis > this.state.stopValueAxis
              ) {
                this.setIndentForTarget(this.state.stopValueAxis, index);
              } else if (this.state.stepSlider === 1) {
                this.setIndentForTarget(this.state.currentValueAxis, index);
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
        this.driver.setIndentForTarget(
          this.state.target,
          valueAxis,
          this.slider,
        );
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
          this.driver.setIndentForTarget(
            this.state.target,
            nextValueAxis,
            this.slider,
          );
          this.state.thumbValueAxis = nextValueAxis;
          this.state.currentValueAxis = nextValueAxis;
          this.updateThumbPositionOnScale(index);
        }
        if (this.state.currentValueAxis < previousValueAxis) {
          this.driver.setIndentForTarget(
            this.state.target,
            previousValueAxis,
            this.slider,
          );
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
          this.calculateCoefficientPoint();
          this.calculateShiftToMinValue();
          this.driver.setIndentForTargetToProcessStop({
            target: this.state.target,
            coefficientPoint: this.state.coefficientPoint,
            currentValue: this.state.currentValue,
            shiftToMinValue: this.state.shiftToMinValue,
            slider: this.slider,
          });
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