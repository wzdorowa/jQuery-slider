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
      isScaleOfValues: true,
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

  // set a new value for the tooltip field
  public setNewValueScaleOfValues(value: boolean): void {
    if (value !== this.state.isScaleOfValues) {
      this.state.isScaleOfValues = value;
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
    if (
      this.state.max - this.state.min <
      this.state.step * this.state.thumbsCount
    ) {
      this.state.max =
        this.state.min + this.state.step * this.state.thumbsCount;
    }
    const minimumPossibleValue =
      Math.floor(this.state.min / this.state.step) * this.state.step;
    const maximumPossibleValue =
      Math.floor(this.state.max / this.state.step) * this.state.step;
    const maximumCountOfThumbs = Math.floor(
      (this.state.max - this.state.min) / this.state.step,
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
        this.checkThumbsValues(this.state.thumbsValues);
      }
    }
    if (this.state.min !== minimumPossibleValue) {
      this.state.min = minimumPossibleValue;
    }
    if (this.state.min > this.state.thumbsValues[0]) {
      this.state.thumbsValues[0] = this.state.min;
    }
    if (this.state.max !== maximumPossibleValue) {
      this.state.max = maximumPossibleValue;
    }
    if (
      this.state.max <
      this.state.thumbsValues[this.state.thumbsValues.length - 1]
    ) {
      this.state.thumbsValues[
        this.state.thumbsValues.length - 1
      ] = this.state.max;
    }
    if (this.state.step <= 0) {
      this.state.step = 1;
    }
    if (this.state.step > this.state.max / this.state.thumbsCount) {
      this.state.step = this.state.max / this.state.thumbsCount;
    }
    this.checkThumbsValues(this.state.thumbsValues);
  }

  // Calculate thumbs values based on step size
  private checkThumbsValues(thumbsValues: number[]): void {
    thumbsValues.forEach((element: number, i: number) => {
      const value: number = element;
      const remainderOfTheDivision: number = value % this.state.step;
      const newValue: number = value - remainderOfTheDivision;
      const maxPossibleValue: number =
        this.state.max -
        (this.state.max % this.state.step) -
        (this.state.thumbsValues.length - 1 - i) * this.state.step;
      const minPossibleValue: number =
        this.state.min -
        (this.state.min % this.state.step) +
        i * this.state.step;

      if (newValue !== this.state.thumbsValues[i]) {
        this.state.thumbsValues[i] = newValue;
      }
      if (newValue >= maxPossibleValue) {
        this.state.thumbsValues[i] = maxPossibleValue;
      }
      if (newValue <= minPossibleValue) {
        this.state.thumbsValues[i] = minPossibleValue;
      }

      const isGreaterThanNextValue: boolean =
        i !== this.state.thumbsValues[this.state.thumbsValues.length - 1] &&
        element >= this.state.thumbsValues[i + 1];

      const isLessThanPreviousValue: boolean =
        newValue <= this.state.thumbsValues[i - 1];

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
      if (isLessThanPreviousValue) {
        this.state.thumbsValues[i] =
          this.state.thumbsValues[i - 1] + this.state.step;
      }
      this.notifyStateChanged();
    });
  }

  private notifyStateChanged(): void {
    this.emitter.emit('model:state-changed', this.state);
  }
}
export default Model;
