import { IModelState } from '../interfaces/iModelState';
import EventEmitter from '../EventEmitter';
import defaultState from './defaultState';
import { checkThumbsValuesIntersection, normalizeState } from './helpers';

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
    this.state = normalizeState(state);
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

    this.state.thumbsValues = checkThumbsValuesIntersection(
      index,
      this.state.thumbsValues,
      this.state.min,
      this.state.max,
      this.state.step,
    );
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
