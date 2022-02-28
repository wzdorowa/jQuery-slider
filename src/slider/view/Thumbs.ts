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
      valueAxisFromStartMove: 0,
      thumbValueAxis: null,
      startValueAxis: 0,
      maxValueAxis: 0,
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
        this.findAndSetTheNearestThumb(valuesSerifs[index]);
      },
    );
  }

  public initializeThumbs(state: IModelState): void {
    if (state.orientation === 'horizontal') {
      this.driver = driverHorizontal;
    }
    if (state.orientation === 'vertical') {
      this.driver = driverVertical;
    }

    this.state.coefficientPoint = this.driver.calculateCoefficientPoint(
      this.slider,
      state.max,
      state.min,
    );
    this.state.shiftToMinValue = utilities.calculateShiftToMinValue(
      this.state.coefficientPoint,
      state.min,
    );

    this.createThumbs(state.thumbsCount);
    this.listenThumbsEvents();
    this.setValuesThumbs(null);
    this.listenSizeWindow();
  }

  /* the CreateSlider function adds sliders to the parent of the slider */
  private createThumbs(thumbsCount: number): void {
    const htmlFragment = document.createDocumentFragment();
    new Array(thumbsCount).fill(1).forEach(() => {
      const thumb: HTMLElement = createElement(
        'div',
        'slider__thumb js-slider__thumb',
      );

      this.state.thumbs.push(thumb);
      htmlFragment.append(thumb);
    });
    this.slider.append(htmlFragment);
  }

  private handleThumbMove(event: MouseEvent, index: number): void {
    this.processMove(event, index);
  }

  private handleThumbStop(currentValue: number): void {
    this.processStop.call(this, currentValue);
  }

  /* hangs the 'mousedown' event handler for each created thumb */
  private listenThumbsEvents(state: IModelState): void {
    this.state.thumbs.forEach((element: HTMLElement, i: number) => {
      element.addEventListener(
        'mousedown',
        this.handleThumbStart.bind(this, i, state),
      );
    });
  }

  private handleThumbStart(
    index: number,
    event: MouseEvent,
    state: IModelState,
  ): void {
    this.processStart(event, index, state);
  }

  /* listens to the 'resize' event on the slider page */
  private listenSizeWindow(): void {
    window.addEventListener('resize', this.handleWindowResize.bind(this));
  }

  private handleWindowResize(): void {
    this.setValuesThumbs.call(this, null);
  }

  /* places thumbs on the slider based on default values */
  private setValuesThumbs(index: number | null): void {
    if (this.driver !== null) {
      this.driver.setInPlaceThumb({
        elements: this.state.thumbs,
        currentThumbIndex: index,
        coefficientPoint: this.state.coefficientPoint,
        thumbsValues: this.state.thumbsValues,
        shiftToMinValue: this.state.shiftToMinValue,
        slider: this.slider,
      });
    }
  }

  private updateThumbPositionOnScale(
    index: number,
    currentValueAxis: number,
    step: number,
    thumbsValues: number[],
  ): void {
    let currentValue = utilities.calculateValue(
      currentValueAxis,
      this.state.coefficientPoint,
      this.state.shiftToMinValue,
    );

    if (step < 1) {
      currentValue = Math.round(currentValue * 10) / 10;
    } else {
      currentValue = Math.round(currentValue);
    }

    if (thumbsValues[index] !== currentValue) {
      this.emitter.emit('view:thumbValue-changed', {
        value: currentValue,
        index,
      });
    }
  }

  /* method for setting the closest slider to the clicked position on the slider scale */
  private setThumbToNewPosition(event: MouseEvent): void {
    event.preventDefault();

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
      if (currentSpacingValue !== currentValue) {
        this.emitter.emit('view:thumbValue-changed', {
          value: currentValue,
          index: currentThumbIndex,
        });
      }
    }
  }

  private processStart(
    event: MouseEvent,
    index: number,
    state: IModelState,
  ): void {
    event.preventDefault();

    const elements: HTMLElement[] = this.state.thumbs;
    this.state.target = elements[index];

    let currentValueAxis;

    if (this.driver !== null) {
      currentValueAxis = this.driver.getCurrentValueAxisToProcessStart(
        this.state.target,
      );

      const stepWidth: number = state.step * this.state.coefficientPoint;

      this.state.lastStep =
        Math.round(((state.max - state.min) % state.step) * 10) / 10;

      this.state.startValueAxis = index * stepWidth;

      this.state.valueAxisFromStartMove = this.driver.getStartValueAxisToProcessStart(
        event,
        currentValueAxis,
      );
      this.state.maxValueAxis = this.driver.getMaxValueAxisToProcessStart(
        this.slider,
      );

      if (this.state.lastStep > 0) {
        if (index < elements.length - 1) {
          this.state.maxValueAxis =
            this.state.maxValueAxis -
            (elements.length - 2 - index) * stepWidth -
            this.state.lastStep * this.state.coefficientPoint;
        }
      } else {
        this.state.maxValueAxis -= (elements.length - 1 - index) * stepWidth;
      }

      this.state.thumbValueAxis = utilities.calculateValueAxis(
        state.thumbsValues[index],
        this.state.coefficientPoint,
        this.state.shiftToMinValue,
      );
    }

    document.addEventListener(
      'mousemove',
      this.handleThumbMove.bind(this, index, state),
    );
    document.addEventListener(
      'mouseup',
      this.handleThumbStop.bind(this, currentValue),
    );
  }

  private processMove(
    event: MouseEvent,
    index: number,
    state: IModelState,
  ): void {
    const isValid =
      index !== null &&
      this.state.thumbValueAxis !== null &&
      this.state.target !== null &&
      this.driver !== null;

    let currentValueAxis;

    if (isValid) {
      const currentValue = state.thumbsValues[index];

      if (this.state.target !== null) {
        currentValueAxis = this.driver.getCurrentValueAxisToProcessMove(
          event,
          this.state.valueAxisFromStartMove,
        );

        if (currentValueAxis > this.state.maxValueAxis) {
          currentValueAxis = this.state.maxValueAxis;
        }

        if (currentValueAxis < this.state.startValueAxis) {
          currentValueAxis = this.state.startValueAxis;
        }

        if (state.step <= 1) {
          this.driver.setIndentForTarget(
            this.state.target,
            currentValueAxis,
            this.slider,
          );
          this.state.thumbValueAxis = currentValueAxis;
          if (index !== null) {
            this.updateThumbPositionOnScale(
              index,
              currentValueAxis,
              state.step,
              state.thumbsValues,
            );
          }
        } else {
          const stepWidth: number = state.step * this.state.coefficientPoint;

          if (this.state.thumbValueAxis !== null) {
            const previousHalfStep = this.state.thumbValueAxis - stepWidth / 2;
            const nextHalfStep = this.state.thumbValueAxis + stepWidth / 2;
            const lastHalfStep =
              this.state.maxValueAxis -
              (this.state.lastStep * this.state.coefficientPoint) / 2;

            const previousThumbAxisValue =
              this.state.thumbValueAxis - stepWidth;
            const nextThumbAxisValue = this.state.thumbValueAxis + stepWidth;

            if (currentValue === state.max && this.state.lastStep > 0) {
              if (currentValueAxis < lastHalfStep) {
                const penultimateValue =
                  this.state.maxValueAxis -
                  this.state.lastStep * this.state.coefficientPoint;

                this.driver.setIndentForTarget(
                  this.state.target,
                  penultimateValue,
                  this.slider,
                );

                currentValueAxis = penultimateValue;
                this.state.thumbValueAxis = penultimateValue;
                if (index !== null) {
                  this.updateThumbPositionOnScale(
                    index,
                    currentValueAxis,
                    state.step,
                    state.thumbsValues,
                  );
                }
              }
            } else if (currentValueAxis < previousHalfStep) {
              this.driver.setIndentForTarget(
                this.state.target,
                previousThumbAxisValue,
                this.slider,
              );
              currentValueAxis = previousThumbAxisValue;
              this.state.thumbValueAxis = previousThumbAxisValue;
              if (index !== null) {
                this.updateThumbPositionOnScale(
                  index,
                  currentValueAxis,
                  state.step,
                  state.thumbsValues,
                );
              }
            } else if (currentValueAxis > nextHalfStep) {
              this.driver.setIndentForTarget(
                this.state.target,
                nextThumbAxisValue,
                this.slider,
              );
              currentValueAxis = nextThumbAxisValue;
              this.state.thumbValueAxis = nextThumbAxisValue;
              if (index !== null) {
                this.updateThumbPositionOnScale(
                  index,
                  currentValueAxis,
                  state.step,
                  state.thumbsValues,
                );
              }
            } else if (currentValueAxis > lastHalfStep) {
              this.driver.setIndentForTarget(
                this.state.target,
                this.state.maxValueAxis,
                this.slider,
              );
              currentValueAxis = this.state.maxValueAxis;
              this.state.thumbValueAxis = this.state.maxValueAxis;
              if (index !== null) {
                this.updateThumbPositionOnScale(
                  index,
                  currentValueAxis,
                  state.step,
                  state.thumbsValues,
                );
              }
            }
          }
        }
      }
    }
  }

  private processStop(currentValue: number): void {
    if (this.driver !== null) {
      if (this.state.target !== null) {
        if (currentValue !== null) {
          this.driver.setIndentForTargetToProcessStop({
            target: this.state.target,
            coefficientPoint: this.state.coefficientPoint,
            currentValue,
            shiftToMinValue: this.state.shiftToMinValue,
            slider: this.slider,
          });
        }
      }
    }

    document.removeEventListener('mousemove', this.handleThumbMove.bind(this));
    document.removeEventListener('mouseup', this.handleThumbStop.bind(this));
  }
}
export default Thumbs;
