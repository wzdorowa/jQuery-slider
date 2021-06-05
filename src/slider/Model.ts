import { IModelState } from './interfaces/iModelState';
import EventEmitter from './EventEmitter';

class Model {
  public state: IModelState;

  private emitter: EventEmitter;

  constructor(eventEmitter: EventEmitter) {
    this.state = {
      min: 0,
      max: 100,
      thumbsValues: [20, 32, 44, 60],
      orientation: 'horizontal',
      thumbsCount: 4,
      step: 2,
      isTooltip: true,
    };

    this.emitter = eventEmitter;
    this.notifyStateChanged();
  }

  // set new min value
  public setNewValueMin(min: number): void {
    if (this.state.min === min) {
      return;
    }
    this.state.min = min;
    this.normolizeState();
  }

  // set new value max
  public setNewValueMax(max: number): void {
    if (this.state.max === max) {
      return;
    }
    this.state.max = max;
    this.normolizeState();
  }

  // set a new number of thumbs
  public setNewValueCount(thumbsCount: number): void {
    if (this.state.thumbsCount === thumbsCount) {
      return;
    }
    // установить значения для новых ползунков
    if (this.state.thumbsCount !== thumbsCount) {
      if (this.state.thumbsCount < thumbsCount) {
        const missingQuantityThumbs = thumbsCount - this.state.thumbsCount;

        new Array(missingQuantityThumbs).fill(1).forEach(() => {
          this.state.thumbsValues[this.state.thumbsValues.length] =
            this.state.thumbsValues[this.state.thumbsValues.length - 1] +
            this.state.step;
        });

        this.state.thumbsCount = thumbsCount;
      }
      if (this.state.thumbsCount > thumbsCount) {
        const excessThumbs = this.state.thumbsCount - thumbsCount;
        new Array(excessThumbs).fill(1).forEach(() => {
          this.state.thumbsValues.splice(-1, 1);
        });
        this.state.thumbsCount = thumbsCount;
      }
    }
    this.normolizeState();
  }

  // set a new value for the thumb state
  public setNewValueThumbsValues(thumbValue: number, index: number): void {
    if (this.state.thumbsValues[index] === thumbValue) {
      return;
    }
    this.state.thumbsValues[index] = thumbValue;
    this.normolizeState();
  }

  // set a new value for the step of moving the thumbs
  public setNewValueStep(step: number): void {
    if (this.state.step === step) {
      return;
    }
    this.state.step = step;
    this.normolizeState();
  }

  // set a new value for the tooltip field
  public setNewValueTooltip(value: boolean): void {
    if (value !== this.state.isTooltip) {
      this.state.isTooltip = value;
      this.notifyStateChanged();
    }
  }

  // set new value for orientation field
  public setNewValueOrientation(value: string): void {
    if (value === 'horizontal') {
      this.state.orientation = 'horizontal';
    } else if (value === 'vertical') {
      this.state.orientation = 'vertical';
    }
    this.notifyStateChanged();
  }

  public overwriteCurrentThumbsValues(thumbsValues: number[]): void {
    this.state.thumbsValues = thumbsValues;
    this.normolizeState();
  }

  private normolizeState(): void {
    const minimumPossibleValue =
      Math.floor(this.state.min / this.state.step) * this.state.step;
    const maximumPossibleValue =
      Math.floor(this.state.max / this.state.step) * this.state.step;
    const maximumCountOfThumbs = Math.floor(
      this.state.max / (this.state.step * 2),
    );

    if (this.state.thumbsCount <= 0) {
      this.state.thumbsCount = 1;
    }
    if (maximumCountOfThumbs < this.state.thumbsCount) {
      this.state.thumbsCount = maximumCountOfThumbs;

      if (this.state.thumbsCount < this.state.thumbsValues.length) {
        this.state.thumbsValues.splice(
          this.state.thumbsCount,
          this.state.thumbsValues.length - this.state.thumbsCount,
        );
        this.checkThumbsValues();
      }
    }
    if (this.state.min > this.state.thumbsValues[0]) {
      this.state.thumbsValues[0] = this.state.min;
      const thumbsValues = this.state.thumbsValues.reverse();
      thumbsValues.forEach((element, index) => {
        if (element >= thumbsValues[index + 1]) {
          thumbsValues[index + 1] = element + this.state.step;
        }
      });
      this.state.thumbsValues = thumbsValues.reverse();
    }
    if (this.state.min !== minimumPossibleValue) {
      this.state.min = minimumPossibleValue;
    }
    if (
      this.state.max <
      this.state.thumbsValues[this.state.thumbsValues.length - 1]
    ) {
      this.state.thumbsValues[
        this.state.thumbsValues.length - 1
      ] = this.state.max;
      const thumbsValues = this.state.thumbsValues.reverse();
      thumbsValues.forEach((element, index) => {
        if (element <= thumbsValues[index + 1]) {
          thumbsValues[index + 1] = element - this.state.step;
        }
      });
      this.state.thumbsValues = thumbsValues.reverse();
    }
    if (this.state.max !== maximumPossibleValue) {
      this.state.max = maximumPossibleValue;
    }
    if (this.state.step <= 0) {
      this.state.step = 1;
    }
    this.checkThumbsValues();
    this.notifyStateChanged();
  }

  // Calculate thumbs values based on step size
  private checkThumbsValues(): void {
    this.state.thumbsValues.forEach((element: number, i: number) => {
      const newValue: number = element;
      const remainderOfTheDivision: number = newValue % this.state.step;
      const newCurrentValue: number = newValue - remainderOfTheDivision;
      const maxPossibleValue: number =
        this.state.max -
        (this.state.max % this.state.step) -
        (this.state.thumbsValues.length - 1 - i) * this.state.step;
      const minPossibleValue: number =
        this.state.min -
        (this.state.min % this.state.step) +
        i * this.state.step;

      if (newCurrentValue > maxPossibleValue) {
        this.state.thumbsValues[i] = maxPossibleValue;
      }
      if (newCurrentValue < minPossibleValue) {
        this.state.thumbsValues[i] = minPossibleValue;
      }
      if (this.state.thumbsValues[i] !== newCurrentValue) {
        this.state.thumbsValues[i] = newCurrentValue;
      }

      const isGreaterThanNextValue: boolean =
        i !== this.state.thumbsValues[this.state.thumbsValues.length - 1] &&
        element >= this.state.thumbsValues[i + 1];

      if (isGreaterThanNextValue) {
        this.state.thumbsValues[i + 1] =
          this.state.thumbsValues[i] + this.state.step;
        if (
          this.state.thumbsValues[i + 1] >
          maxPossibleValue + this.state.step
        ) {
          this.state.thumbsValues[i + 1] = maxPossibleValue + this.state.step;
          this.state.thumbsValues[i] = maxPossibleValue;
        }
      }
    });
  }

  private notifyStateChanged(): void {
    this.emitter.emit('model:state-changed', this.state);
  }
}
export default Model;
