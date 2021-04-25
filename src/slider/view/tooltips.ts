import createElement from '../functions/createElement';
import { IModelState } from '../interfaces/iModelState';
import { IDriver } from '../interfaces/iDriver';
import driverHorizontal from './drivers/driverHorizontal';
import driverVertical from './drivers/driverVertical';

class Tooltips {
  private slider: HTMLElement;

  public tooltipsElements: HTMLElement[];

  public textInTooltips!: HTMLElement[];

  public thumbsValues: number[];

  public thumbsCount: number;

  public orientation: string | null;

  public driver: IDriver | null;

  public isTooltip: boolean | null;

  constructor(element: HTMLElement) {
    this.slider = element;
    this.tooltipsElements = [];
    this.textInTooltips = [];
    this.thumbsValues = [];
    this.thumbsCount = 0;
    this.orientation = null;
    this.driver = null;
    this.isTooltip = null;
  }

  initializeTooltips(state: IModelState): void {
    if (this.thumbsCount !== state.thumbsCount) {
      this.thumbsCount = state.thumbsCount;
    }
    if (this.thumbsValues !== state.thumbsValues) {
      this.thumbsValues = state.thumbsValues;
    }
    if (this.orientation !== state.orientation) {
      this.orientation = state.orientation;
    }
    if (state.orientation === 'horizontal') {
      this.driver = driverHorizontal;
    } else if (state.orientation === 'vertical') {
      this.driver = driverVertical;
    }
    if (state.isTooltip) {
      this.isTooltip = true;
      this.showTooltip();
    } else if (!state.isTooltip) {
      this.isTooltip = false;
      this.hideTooltip();
    }

    this.createTooltips(this.thumbsCount);
    this.setTooltipsValues();
  }

  setConfig(state: IModelState): void {
    if (this.thumbsCount !== state.thumbsCount) {
      this.changeAmountTooltips();
      this.thumbsCount = state.thumbsCount;
    }
    if (this.thumbsValues !== state.thumbsValues) {
      this.setTooltipsValues();
      this.thumbsValues = state.thumbsValues;
    }
    if (this.isTooltip !== state.isTooltip) {
      if (state.isTooltip) {
        this.isTooltip = true;
        this.showTooltip();
      } else if (!state.isTooltip) {
        this.isTooltip = false;
        this.hideTooltip();
      }
    }
    if (this.orientation !== state.orientation) {
      this.changeOrientation();
      this.setTooltipsValues();
      this.orientation = state.orientation;
    }
  }

  /* createTooltips function adds tooltip elements to the main html slider structure */
  createTooltips(thumbsCount: number): void {
    new Array(thumbsCount).fill(1).forEach((_element: number, i: number) => {
      if (this.driver !== null) {
        const tooltip: HTMLElement = createElement(
          'div',
          'slider__tooltip js-slider__tooltip',
        );
        const textInTooltips: HTMLElement = this.driver.createElementTooltipText();

        tooltip.append(textInTooltips);
        const thumbs = this.slider.querySelectorAll('.js-slider__thumb');
        thumbs[thumbs.length - (thumbsCount - i)].append(tooltip);
        this.tooltipsElements.push(tooltip);
        this.textInTooltips.push(textInTooltips);
      }
    });
  }

  /* sets the default sliders for their respective tooltips */
  setTooltipsValues(): void {
    this.thumbsValues.forEach((element: number, i: number) => {
      this.textInTooltips[i].innerHTML = String(element);
    });
  }

  /* changes the number of rendered tooltips */
  changeAmountTooltips(): void {
    if (this.tooltipsElements.length < this.thumbsValues.length) {
      const thumbsCount: number =
        this.thumbsValues.length - this.tooltipsElements.length;
      this.createTooltips(thumbsCount);
    }
    if (this.tooltipsElements.length > this.thumbsValues.length) {
      const excessAmount: number =
        this.tooltipsElements.length - this.thumbsValues.length;

      new Array(excessAmount).fill(1).forEach(() => {
        this.tooltipsElements.splice(-1, 1);
        this.textInTooltips.splice(-1, 1);
      });
    }
  }

  /* redraws tooltips when orientation changes */
  changeOrientation(): void {
    if (this.driver !== null) {
      const $tooltips: HTMLElement[] = Array.from(
        $(this.slider).find('.js-slider__tooltip'),
      );
      this.textInTooltips = [];
      const textInTooltips: HTMLElement[] = this.driver.searchElementsTooltipText(
        this.slider,
      );
      textInTooltips.forEach((element: HTMLElement) => {
        element.remove();
      });
      $tooltips.forEach((element: HTMLElement) => {
        if (this.driver !== null) {
          const tooltipText: HTMLElement = this.driver.createElementTooltipText();
          element.append(tooltipText);
          this.textInTooltips.push(tooltipText);
        }
      });
    }
  }

  /* the method sets the current value to the slider tooltip when it moves */
  setCurrentTooltipValue(i: number): void {
    this.textInTooltips[i].innerHTML = String(this.thumbsValues[i]);
  }

  /* hideTooltip method hides sliders tooltips */
  hideTooltip(): void {
    const $allTooltips: HTMLElement[] = Array.from(
      $(this.slider).find('.js-slider__tooltip'),
    );
    $allTooltips.forEach((element: HTMLElement): void => {
      element.classList.add('slider__tooltip-hide');
    });
  }

  /* showTooltip method shows sliders tooltips */
  showTooltip(): void {
    const $allTooltips: HTMLElement[] = Array.from(
      $(this.slider).find('.js-slider__tooltip'),
    );
    $allTooltips.forEach((element: HTMLElement): void => {
      element.classList.remove('slider__tooltip-hide');
    });
  }
}
export default Tooltips;
