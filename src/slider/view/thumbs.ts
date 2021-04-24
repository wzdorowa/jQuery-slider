import EventEmitter from '../eventEmitter';
import createElement from '../functions/createElement';
import { IModelState } from '../interfaces/iModelState';
import { IThumbsState } from '../interfaces/IThumbsState';
import { IDriver } from '../interfaces/iDriver';
import { event } from 'jquery';

class Thumbs {
  private slider: HTMLElement;

  private emitter: EventEmitter;

  public state: IThumbsState;

  public driver: IDriver | null;

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
      maxValueAxis: 0,
      minValueSlider: 0,
      maxValueSlider: 100,
      stepSlider: 0,
      thumbsCount: 1,
      thumbsValues: [],
      //modelState: null,
      orientation: null,
      target: null,
      activeRange: null,
      scale: null,
      setCurrentTooltipValue: null,
    };
  }

  initializeThumbs(state: IModelState) {
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

    this.createThumbs(this.state.thumbsCount);
    this.setValuesThumbs();
    this.listenThumbsEvents();
    this.listenSizeWindow();
  }

  setConfig(state: IModelState) {
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
    if (this.state.orientation !== state.orientation) {
      this.state.orientation = state.orientation;
    }
  }

  /* the CreateSlider function adds sliders to the parent of the slider */
  createThumbs(thumbsCount: number): void {
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
  // переписать метод без внесения изменений в стейт, так как расчеты там уже внесены
  changeAmountThumbs({
    modelState,
    driver,
    scale,
    activeRange,
    setCurrentTooltipValue,
  }: {
    modelState: IModelState;
    driver: IDriver;
    scale: HTMLElement;
    activeRange: HTMLElement;
    setCurrentTooltipValue: (modelState: IModelState, i: number) => void;
  }): void {
    if (this.state.thumbs.length < modelState.thumbsCount) {
      const thumbsCount: number =
        modelState.thumbsCount - this.state.thumbs.length;

      this.createThumbs(thumbsCount);
      this.listenNewThumbsEvents({
        thumbsCount,
        modelState,
        driver,
        scale,
        activeRange,
        setCurrentTooltipValue,
      });
      // this.setValueToNewThumb(thumbsCount, modelState);
    }
    if (this.state.thumbs.length > modelState.thumbsCount) {
      const excessAmount: number =
        this.state.thumbs.length - modelState.thumbsCount;
      const $allThumbs: HTMLElement[] = Array.from(
        $(this.slider).find('.js-slider__thumb'),
      );

      new Array(excessAmount).fill(1).forEach((_element: number, i: number) => {
        modelState.thumbsValues.splice(-1, 1);
        this.state.thumbs.splice(-1, 1);
        const newLength = $allThumbs.length - i;
        $allThumbs[newLength - 1].remove();
      });
      this.emitter.emit('view:amountThumbs-changed', modelState.thumbsValues);
    }
  }

  handleThumbMove(event: MouseEvent): void {
    this.processMove.call(this, event);
  }

  handleThumbStop(event: MouseEvent): void {
    this.processStop.call(this, event);
  }

  /* hangs the 'mousedown' event handler for each created thumb */
  listenThumbsEvents(): void {
    this.driver = driver;
    this.state.thumbs.forEach((element: HTMLElement, i: number) => {
      element.addEventListener(
        'mousedown',
        this.handleThumbStart.bind(this, i),
      );
    });
  }

  handleThumbStart(index: number, event: MouseEvent): void {
    this.processStart({ event, index });
  }

  /* hangs the 'mousedown' event handler for each added thumb */
  listenNewThumbsEvents({
    thumbsCount,
    modelState,
    driver,
    scale,
    activeRange,
    setCurrentTooltipValue,
  }: {
    thumbsCount: number;
    modelState: IModelState;
    driver: IDriver;
    scale: HTMLElement;
    activeRange: HTMLElement;
    setCurrentTooltipValue: (modelState: IModelState, i: number) => void;
  }): void {
    this.driver = driver;
    new Array(thumbsCount).fill(1).forEach((_element: number, i: number) => {
      const index = this.state.thumbs.length - (thumbsCount - i);
      this.state.thumbs[
        this.state.thumbs.length - (thumbsCount - i)
      ].addEventListener('mousedown', this.handleThumbStart.bind(this, i));
    });
  }

  /* listens to the 'resize' event on the slider page */
  listenSizeWindow(): void {
    this.state.scale = scale;
    this.state.activeRange = activeRange;
    this.state.modelState = modelState;
    this.driver = driver;

    window.addEventListener('resize', this.handleWindowResize.bind(this));
  }

  handleWindowResize(): void {
    this.setNewValuesForThumbs.call(this);
  }

  /* sets a value for each added thumb */
  // setValueToNewThumb(amount: number, modelState: IModelState): void {
  //   const currentState = { ...modelState };
  //   if (this.state.thumbs.length === currentState.thumbsValues.length) {
  //     return;
  //   }
  //   new Array(amount).fill(1).forEach((_element: number, i: number) => {
  //     currentState.thumbsValues[this.state.thumbs.length - (amount - i)] =
  //       currentState.thumbsValues[this.state.thumbs.length - 1 - (amount - i)] +
  //       currentState.step;
  //   });
  //   this.emitter.emit('view:amountThumbs-changed', currentState.thumbsValues);
  // }

  /* places thumbs on the slider based on default values */
  setValuesThumbs(): void {
    driver.setInPlaceThumb(this.state.thumbs, modelState, activeRange, scale);
  }

  /* places thumbs on the slider depending on the received new value */
  setNewValuesForThumbs(): void {
    if (this.driver !== null) {
      if (this.state.modelState !== null) {
        if (this.state.scale !== null) {
          this.state.coefficientPoint = this.driver.calculateCoefficientPoint(
            this.state.scale,
            this.state.modelState.max,
            this.state.modelState.min,
          );
        }

        this.state.shiftToMinValue = Math.ceil(
          this.state.coefficientPoint * this.state.modelState.min,
        );
        if (this.state.activeRange !== null) {
          this.driver.setInPlaceNewThumb(
            this.state.thumbs,
            this.state.currentThumbIndex,
            this.state.coefficientPoint,
            this.state.modelState,
            this.state.shiftToMinValue,
            this.state.activeRange,
          );
        }
      }
    }
  }

  /* the method calculates the current value of the thumb */
  calculateValue(modelState: IModelState, currentValueAxis: number): number {
    let currentValue: number =
      Math.ceil(currentValueAxis / this.state.coefficientPoint) +
      modelState.min;

    const multi: number = Math.floor(currentValue / modelState.step);
    currentValue = modelState.step * multi;
    return currentValue;
  }

  /* the method calculates the value of the position of the thumb on the scale */
  calculateValueOfPlaceOnScale(modelState: IModelState, i: number): void {
    this.state.currentValue = this.calculateValue(
      modelState,
      this.state.currentValueAxis,
    );

    if (modelState.thumbsValues[i] !== this.state.currentValue) {
      this.emitter.emit('view:thumbsValues-changed', {
        value: this.state.currentValue,
        index: i,
      });
    }
  }

  /* calculates the potential value of the thumb at the point of click on the scale */
  calculateValueOfPlaceClickOnScale(
    modelState: IModelState,
    currentValueAxis: number,
  ): number {
    const currentValue: number | null = this.calculateValue(
      modelState,
      currentValueAxis,
    );
    if (this.state.currentValue !== null) {
      const halfStep =
        Math.floor(
          (this.state.currentValue + modelState.step / 2) *
            this.state.coefficientPoint,
        ) - this.state.shiftToMinValue;

      if (this.state.currentValueAxis > halfStep) {
        this.state.currentValue += modelState.step;
      }
    }
    return currentValue;
  }

  updateThumbsPosition({
    modelState,
    activeRange,
    driver,
    scale,
  }: {
    modelState: IModelState;
    activeRange: HTMLElement;
    driver: IDriver;
    scale: HTMLElement;
  }): void {
    this.state.coefficientPoint = driver.calculateCoefficientPoint(
      scale,
      modelState.max,
      modelState.min,
    );

    this.state.shiftToMinValue = Math.ceil(
      this.state.coefficientPoint * modelState.min,
    );

    driver.setInPlaceNewThumb(
      this.state.thumbs,
      this.state.currentThumbIndex,
      this.state.coefficientPoint,
      modelState,
      this.state.shiftToMinValue,
      activeRange,
    );
  }

  updateThumbPositionOnScale(index: number): void {
    if (this.state.modelState) {
      this.calculateValueOfPlaceOnScale(this.state.modelState, index);
      if (this.state.setCurrentTooltipValue !== null) {
        this.state.setCurrentTooltipValue(this.state.modelState, index);
      }
    }
  }

  /* method for setting the closest slider to the clicked position on the slider scale */
  setThumbToNewPosition(
    event: MouseEvent,
    modelState: IModelState,
    driver: IDriver,
  ): [number, number | null] {
    event.preventDefault();
    const target: HTMLDivElement = event.target as HTMLDivElement;
    const clickLocationAxis = driver.calculateClickLocation(
      event,
      target,
      this.state.shiftToMinValue,
    );

    const currentValue:
      | number
      | null
      | undefined = this.calculateValueOfPlaceClickOnScale(
      modelState,
      clickLocationAxis,
    );

    let nearestThumbIndex: number | null = null;

    modelState.thumbsValues.forEach((thumbValue: number, i: number) => {
      const isCurrentValue: boolean =
        currentValue !== null && currentValue !== undefined;
      const isFirstThumb: boolean = i === 0 && thumbValue >= currentValue;
      const isLastThumb: boolean =
        i === modelState.thumbsValues.length - 1 && thumbValue <= currentValue;
      const isIntermediateThumb: boolean =
        currentValue >= thumbValue &&
        currentValue <= modelState.thumbsValues[i + 1];

      if (isCurrentValue) {
        if (isFirstThumb) {
          nearestThumbIndex = i;
        } else if (isLastThumb) {
          nearestThumbIndex = i;
        } else if (isIntermediateThumb) {
          const leftSpacing: number = currentValue - thumbValue;
          const rightSpacing: number =
            modelState.thumbsValues[i + 1] - currentValue;

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
      modelState.thumbsValues[nearestThumbIndex] !== this.state.currentValue
    ) {
      this.emitter.emit('view:thumbsValues-changed', {
        value: currentValue,
        index: nearestThumbIndex,
      });
    }
    return [currentValue, nearestThumbIndex];
  }

  processStart({ event, index }: { event: MouseEvent; index: number }): void {
    this.state.currentThumbIndex = index;

    event.preventDefault();

    const elements: HTMLElement[] = this.state.thumbs;
    this.state.target = elements[index];

    if (this.driver !== null) {
      this.state.currentValueAxis = this.driver.getCurrentValueAxisToProcessStart(
        this.state.target,
      );

      this.state.startValueAxis = this.driver.getStartValueAxisToProcessStart(
        event,
        this.state.currentValueAxis,
      );
      if (this.state.scale !== null) {
        this.state.maxValueAxis = this.driver.getMaxValueAxisToProcessStart(
          this.state.scale,
        );
      }
      this.state.thumbValueAxis = this.driver.getThumbValueAxisToProcessStart(
        event,
        this.state.startValueAxis,
      );
    }
    if (this.state.modelState !== null) {
      this.state.currentValue = this.state.modelState.thumbsValues[index];
      console.log('step', this.state.modelState.step);
    }

    document.addEventListener('mousemove', this.handleThumbMove.bind(this));
    document.addEventListener('mouseup', this.handleThumbStop.bind(this));
  }

  processMove(event: MouseEvent): void {
    const elements: HTMLElement[] = this.state.thumbs;
    const index = this.state.currentThumbIndex;

    if (index !== null) {
      if (this.state.modelState !== null) {
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
              const targetWidth: number = this.driver.getTargetWidth(
                this.state.target,
              );
              this.state.currentValueAxis = this.driver.getCurrentValueAxisToProcessMove(
                event,
                this.state.startValueAxis,
              );

              const nextStepValueAxis: number =
                this.state.thumbValueAxis +
                Math.floor(
                  this.state.modelState.step * this.state.coefficientPoint,
                );

              const previousStepValueAxis: number =
                this.state.thumbValueAxis -
                Math.floor(
                  this.state.modelState.step * this.state.coefficientPoint,
                );

              if (isFirstThumb) {
                if (isOneThumb) {
                  if (this.state.currentValueAxis > this.state.maxValueAxis) {
                    this.state.currentValueAxis = this.state.maxValueAxis;
                    this.updateThumbPositionOnScale(index);
                  }
                }
                if (isMultipleThumbs) {
                  const offsetNextSlider: number =
                    this.driver.getElementOffset(elements[index + 1]) -
                    targetWidth;
                  if (this.state.currentValueAxis > offsetNextSlider) {
                    this.state.currentValueAxis = offsetNextSlider;
                    this.updateThumbPositionOnScale(index);
                  }
                }
                if (this.state.currentValueAxis < this.state.modelState.min) {
                  this.state.currentValueAxis = this.state.modelState.min;
                  this.updateThumbPositionOnScale(index);
                }
              }
              if (isIntermediateThumb) {
                const offsetNextThumb: number =
                  this.driver.getElementOffset(elements[index + 1]) -
                  targetWidth;
                const offsetPreviousThumb: number =
                  this.driver.getElementOffset(elements[index - 1]) +
                  targetWidth;
                const { currentValueAxis: valueAxis } = this.state;

                if (valueAxis > offsetNextThumb) {
                  this.state.currentValueAxis = offsetNextThumb;
                  this.updateThumbPositionOnScale(index);
                }
                if (valueAxis < offsetPreviousThumb) {
                  this.state.currentValueAxis = offsetPreviousThumb;
                  this.updateThumbPositionOnScale(index);
                }
              }
              if (isLastThumb) {
                const offsetPreviousThumb: number =
                  this.driver.getElementOffset(elements[index - 1]) +
                  targetWidth;
                const valueAxis = this.state.currentValueAxis;
                if (valueAxis < offsetPreviousThumb) {
                  this.state.currentValueAxis = offsetPreviousThumb;
                  this.updateThumbPositionOnScale(index);
                }
                if (valueAxis > this.state.maxValueAxis) {
                  this.state.currentValueAxis = this.state.maxValueAxis;
                  this.updateThumbPositionOnScale(index);
                }
              }

              if (this.state.currentValueAxis > nextStepValueAxis) {
                this.driver.setIndentForTarget(
                  this.state.target,
                  nextStepValueAxis,
                );
                this.state.thumbValueAxis = nextStepValueAxis;
                this.state.currentValueAxis = nextStepValueAxis;
                this.updateThumbPositionOnScale(index);
              }
              if (this.state.currentValueAxis < previousStepValueAxis) {
                this.driver.setIndentForTarget(
                  this.state.target,
                  previousStepValueAxis,
                );
                this.state.currentValueAxis = previousStepValueAxis;
                this.state.thumbValueAxis = previousStepValueAxis;

                this.updateThumbPositionOnScale(index);
              }
              if (this.state.activeRange !== null) {
                this.driver.updateActiveRange(this.state.activeRange, elements);
              }
            }
          }
        }
      }
    }
  }

  processStop(event: MouseEvent): void {
    if (this.state.setCurrentTooltipValue !== null) {
      if (this.state.modelState !== null) {
        if (this.state.currentThumbIndex !== null) {
          this.state.setCurrentTooltipValue(
            this.state.modelState,
            this.state.currentThumbIndex,
          );
        }
      }
    }
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
