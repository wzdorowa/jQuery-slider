import { IModelState } from './interfaces/iModelState';
import EventEmitter from './EventEmitter';

class Model {
  public state: IModelState;

  private emitter: EventEmitter;

  constructor(
    eventEmitter: EventEmitter,
    props = {
      min: 0,
      max: 100,
      thumbsValues: [20, 32, 44, 60],
      orientation: 'horizontal',
      thumbsCount: 4,
      step: 2,
      isTooltip: true,
      isScaleOfValues: true,
    },
  ) {
    this.state = {
      min: props.min,
      max: props.max,
      thumbsValues: props.thumbsValues,
      orientation: props.orientation,
      thumbsCount: props.thumbsCount,
      step: props.step,
      isTooltip: props.isTooltip,
      isScaleOfValues: props.isScaleOfValues,
    };

    this.emitter = eventEmitter;
    this.setNewValueMin(this.state.min);
    // this.setNewValueMax(this.state.max);
    this.setNewValueCount(this.state.thumbsCount);
    this.setNewValueStep(this.state.step);
    this.checkThumbsValues(this.state.thumbsValues);
  }

  // set new min value
  public setNewValueMin(min: number): void {
    let correctMinValue = min;
    const isInteger = min - Math.floor(min) === 0;
    if (!isInteger) {
      correctMinValue -= min - Math.floor(min);
    }

    if (correctMinValue > this.state.thumbsValues[0]) {
      this.state.thumbsValues[0] = this.state.min;
      this.checkThumbsValues(this.state.thumbsValues);
    }

    if (this.state.min === min) {
      return;
    }

    this.state.min = correctMinValue;
    this.notifyStateChanged();
  }

  // set new value max
  public setNewValueMax(max: number): void {
    let correctMaxValue = max;
    const isInteger = max - Math.floor(max) === 0;
    if (!isInteger) {
      correctMaxValue -= max - Math.floor(max);
    }

    if (
      this.state.max <
      this.state.thumbsValues[this.state.thumbsValues.length - 1]
    ) {
      this.state.thumbsValues[
        this.state.thumbsValues.length - 1
      ] = this.state.max;
      this.checkThumbsValues(this.state.thumbsValues);
    }
    this.state.max = correctMaxValue;
    this.notifyStateChanged();
  }

  // set a new number of thumbs
  public setNewValueCount(thumbsCount: number): void {
    let correctThumbsCount = thumbsCount;
    const isInteger = thumbsCount - Math.floor(thumbsCount) === 0;
    if (!isInteger) {
      correctThumbsCount -= thumbsCount - Math.floor(thumbsCount);
    }

    if (correctThumbsCount <= 0) {
      correctThumbsCount = 1;
    }

    const maximumCountOfThumbs = Math.floor(
      (this.state.max - this.state.min) / this.state.step,
    );

    if (maximumCountOfThumbs < correctThumbsCount) {
      correctThumbsCount = maximumCountOfThumbs;

      if (correctThumbsCount < this.state.thumbsValues.length) {
        this.state.thumbsValues.splice(
          this.state.thumbsCount,
          this.state.thumbsValues.length - this.state.thumbsCount,
        );
      }
    }

    // установить значения для новых ползунков
    if (this.state.thumbsValues.length < correctThumbsCount) {
      const missingQuantityThumbs =
        correctThumbsCount - this.state.thumbsValues.length;

      new Array(missingQuantityThumbs).fill(1).forEach(() => {
        this.state.thumbsValues[this.state.thumbsValues.length] =
          this.state.thumbsValues[this.state.thumbsValues.length - 1] +
          this.state.step;
      });
    }

    if (this.state.thumbsValues.length > correctThumbsCount) {
      if (correctThumbsCount > 0) {
        const excessThumbs =
          this.state.thumbsValues.length - correctThumbsCount;
        new Array(excessThumbs).fill(1).forEach(() => {
          this.state.thumbsValues.splice(-1, 1);
        });
      }
      if (correctThumbsCount <= 0) {
        this.state.thumbsValues.splice(1, this.state.thumbsValues.length - 1);
      }
    }
    this.state.thumbsCount = correctThumbsCount;

    this.checkThumbsValues(this.state.thumbsValues);
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

  // set a new value for the step of moving the thumbs
  public setNewValueStep(step: number): void {
    this.state.step = step;

    if (this.state.step <= 0) {
      this.state.step = 1;
    }
    if (this.state.step > this.state.max / this.state.thumbsCount) {
      this.state.step = this.state.max / this.state.thumbsCount;
    }
    this.checkThumbsValues(this.state.thumbsValues);
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
            (thumbsValues.length - index - 1) * this.state.step +
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

      this.notifyStateChanged();
    });
  }

  private notifyStateChanged(): void {
    this.emitter.emit('model:state-changed', this.state);
  }
}
export default Model;
