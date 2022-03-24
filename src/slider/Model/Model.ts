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
      step: defaultState.step,
      hasTooltips: defaultState.hasTooltips,
      hasScaleValues: defaultState.hasScaleValues,
    };

    this.emitter = eventEmitter;
  }

  public updateState(state: IModelState): void {
    this.state = state;
    this.normalizeState();
  }

  private normalizeState() {
    if (this.state.min < 0) {
      this.state.min = defaultState.min;
    }

    if (this.state.step <= 0) {
      this.state.step = 1;
    }

    if (this.state.thumbsValues.length === 0) {
      this.state.thumbsValues[0] = this.state.min;
    }

    if (!['horizontal', 'vertical'].includes(this.state.orientation)) {
      this.state.orientation = defaultState.orientation;
    }

    if (!Number.isInteger(this.state.min)) {
      this.state.min = Math.floor(this.state.min);
    }

    if (!Number.isInteger(this.state.max)) {
      this.state.max = Math.floor(this.state.max);
    }

    const minPossibleMaxValue =
      this.state.min + this.state.step * this.state.thumbsValues.length;

    if (this.state.max < minPossibleMaxValue) {
      this.state.max = minPossibleMaxValue;
    }

    this.checkThumbsValues(this.state.thumbsValues);
    this.notifyStateChanged();
  }

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
    this.notifyThumbsValuesChanged();
  }

  public requestThumbValueChange(value: number, index: number): void {
    const correctValue: number = Math.round(value * 100) / 100;

    const lastStep =
      Math.round(((this.state.max - this.state.min) % this.state.step) * 10) /
      10;
    const penultimateStep = this.state.max - lastStep;

    const isValueLastStep =
      correctValue > penultimateStep + lastStep / 2 ||
      (correctValue < penultimateStep + lastStep / 2 &&
        correctValue > penultimateStep);

    const isHalfStep =
      correctValue < this.state.thumbsValues[index] - this.state.step / 2 ||
      correctValue > this.state.thumbsValues[index] + this.state.step / 2;

    if (lastStep > 0) {
      if (isValueLastStep) {
        this.setNewThumbValue(correctValue, index);
      } else if (isHalfStep) {
        this.setNewThumbValue(correctValue, index);
      }
    } else if (isHalfStep) {
      this.setNewThumbValue(correctValue, index);
    }
  }

  private checkThumbsValues(thumbsValues: number[]): void {
    thumbsValues.forEach((element: number, index: number) => {
      const lastStep =
        Math.round(((this.state.max - this.state.min) % this.state.step) * 10) /
        10;

      const previousLastStep = this.state.max - lastStep;

      let value: number = Math.round(element * 100) / 100;

      if (lastStep > 0 && value > previousLastStep + lastStep / 2) {
        value =
          Math.round((value - this.state.min) / this.state.step) *
            this.state.step +
          this.state.min +
          lastStep;
      } else {
        value =
          Math.round((value - this.state.min) / this.state.step) *
            this.state.step +
          this.state.min;
      }

      value = Math.round(value * 100) / 100;

      if (value > thumbsValues[index + 1]) {
        value = thumbsValues[index + 1];
      }

      const minPossibleValue = this.state.min + index * this.state.step;

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
      }

      if (value !== this.state.thumbsValues[index]) {
        this.state.thumbsValues[index] = value;
      }
    });
  }

  private notifyStateChanged(): void {
    this.emitter.emit('model:state-changed', this.state);
  }

  private notifyThumbsValuesChanged(): void {
    this.emitter.emit('model:thumbsValues-changed', this.state.thumbsValues);
  }
}
export default Model;
