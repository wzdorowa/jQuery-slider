import EventEmitter from '../EventEmitter';
import createElement from '../functions/createElement';
import { IModelState } from '../interfaces/iModelState';
import { IThumbsState } from '../interfaces/IThumbsState';
import { IDriver } from '../interfaces/iDriver';
import driverHorizontal from './drivers/driverHorizontal';
import driverVertical from './drivers/driverVertical';
import utilities from './utilities/utilities';

class Thumbs {
  private slider: HTMLElement;

  private emitter: EventEmitter;

  private state: IThumbsState;

  private driver: IDriver;

  constructor(element: HTMLElement, eventEmitter: EventEmitter) {
    this.slider = element;
    this.emitter = eventEmitter;
    this.driver = driverHorizontal;

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

    this.state.coefficientPoint = this.driver.calculateCoefficientPoint(
      this.slider,
      this.state.maxValueSlider,
      this.state.minValueSlider,
    );
    this.state.shiftToMinValue = utilities.calculateShiftToMinValue(
      this.state.coefficientPoint,
      this.state.minValueSlider,
    );
    this.createThumbs(this.state.thumbsCount);
    this.setValuesThumbs();
    this.listenThumbsEvents();
    this.listenSizeWindow();
  }

  public setConfig(state: IModelState): void {
    if (this.state.minValueSlider !== state.min) {
      this.state.minValueSlider = state.min;
      this.state.coefficientPoint = this.driver.calculateCoefficientPoint(
        this.slider,
        this.state.maxValueSlider,
        this.state.minValueSlider,
      );
    }
    if (this.state.maxValueSlider !== state.max) {
      this.state.maxValueSlider = state.max;
      this.state.coefficientPoint = this.driver.calculateCoefficientPoint(
        this.slider,
        this.state.maxValueSlider,
        this.state.minValueSlider,
      );
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
        this.state.coefficientPoint = this.driver.calculateCoefficientPoint(
          this.slider,
          this.state.maxValueSlider,
          this.state.minValueSlider,
        );
      }
      if (state.orientation === 'vertical') {
        this.driver = driverVertical;
        this.state.coefficientPoint = this.driver.calculateCoefficientPoint(
          this.slider,
          this.state.maxValueSlider,
          this.state.minValueSlider,
        );
      }
      this.state.orientation = state.orientation;
      this.state.shiftToMinValue = utilities.calculateShiftToMinValue(
        this.state.coefficientPoint,
        this.state.minValueSlider,
      );
      this.updateThumbsPosition();
    }
    this.state.shiftToMinValue = utilities.calculateShiftToMinValue(
      this.state.coefficientPoint,
      this.state.minValueSlider,
    );
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
        // this.state.thumbsValues.splice(-1, 1);
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
      // this.calculateShiftToMinValue();
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

  private updateThumbsPosition(): void {
    this.state.coefficientPoint = this.driver.calculateCoefficientPoint(
      this.slider,
      this.state.maxValueSlider,
      this.state.minValueSlider,
    );
    this.state.shiftToMinValue = utilities.calculateShiftToMinValue(
      this.state.coefficientPoint,
      this.state.minValueSlider,
    );

    this.driver.setInPlaceThumb({
      elements: this.state.thumbs,
      currentThumbIndex: this.state.currentThumbIndex,
      coefficientPoint: this.state.coefficientPoint,
      thumbsValues: this.state.thumbsValues,
      shiftToMinValue: this.state.shiftToMinValue,
      slider: this.slider,
    });
  }

  private updateThumbPositionOnScale(index: number): void {
    this.state.currentValue = utilities.calculateValue(
      this.state.currentValueAxis,
      this.state.coefficientPoint,
      this.state.stepSlider,
      this.state.shiftToMinValue,
    );

    if (this.state.thumbsValues[index] !== this.state.currentValue) {
      this.emitter.emit('view:thumbsValues-changed', {
        value: this.state.currentValue,
        index,
      });
    }
  }

  /* method for setting the closest slider to the clicked position on the slider scale */
  private setThumbToNewPosition(event: MouseEvent): void {
    event.preventDefault();

    this.state.coefficientPoint = this.driver.calculateCoefficientPoint(
      this.slider,
      this.state.maxValueSlider,
      this.state.minValueSlider,
    );

    this.state.shiftToMinValue = utilities.calculateShiftToMinValue(
      this.state.coefficientPoint,
      this.state.minValueSlider,
    );

    let clickLocationAxis = 0;

    clickLocationAxis = this.driver.calculateClickLocationOnScaleValue(
      event,
      this.state.shiftToMinValue,
      this.slider,
    );

    const currentValue: number = utilities.calculateValue(
      clickLocationAxis,
      this.state.coefficientPoint,
      this.state.stepSlider,
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

  private processStart(event: MouseEvent, index: number): void {
    this.state.currentThumbIndex = index;

    event.preventDefault();

    const elements: HTMLElement[] = this.state.thumbs;
    this.state.target = elements[index];

    if (this.driver !== null) {
      this.state.currentValueAxis = this.driver.getCurrentValueAxisToProcessStart(
        this.state.target,
      );
      this.state.startValueAxis = 0;

      this.state.valueAxisFromStartMove = this.driver.getStartValueAxisToProcessStart(
        event,
        this.state.currentValueAxis,
      );
      this.state.stopValueAxis = this.driver.getMaxValueAxisToProcessStart(
        this.slider,
      );

      this.state.thumbValueAxis = utilities.calculateValueAxis(
        this.state.thumbsValues[index],
        this.state.stepSlider,
        this.state.coefficientPoint,
        this.state.shiftToMinValue,
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

            const nextStepValueAxis: number = utilities.calculateValueAxis(
              this.state.thumbsValues[index] + this.state.stepSlider,
              this.state.stepSlider,
              this.state.coefficientPoint,
              this.state.shiftToMinValue,
            );

            const previousStepValueAxis: number = utilities.calculateValueAxis(
              this.state.thumbsValues[index] - this.state.stepSlider,
              this.state.stepSlider,
              this.state.coefficientPoint,
              this.state.shiftToMinValue,
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
