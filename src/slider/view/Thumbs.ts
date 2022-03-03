import EventEmitter from '../EventEmitter';
import createElement from '../functions/createElement';
import { IModelState } from '../interfaces/iModelState';
import { IAdapter } from '../interfaces/IAdapter';
import utilities from './utilities/utilities';

class Thumbs {
  private slider: HTMLElement;

  private emitter: EventEmitter;

  private adapter: IAdapter | null;

  private thumbs: HTMLElement[];

  private coefficientPoint: number;

  private shiftToMinValue: number;

  private valueAxisFromStartMove: number;

  private thumbValueAxis: number | null;

  private startValueAxis: number;

  private maxValueAxis: number;

  private target: HTMLElement | null;

  private lastStep: number;

  private step: number;

  private thumbsValues: number[];

  private indexActiveThumb: number | null;

  private currentValue: number;

  private max: number;

  private min: number;

  constructor(element: HTMLElement, eventEmitter: EventEmitter) {
    this.slider = element;
    this.emitter = eventEmitter;
    this.adapter = null;
    this.thumbs = [];
    this.coefficientPoint = 0;
    this.shiftToMinValue = 0;
    this.valueAxisFromStartMove = 0;
    this.thumbValueAxis = null;
    this.startValueAxis = 0;
    this.maxValueAxis = 0;
    this.target = null;
    this.lastStep = 0;
    this.step = 0;
    this.thumbsValues = [];
    this.indexActiveThumb = null;
    this.currentValue = 0;
    this.min = 0;
    this.max = 100;
  }

  public initializeThumbs(state: IModelState, adapter: IAdapter): void {
    this.adapter = adapter;

    this.step = state.step;
    this.thumbsValues = state.thumbsValues;
    this.min = state.min;
    this.max = state.max;

    const scale: HTMLElement | null = this.slider.querySelector(
      '.js-slider__scale',
    );
    if (scale !== null) {
      this.coefficientPoint =
        scale[this.adapter.offsetLength] / (state.max - state.min);
    }

    this.shiftToMinValue = this.coefficientPoint * state.min;

    this.createThumbs(state.thumbsCount);
    this.listenThumbsEvents();
    this.setValuesThumbs(state.thumbsValues, null);
  }

  /* the CreateSlider function adds sliders to the parent of the slider */
  private createThumbs(thumbsCount: number): void {
    this.thumbs = [];
    const thumbs = this.slider.querySelectorAll('.js-slider__thumb');
    if (thumbs !== null) {
      thumbs.forEach(thumb => {
        thumb.remove();
      });
    }
    const htmlFragment = document.createDocumentFragment();
    new Array(thumbsCount).fill(1).forEach(() => {
      const thumb: HTMLElement = createElement(
        'div',
        'slider__thumb js-slider__thumb',
      );

      this.thumbs.push(thumb);
      htmlFragment.append(thumb);
    });
    this.slider.append(htmlFragment);
  }

  /* hangs the 'mousedown' event handler for each created thumb */
  private listenThumbsEvents(): void {
    this.thumbs.forEach((element: HTMLElement, i: number) => {
      element.addEventListener(
        'mousedown',
        this.handleThumbStart.bind(this, i),
      );
    });
  }

  /* places thumbs on the slider based on default values */
  public setValuesThumbs(thumbsValues: number[], index: number | null): void {
    this.thumbs.forEach((_element, i) => {
      if (this.adapter?.direction !== undefined) {
        if (i !== index) {
          const element = this.thumbs[i];
          const indent = String(
            this.coefficientPoint * thumbsValues[i] - this.shiftToMinValue,
          );

          element.style[this.adapter?.direction] = `${indent}px`;
        }
      }
    });
  }

  private updateThumbPositionOnScale(
    index: number,
    currentValueAxis: number,
    step: number,
    thumbsValues: number[],
  ): void {
    let currentValue = utilities.calculateValue(
      currentValueAxis,
      this.coefficientPoint,
      this.shiftToMinValue,
    );

    if (step < 1) {
      currentValue = Math.round(currentValue * 10) / 10;
    } else {
      currentValue = Math.round(currentValue);
    }

    if (thumbsValues[index] !== currentValue) {
      this.emitter.emit('view:thumbValue-changed', {
        value: currentValue,
        index,
      });
    }
  }

  private processStart(event: MouseEvent, index: number): void {
    event.preventDefault();
    this.indexActiveThumb = index;

    const elements: HTMLElement[] = this.thumbs;
    this.target = elements[index];

    let currentValueAxis;

    if (this.adapter !== null) {
      currentValueAxis = this.target[this.adapter?.offsetDirection];

      const stepWidth: number = this.step * this.coefficientPoint;

      this.lastStep = Math.round(((this.max - this.min) % this.step) * 10) / 10;

      this.startValueAxis = index * stepWidth;

      this.valueAxisFromStartMove = event.pageX - currentValueAxis;

      const scale: HTMLElement | null = this.slider.querySelector(
        '.js-slider__scale',
      );

      if (scale !== null) {
        this.maxValueAxis = scale.offsetWidth;
      }

      if (this.lastStep > 0) {
        if (index < elements.length - 1) {
          this.maxValueAxis =
            this.maxValueAxis -
            (elements.length - 2 - index) * stepWidth -
            this.lastStep * this.coefficientPoint;
        }
      } else {
        this.maxValueAxis -= (elements.length - 1 - index) * stepWidth;
      }

      this.thumbValueAxis = utilities.calculateValueAxis(
        this.thumbsValues[index],
        this.coefficientPoint,
        this.shiftToMinValue,
      );
    }

    document.addEventListener('mousemove', this.handleThumbMove.bind(this));
    document.addEventListener('mouseup', this.handleThumbStop.bind(this));
  }

  private processMove(event: MouseEvent): void {
    const isValid =
      this.indexActiveThumb !== null &&
      this.thumbValueAxis !== null &&
      this.target !== null;

    let currentValueAxis;

    if (isValid && this.indexActiveThumb !== null) {
      const currentValue = this.thumbsValues[this.indexActiveThumb];

      if (this.target !== null && this.adapter !== null) {
        currentValueAxis =
          event[this.adapter?.pageAxis] - this.valueAxisFromStartMove;

        if (currentValueAxis > this.maxValueAxis) {
          currentValueAxis = this.maxValueAxis;
        }

        if (currentValueAxis < this.startValueAxis) {
          currentValueAxis = this.startValueAxis;
        }

        if (this.step <= 1) {
          this.target.style[this.adapter.direction] = `${currentValueAxis}px`;

          this.thumbValueAxis = currentValueAxis;
          if (this.indexActiveThumb !== null) {
            this.updateThumbPositionOnScale(
              this.indexActiveThumb,
              currentValueAxis,
              this.step,
              this.thumbsValues,
            );
          }
        } else {
          const stepWidth: number = this.step * this.coefficientPoint;

          if (this.thumbValueAxis !== null) {
            const previousHalfStep = this.thumbValueAxis - stepWidth / 2;
            const nextHalfStep = this.thumbValueAxis + stepWidth / 2;
            const lastHalfStep =
              this.maxValueAxis - (this.lastStep * this.coefficientPoint) / 2;

            const previousThumbAxisValue = this.thumbValueAxis - stepWidth;
            const nextThumbAxisValue = this.thumbValueAxis + stepWidth;

            if (currentValue === this.max && this.lastStep > 0) {
              if (currentValueAxis < lastHalfStep) {
                const penultimateValue =
                  this.maxValueAxis - this.lastStep * this.coefficientPoint;

                this.target.style[
                  this.adapter.direction
                ] = `${penultimateValue}px`;

                currentValueAxis = penultimateValue;
                this.thumbValueAxis = penultimateValue;
                if (this.indexActiveThumb !== null) {
                  this.updateThumbPositionOnScale(
                    this.indexActiveThumb,
                    currentValueAxis,
                    this.step,
                    this.thumbsValues,
                  );
                }
              }
            } else if (currentValueAxis < previousHalfStep) {
              this.target.style[
                this.adapter.direction
              ] = `${previousThumbAxisValue}px`;

              currentValueAxis = previousThumbAxisValue;
              this.thumbValueAxis = previousThumbAxisValue;
              if (this.indexActiveThumb !== null) {
                this.updateThumbPositionOnScale(
                  this.indexActiveThumb,
                  currentValueAxis,
                  this.step,
                  this.thumbsValues,
                );
              }
            } else if (currentValueAxis > nextHalfStep) {
              this.target.style[
                this.adapter.direction
              ] = `${nextThumbAxisValue}px`;

              currentValueAxis = nextThumbAxisValue;
              this.thumbValueAxis = nextThumbAxisValue;
              if (this.indexActiveThumb !== null) {
                this.updateThumbPositionOnScale(
                  this.indexActiveThumb,
                  currentValueAxis,
                  this.step,
                  this.thumbsValues,
                );
              }
            } else if (currentValueAxis > lastHalfStep) {
              this.target.style[
                this.adapter.direction
              ] = `${this.maxValueAxis}px`;

              currentValueAxis = this.maxValueAxis;
              this.thumbValueAxis = this.maxValueAxis;
              if (this.indexActiveThumb !== null) {
                this.updateThumbPositionOnScale(
                  this.indexActiveThumb,
                  currentValueAxis,
                  this.step,
                  this.thumbsValues,
                );
              }
            }
          }
        }
      }
    }
  }

  private processStop(): void {
    if (this.adapter !== null) {
      if (this.target !== null) {
        const indentLeft =
          this.coefficientPoint * this.currentValue - this.shiftToMinValue;

        this.target.style[this.adapter?.direction] = `${indentLeft}px`;
      }
    }
    this.indexActiveThumb = null;

    document.removeEventListener('mousemove', this.handleThumbMove.bind(this));
    document.removeEventListener('mouseup', this.handleThumbStop.bind(this));
  }

  private handleThumbStart(index: number, event: MouseEvent): void {
    this.processStart(event, index);
  }

  private handleThumbMove(event: MouseEvent): void {
    this.processMove(event);
  }

  private handleThumbStop(): void {
    this.processStop.call(this);
  }
}
export default Thumbs;
