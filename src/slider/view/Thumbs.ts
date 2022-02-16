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
      maxValueAxis: 0,
      valueAxisFromStartMove: 0,
      minValueSlider: 0,
      maxValueSlider: 100,
      stepSlider: 0,
      thumbsCount: 1,
      thumbsValues: [],
      orientation: null,
      target: null,
      lastStep: 0,
    };

    this.emitter.makeSubscribe(
      'view:update-thumbs-position',
      (event: MouseEvent) => {
        this.setThumbToNewPosition(event);
      },
    );
    this.emitter.makeSubscribe(
      'view:update-thumbs-position-on-serif-scale',
      (index: number, valuesSerifs: []) => {
        this.setThumbToPositionOnSerifScale(index, valuesSerifs);
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
      this.state.shiftToMinValue,
    );

    if (this.state.stepSlider < 1) {
      this.state.currentValue = Math.round(this.state.currentValue * 10) / 10;
    } else {
      this.state.currentValue = Math.round(this.state.currentValue);
    }

    if (this.state.thumbsValues[index] !== this.state.currentValue) {
      this.emitter.emit('view:thumbValue-changed', {
        value: this.state.currentValue,
        index,
      });
    }
  }

  private setThumbToPositionOnSerifScale(
    index: number,
    valuesSerifs: number[],
  ): void {
    this.findAndSetTheNearestThumb(valuesSerifs[index]);
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

    const currentValue: number = utilities.calculateValueForClickOnScale(
      clickLocationAxis,
      this.state.coefficientPoint,
      this.state.stepSlider,
    );

    this.findAndSetTheNearestThumb(currentValue);
  }

  private findAndSetTheNearestThumb(currentValue: number) {
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
        this.emitter.emit('view:thumbValue-changed', {
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

      const stepWidth: number =
        this.state.stepSlider * this.state.coefficientPoint;

      this.state.lastStep =
        Math.round(
          ((this.state.maxValueSlider - this.state.minValueSlider) %
            this.state.stepSlider) *
            10,
        ) / 10;

      this.state.startValueAxis = index * stepWidth;

      this.state.valueAxisFromStartMove = this.driver.getStartValueAxisToProcessStart(
        event,
        this.state.currentValueAxis,
      );
      this.state.maxValueAxis = this.driver.getMaxValueAxisToProcessStart(
        this.slider,
      );

      if (this.state.lastStep > 0) {
        if (index < elements.length - 1) {
          this.state.maxValueAxis =
            this.state.maxValueAxis -
            (elements.length - 1 - index) * stepWidth +
            this.state.lastStep * this.state.coefficientPoint;
        }
      } else {
        this.state.maxValueAxis -= (elements.length - 1 - index) * stepWidth;
      }

      this.state.thumbValueAxis = utilities.calculateValueAxis(
        this.state.thumbsValues[index],
        this.state.coefficientPoint,
        this.state.shiftToMinValue,
      );
    }
    this.state.currentValue = this.state.thumbsValues[index];

    document.addEventListener('mousemove', this.handleThumbMove.bind(this));
    document.addEventListener('mouseup', this.handleThumbStop.bind(this));
  }

  private processMove(event: MouseEvent): void {
    const index = this.state.currentThumbIndex;

    const isValid =
      index !== null &&
      this.state.thumbValueAxis !== null &&
      this.state.target !== null &&
      this.driver !== null;

    if (isValid) {
      if (this.state.target !== null) {
        this.state.currentValueAxis = this.driver.getCurrentValueAxisToProcessMove(
          event,
          this.state.valueAxisFromStartMove,
        );

        if (this.state.currentValueAxis > this.state.maxValueAxis) {
          this.state.currentValueAxis = this.state.maxValueAxis;
        }

        if (this.state.currentValueAxis < this.state.startValueAxis) {
          this.state.currentValueAxis = this.state.startValueAxis;
        }

        if (this.state.stepSlider <= 1) {
          this.driver.setIndentForTarget(
            this.state.target,
            this.state.currentValueAxis,
            this.slider,
          );
          this.state.thumbValueAxis = this.state.currentValueAxis;
          this.updateThumbPositionOnScale(index);
        } else {
          const stepWidth: number =
            this.state.stepSlider * this.state.coefficientPoint;

          if (this.state.thumbValueAxis !== null) {
            const previousHalfStep = this.state.thumbValueAxis - stepWidth / 2;
            const nextHalfStep = this.state.thumbValueAxis + stepWidth / 2;
            const lastHalfStep =
              this.state.maxValueAxis -
              (this.state.lastStep * this.state.coefficientPoint) / 2;

            const previousThumbAxisValue =
              this.state.thumbValueAxis - stepWidth;
            const nextThumbAxisValue = this.state.thumbValueAxis + stepWidth;

            if (
              this.state.currentValue === this.state.maxValueSlider &&
              this.state.lastStep > 0
            ) {
              if (this.state.currentValueAxis < lastHalfStep) {
                const penultimateValue =
                  this.state.maxValueAxis -
                  this.state.lastStep * this.state.coefficientPoint;

                this.driver.setIndentForTarget(
                  this.state.target,
                  penultimateValue,
                  this.slider,
                );

                this.state.currentValueAxis = penultimateValue;
                this.state.thumbValueAxis = penultimateValue;
                this.updateThumbPositionOnScale(index);
              }
            } else if (this.state.currentValueAxis < previousHalfStep) {
              this.driver.setIndentForTarget(
                this.state.target,
                previousThumbAxisValue,
                this.slider,
              );
              this.state.currentValueAxis = previousThumbAxisValue;
              this.state.thumbValueAxis = previousThumbAxisValue;
              this.updateThumbPositionOnScale(index);
            } else if (this.state.currentValueAxis > nextHalfStep) {
              this.driver.setIndentForTarget(
                this.state.target,
                nextThumbAxisValue,
                this.slider,
              );
              this.state.currentValueAxis = nextThumbAxisValue;
              this.state.thumbValueAxis = nextThumbAxisValue;
              this.updateThumbPositionOnScale(index);
            } else if (this.state.currentValueAxis > lastHalfStep) {
              this.driver.setIndentForTarget(
                this.state.target,
                this.state.maxValueAxis,
                this.slider,
              );
              this.state.currentValueAxis = this.state.maxValueAxis;
              this.state.thumbValueAxis = this.state.maxValueAxis;
              this.updateThumbPositionOnScale(index);
            }
          }
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
