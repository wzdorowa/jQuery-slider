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
    this.normolizeState();
  }

  // set new min value
  public setNewValueMin(min: number): void {
    let correctMinValue = min;
    const isInteger = min - Math.floor(min) === 0;
    if (!isInteger) {
      correctMinValue -= min - Math.floor(min);
    }

    if (this.state.min === min) {
      return;
    }
    this.state.min = correctMinValue;
    this.normolizeState();
  }

  // set new value max
  public setNewValueMax(max: number): void {
    let correctMaxValue = max;
    const isInteger = max - Math.floor(max) === 0;
    if (!isInteger) {
      correctMaxValue -= max - Math.floor(max);
    }

    this.state.max = correctMaxValue;
    this.normolizeState();
  }

  // set a new number of thumbs
  public setNewValueCount(thumbsCount: number): void {
    let correctThumbsCount = thumbsCount;
    const isInteger = thumbsCount - Math.floor(thumbsCount) === 0;
    if (!isInteger) {
      correctThumbsCount -= thumbsCount - Math.floor(thumbsCount);
    }

    // установить значения для новых ползунков
    if (this.state.thumbsCount !== correctThumbsCount) {
      if (this.state.thumbsCount < correctThumbsCount) {
        const missingQuantityThumbs =
          correctThumbsCount - this.state.thumbsCount;

        new Array(missingQuantityThumbs).fill(1).forEach(() => {
          this.state.thumbsValues[this.state.thumbsValues.length] =
            this.state.thumbsValues[this.state.thumbsValues.length - 1] +
            this.state.step;
        });
      }

      if (this.state.thumbsCount > correctThumbsCount) {
        if (correctThumbsCount > 0) {
          const excessThumbs = this.state.thumbsCount - correctThumbsCount;
          new Array(excessThumbs).fill(1).forEach(() => {
            this.state.thumbsValues.splice(-1, 1);
          });
        }
        if (correctThumbsCount <= 0) {
          this.state.thumbsValues.splice(1, this.state.thumbsValues.length - 1);
        }
      }
    }
    this.state.thumbsCount = correctThumbsCount;
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
    const maximumCountOfThumbs = Math.floor(
      (this.state.max - this.state.min) / this.state.step,
    );

    if (this.state.thumbsCount <= 0) {
      this.state.thumbsCount = 1;
    }

    if (this.state.thumbsCount < this.state.thumbsValues.length) {
      this.state.thumbsValues.splice(
        this.state.thumbsCount,
        this.state.thumbsValues.length - this.state.thumbsCount,
      );
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
    if (this.state.min > this.state.thumbsValues[0]) {
      this.state.thumbsValues[0] = this.state.min;
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
    thumbsValues.forEach((element: number, index: number) => {
      let value: number = Math.floor(element * 10) / 10;

      const minPossibleValue = this.state.min + index * this.state.step;

      if (value < minPossibleValue) {
        value = minPossibleValue;
        this.state.thumbsValues[index] = value;
      } else {
        this.state.thumbsValues[index] = value;
      }

      const valuesInterval = Math.round((value - this.state.min) * 10) / 10;

      const remainderOfDivision = valuesInterval % this.state.step;

      const activeRangeValues = this.state.max - this.state.min;

      const fractionalPartStep = this.state.step - Math.round(this.state.step);

      const lastStep =
        activeRangeValues -
        Math.floor(activeRangeValues / this.state.step) * this.state.step;

      const isValid =
        index === thumbsValues.length - 1 || thumbsValues.length === 1;

      let maximumPossibleValue;

      if (isValid) {
        maximumPossibleValue = this.state.max;
      } else if (lastStep > 0) {
        maximumPossibleValue =
          activeRangeValues +
          this.state.min -
          this.state.step * (this.state.thumbsValues.length - (index + 1)) -
          lastStep;
      } else {
        maximumPossibleValue =
          activeRangeValues +
          this.state.min -
          this.state.step * (this.state.thumbsValues.length - (index + 1));
      }

      if (remainderOfDivision > 0) {
        if (index === thumbsValues.length - 1) {
          if (lastStep > 0) {
            const penultimateValue: number = this.state.max - lastStep;

            if (value > penultimateValue) {
              value = this.state.max;
            } else if (fractionalPartStep === 0) {
              value -= remainderOfDivision;
            } else {
              value = Math.round((value - remainderOfDivision) * 10) / 10;
            }
          } else if (fractionalPartStep === 0) {
            value -= remainderOfDivision;
          } else {
            value = Math.round((value - remainderOfDivision) * 10) / 10;
          }
        } else if (fractionalPartStep === 0) {
          value -= remainderOfDivision;
        } else {
          value = Math.round((value - remainderOfDivision) * 10) / 10;
        }
      }

      if (value > maximumPossibleValue) {
        value = maximumPossibleValue;
      }

      if (value !== this.state.thumbsValues[index]) {
        this.state.thumbsValues[index] = value;
      }

      if (value < this.state.min) {
        this.state.thumbsValues[index] =
          this.state.min + this.state.step * index;
      }

      const isGreaterThanNextValue: boolean =
        index !== this.state.thumbsValues[this.state.thumbsValues.length - 1] &&
        element >= this.state.thumbsValues[index + 1];

      const isLessThanPreviousValue: boolean =
        value <= this.state.thumbsValues[index - 1];

      if (isGreaterThanNextValue) {
        this.state.thumbsValues[index + 1] =
          this.state.thumbsValues[index] + this.state.step;
      }
      if (isLessThanPreviousValue) {
        this.state.thumbsValues[index] =
          this.state.thumbsValues[index - 1] + this.state.step;
      }

      this.notifyStateChanged();
    });
  }

  private notifyStateChanged(): void {
    this.emitter.emit('model:state-changed', this.state);
  }
}
export default Model;
