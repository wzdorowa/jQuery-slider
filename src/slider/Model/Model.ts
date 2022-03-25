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
    this.state = this.normalizeState(state);
    this.notifyStateChanged();
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

    this.state.thumbsValues = this.checkThumbsValuesIntersection(
      index,
      this.state,
    );
    this.notifyThumbsValuesChanged();
  }

  private normalizeState(state: IModelState): IModelState {
    const newState = state;
    if (newState.step <= 0) {
      newState.step = 1;
    }

    if (newState.thumbsValues.length === 0) {
      newState.thumbsValues[0] = newState.min;
    }

    if (!['horizontal', 'vertical'].includes(newState.orientation)) {
      newState.orientation = defaultState.orientation;
    }

    if (!Number.isInteger(newState.min)) {
      newState.min = Math.floor(newState.min);
    }

    if (!Number.isInteger(this.state.max)) {
      newState.max = Math.floor(newState.max);
    }

    const minPossibleMaxValue =
      newState.min + newState.step * newState.thumbsValues.length;

    if (newState.max < minPossibleMaxValue) {
      newState.max = minPossibleMaxValue;
    }

    newState.thumbsValues = this.checkThumbsValuesIntersection(null, newState);

    return newState;
  }

  private checkThumbsValuesIntersection(
    thumbIndex: number | null,
    state: IModelState,
  ): number[] {
    let index = thumbIndex;
    if (index === null) {
      index = 0;
    }
    const thumbValues = state.thumbsValues;
    for (let i = index; i < thumbValues.length; i += 1) {
      thumbValues[i] = this.normalizeThumbValue(thumbValues[i], state);
      if (thumbValues[i] > thumbValues[i + 1]) {
        thumbValues[i + 1] = thumbValues[i];
      }
    }

    for (let i = index; i > 0; i -= 1) {
      thumbValues[i] = this.normalizeThumbValue(thumbValues[i], state);
      if (thumbValues[i] < thumbValues[i - 1]) {
        thumbValues[i - 1] = thumbValues[i];
      }
    }

    return thumbValues;
  }

  private normalizeThumbValue(thumbsValue: number, state: IModelState): number {
    const { min, max, step } = state;
    const lastStep = Math.round(((max - min) % step) * 10) / 10;

    const previousLastStep = max - lastStep;

    let value: number = Math.round(thumbsValue * 100) / 100;

    if (lastStep > 0 && value > previousLastStep + lastStep / 2) {
      value = Math.round((value - min) / step) * step + min + lastStep;
    } else {
      value = Math.round((value - min) / step) * step + min;
    }

    value = Math.round(value * 100) / 100;

    if (value < min) {
      value = min;
    } else if (value >= max) {
      value = max;
    }

    return value;
  }

  private notifyStateChanged(): void {
    this.emitter.emit('model:state-changed', this.state);
  }

  private notifyThumbsValuesChanged(): void {
    this.emitter.emit('model:thumbsValues-changed', this.state.thumbsValues);
  }
}
export default Model;
