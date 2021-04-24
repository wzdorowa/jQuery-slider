import { IModelState } from './interfaces/iModelState';
import EventEmitter from './eventEmitter';

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

    this.emitter.makeSubscribe('model:state-changed', (state: IModelState) => {
      this.checkStateValuesStepAndMin();
      this.checkStateValuesStepAndMax();
      this.checkThumbsValues(state);
      this.checkThumbsValuesForOverlap();
    });
  }

  // set new min value
  public setNewValueMin(min: number): void {
    if (this.state.min === min) {
      return;
    }
    this.state.min = min;
    this.checkMinValueInArrayThumbsValues(this.state.min);
    this.notifyStateChanged();
  }

  // set new value max
  public setNewValueMax(max: number): void {
    if (this.state.max === max) {
      return;
    }
    this.state.max = max;
    this.checkMaxValueInArrayThumbsValues(this.state.max);
    this.notifyStateChanged();
  }

  // set a new number of thumbs
  public setNewValueAmount(thumbsCount: number): void {
    if (this.state.thumbsCount === thumbsCount) {
      return;
    }
    // установить значения для новых ползунков
    if (this.state.thumbsCount !== thumbsCount) {
      if (this.state.thumbsCount < thumbsCount) {
        const thumbs = this.state.thumbsValues;
        const missingQuantityThumbs = thumbsCount - this.state.thumbsCount;
        new Array(missingQuantityThumbs)
          .fill(1)
          .forEach((_element: number, i: number) => {
            this.state.thumbsValues[thumbs.length - (thumbsCount - i)] =
              this.state.thumbsValues[thumbs.length - 1 - (thumbsCount - i)] +
              this.state.step;
          });
        this.state.thumbsCount = thumbsCount;
      }
      if (this.state.thumbsCount > thumbsCount) {
        const excessThumbs = this.state.thumbsCount - thumbsCount;
        new Array(excessThumbs)
          .fill(1)
          .forEach((_element: number, i: number) => {
            this.state.thumbsValues.splice(-1, 1);
          });
        this.state.thumbsCount = thumbsCount;
      }
    }
    // вынести проверку в метод normolizeState
    // if (thumbsCount <= 0) {
    //   this.state.thumbsCount = 1;
    // } else if (thumbsCount >= 10) {
    //   this.state.thumbsCount = 10;
    // } else {
    //   this.state.thumbsCount = thumbsCount;
    // }
    this.notifyStateChanged();
  }

  // set a new value for the thumb state
  public setNewValueThumbsValues(thumbValue: number, index: number): void {
    if (this.state.thumbsValues[index] === thumbValue) {
      return;
    }
    this.state.thumbsValues[index] = thumbValue;
    this.notifyStateChanged();
  }

  // set a new value for the step of moving the thumbs
  public setNewValueStep(step: number): void {
    if (this.state.step === step) {
      return;
    }
    if (step <= 0) {
      this.state.step = 1;
    } else if (step >= this.state.max / this.state.thumbsValues.length - 1) {
      this.state.step = this.state.max / this.state.thumbsValues.length - 1;
    } else {
      this.state.step = step;
    }
    this.notifyStateChanged();
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
    this.notifyStateChanged();
  }

  public setCurrentThumbsValues(value: number, index: number): void {
    this.state.thumbsValues[index] = value;
    this.notifyStateChanged();
  }

  private notifyStateChanged(): void {
    this.emitter.emit('model:state-changed', this.state);
  }

  private checkStateValuesStepAndMin(): void {
    const minimumPossibleValue =
      Math.floor(this.state.min / this.state.step) * this.state.step;
    if (minimumPossibleValue !== this.state.min) {
      this.state.min = minimumPossibleValue;
      this.notifyStateChanged();
    }
  }

  private checkStateValuesStepAndMax(): void {
    const maximumPossibleValue =
      Math.floor(this.state.max / this.state.step) * this.state.step;
    if (maximumPossibleValue !== this.state.max) {
      this.state.max = maximumPossibleValue;
      this.notifyStateChanged();
    }
  }

  private checkMinValueInArrayThumbsValues(minValue: number): void {
    if (minValue > this.state.thumbsValues[0]) {
      this.state.thumbsValues[0] = minValue;
      this.notifyStateChanged();
    }
  }

  private checkMaxValueInArrayThumbsValues(maxValue: number): void {
    if (
      maxValue < this.state.thumbsValues[this.state.thumbsValues.length - 1]
    ) {
      this.state.thumbsValues[this.state.thumbsValues.length - 1] = maxValue;
    }
  }

  // Calculate thumbs values based on step size
  private checkThumbsValues(state: IModelState): void {
    state.thumbsValues.forEach((element: number, i: number) => {
      const newValue: number = element;
      const remainderOfTheDivision: number = newValue % state.step;
      const newCurrentValue: number = newValue - remainderOfTheDivision;
      const maxPossibleValue: number =
        state.max -
        (state.max % state.step) -
        (state.thumbsValues.length - 1 - i) * state.step;
      let minPossibleValue: number =
        state.min - (state.min % state.step) + i * state.step;

      if (minPossibleValue < state.min) {
        minPossibleValue += state.step;
      }

      if (newCurrentValue > maxPossibleValue) {
        this.state.thumbsValues[i] = maxPossibleValue;
        this.notifyStateChanged();
      } else if (newCurrentValue < minPossibleValue) {
        this.state.thumbsValues[i] = minPossibleValue;
        this.notifyStateChanged();
      } else if (this.state.thumbsValues[i] !== newCurrentValue) {
        this.state.thumbsValues[i] = newCurrentValue;
        this.notifyStateChanged();
      }

      if (newCurrentValue < state.min) {
        this.state.thumbsValues[i] = minPossibleValue;
        this.notifyStateChanged();
      }
      if (newCurrentValue > state.max) {
        this.state.thumbsValues[i] = maxPossibleValue;
        this.notifyStateChanged();
      }
    });
  }

  // Check sliders overlap
  private checkThumbsValuesForOverlap(): void {
    this.state.thumbsValues.forEach((element: number, i: number) => {
      const maxPossibleValue: number =
        this.state.max -
        (this.state.thumbsValues.length - 1 - i) * this.state.step;
      const minPossibleValue: number = this.state.min + i * this.state.step;
      const isIntermediateThumb: boolean =
        i !== 0 && element <= this.state.thumbsValues[i - 1];
      const isLastThumb: boolean =
        i !== this.state.thumbsValues[this.state.thumbsValues.length - 1] &&
        element >= this.state.thumbsValues[i + 1];

      if (isIntermediateThumb) {
        this.state.thumbsValues[i - 1] =
          this.state.thumbsValues[i] - this.state.step;
        if (
          this.state.thumbsValues[i - 1] <
          minPossibleValue - this.state.step
        ) {
          this.state.thumbsValues[i - 1] = minPossibleValue - this.state.step;
          this.state.thumbsValues[i] = minPossibleValue;
        }
        this.notifyStateChanged();
      }
      if (isLastThumb) {
        this.state.thumbsValues[i + 1] =
          this.state.thumbsValues[i] + this.state.step;
        if (
          this.state.thumbsValues[i + 1] >
          maxPossibleValue + this.state.step
        ) {
          this.state.thumbsValues[i + 1] = maxPossibleValue + this.state.step;
          this.state.thumbsValues[i] = maxPossibleValue;
        }
        this.notifyStateChanged();
      }
    });
  }
}
export default Model;
