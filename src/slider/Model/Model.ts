import { IModelState } from '../interfaces/iModelState';
import EventEmitter from '../EventEmitter';
import defaultState from './defaultState';

class Model {
  public state: IModelState;

  private emitter: EventEmitter;

  constructor(eventEmitter: EventEmitter) {
    this.state = {
      min: defaultState.min,
      max: defaultState.max,
      thumbsValues: defaultState.thumbsValues,
      orientation: defaultState.orientation,
      thumbsCount: defaultState.thumbsCount,
      step: defaultState.step,
      tooltipIsActive: defaultState.tooltipIsActive,
      scaleValuesIsActive: defaultState.scaleValuesIsActive,
    };

    this.emitter = eventEmitter;
    this.notifyStateChanged();
  }

  public updateState(state: IModelState): void {
    this.state = state;
    this.normolizeState();
  }

  private normolizeState() {
    if (this.state.min < 0) {
      this.state.min = defaultState.min;
    }

    if (this.state.step <= 0) {
      this.state.step = 1;
    }

    if (this.state.thumbsCount <= 0) {
      this.state.thumbsCount = 1;
    }

    if (!['horizontal', 'vertical'].includes(this.state.orientation)) {
      this.state.orientation = defaultState.orientation;
    }

    if (!Number.isInteger(this.state.min)) {
      this.state.min -= this.state.min - Math.floor(this.state.min);
    }

    if (!Number.isInteger(this.state.max)) {
      this.state.max -= this.state.max - Math.floor(this.state.max);
    }

    if (!Number.isInteger(this.state.thumbsCount)) {
      this.state.thumbsCount -=
        this.state.thumbsCount - Math.floor(this.state.thumbsCount);
    }

    const minPossibleMaxValue =
      this.state.min + this.state.step * (this.state.thumbsCount + 1);

    if (this.state.max < minPossibleMaxValue) {
      this.state.max = minPossibleMaxValue;
    }

    if (this.state.thumbsValues.length < this.state.thumbsCount) {
      const missingQuantityThumbs =
        this.state.thumbsCount - this.state.thumbsValues.length;
      new Array(missingQuantityThumbs).fill(1).forEach(() => {
        this.state.thumbsValues[this.state.thumbsValues.length] =
          this.state.thumbsValues[this.state.thumbsValues.length - 1] +
          this.state.step;
      });
    }
    if (this.state.thumbsValues.length > this.state.thumbsCount) {
      if (this.state.thumbsCount > 0) {
        const excessThumbs =
          this.state.thumbsValues.length - this.state.thumbsCount;
        new Array(excessThumbs).fill(1).forEach(() => {
          this.state.thumbsValues.splice(-1, 1);
        });
      }
    }

    this.checkThumbsValues(this.state.thumbsValues);
    this.notifyStateChanged();
  }

  // set a new value for the thumb state
  public setNewThumbValue(thumbValue: number, index: number): void {
    if (this.state.thumbsValues[index] === thumbValue) {
      return;
    }

    this.state.thumbsValues[index] = thumbValue;

    for (let i = index; i < this.state.thumbsValues.length; i += 1) {
      if (this.state.thumbsValues[i] >= this.state.thumbsValues[i + 1]) {
        this.state.thumbsValues[i + 1] =
          this.state.thumbsValues[i] + this.state.step;
      }
    }

    for (let i = index; i > 0; i -= 1) {
      if (this.state.thumbsValues[i] <= this.state.thumbsValues[i - 1]) {
        this.state.thumbsValues[i - 1] =
          this.state.thumbsValues[i] - this.state.step;
      }
    }

    this.checkThumbsValues(this.state.thumbsValues);
  }

  public requestThumbValueChange(value: number, index: number): void {
    const correctValue: number = Math.round(value * 100) / 100;

    if (
      correctValue < this.state.thumbsValues[index] - this.state.step / 2 ||
      correctValue > this.state.thumbsValues[index] + this.state.step / 2
    ) {
      this.setNewThumbValue(correctValue, index);
    }
  }

  // Calculate thumbs values based on step size
  private checkThumbsValues(thumbsValues: number[]): void {
    thumbsValues.forEach((element: number, index: number) => {
      let value: number = Math.floor(element * 10) / 10;

      const minPossibleValue = this.state.min + index * this.state.step;

      const lastStep =
        Math.round(((this.state.max - this.state.min) % this.state.step) * 10) /
        10;

      let maxPossibleValue;
      if (lastStep > 0) {
        if (index === thumbsValues.length - 1) {
          maxPossibleValue = this.state.max;
        } else {
          maxPossibleValue =
            this.state.max -
            (thumbsValues.length - index - 2) * this.state.step -
            lastStep;
        }
      } else {
        maxPossibleValue =
          this.state.max - (thumbsValues.length - index - 1) * this.state.step;
      }

      if (value < minPossibleValue) {
        value = minPossibleValue;
      } else if (value >= maxPossibleValue) {
        value = maxPossibleValue;
      } else {
        const valuesInterval = Math.round((value - this.state.min) * 10) / 10;
        const integer = Math.floor(valuesInterval / this.state.step);

        const getRemainderOfDivision = (interval: number, step: number) => {
          return Math.abs(
            Math.round((interval - integer * step) * 10000) / 10000,
          );
        };

        const remainderOfDivision = getRemainderOfDivision(
          valuesInterval,
          this.state.step,
        );

        let currentValue;

        if (remainderOfDivision > 0) {
          currentValue = integer * this.state.step + this.state.min;
          const lastStep =
            Math.round(
              ((this.state.max - this.state.min) % this.state.step) * 10,
            ) / 10;
          const beginningLastStep = this.state.max - lastStep;

          if (value > beginningLastStep && value < this.state.max) {
            const halfStep = lastStep / 2;
            if (value > beginningLastStep + halfStep) {
              currentValue = this.state.max;
            } else {
              currentValue = beginningLastStep;
            }
          }
        } else {
          currentValue = integer * this.state.step + this.state.min;
        }

        const stepOrZero =
          Math.round(remainderOfDivision / this.state.step) * this.state.step;

        value = Math.round((stepOrZero + currentValue) * 10) / 10;
      }

      if (value !== this.state.thumbsValues[index]) {
        this.state.thumbsValues[index] = value;
      }
    });
    this.notifyThumbsValuesChanged();
  }

  private notifyStateChanged(): void {
    this.emitter.emit('model:state-changed', this.state);
  }

  private notifyThumbsValuesChanged(): void {
    this.emitter.emit('model:thumbsValues-changed', this.state.thumbsValues);
  }
}
export default Model;
