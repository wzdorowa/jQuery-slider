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

  public setNewThumbValue(thumbValue: number, index: number): void {
    this.state.thumbsValues[index] = thumbValue;

    this.checkThumbsValuesIntersection(index);
    this.notifyThumbsValuesChanged();
  }

  private normalizeState() {
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

    this.checkThumbsValuesIntersection(null);
    this.notifyStateChanged();
  }

  private checkThumbsValuesIntersection(thumbIndex: number | null): void {
    let index = thumbIndex;
    if (index === null) {
      index = 0;
    }
    for (let i = index; i < this.state.thumbsValues.length; i += 1) {
      this.normalizeThumbValue(this.state.thumbsValues[i], i);
      if (this.state.thumbsValues[i] > this.state.thumbsValues[i + 1]) {
        this.state.thumbsValues[i + 1] = this.state.thumbsValues[i];
      }
    }

    for (let i = index; i > 0; i -= 1) {
      this.normalizeThumbValue(this.state.thumbsValues[i], i);
      if (this.state.thumbsValues[i] < this.state.thumbsValues[i - 1]) {
        this.state.thumbsValues[i - 1] = this.state.thumbsValues[i];
      }
    }
  }

  private normalizeThumbValue(thumbsValue: number, index: number): void {
    const lastStep =
      Math.round(((this.state.max - this.state.min) % this.state.step) * 10) /
      10;

    const previousLastStep = this.state.max - lastStep;

    let value: number = Math.round(thumbsValue * 100) / 100;

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

    if (value < this.state.min) {
      value = this.state.min;
    } else if (value >= this.state.max) {
      value = this.state.max;
    }

    this.state.thumbsValues[index] = value;
  }

  private notifyStateChanged(): void {
    this.emitter.emit('model:state-changed', this.state);
  }

  private notifyThumbsValuesChanged(): void {
    this.emitter.emit('model:thumbsValues-changed', this.state.thumbsValues);
  }
}
export default Model;
