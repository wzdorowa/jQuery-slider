import createElement from '../functions/createElement';
import { IModelState } from '../interfaces/iModelState';
import { IDriver } from '../interfaces/iDriver';
import driverHorizontal from './drivers/driverHorizontal';
import driverVertical from './drivers/driverVertical';

class Tooltips {
  private slider: HTMLElement;

  private tooltipsElements: HTMLElement[];

  private textInTooltips!: HTMLElement[];

  private tooltipsValues: number[];

  private thumbsCount: number;

  private orientation: string | null;

  private driver: IDriver | null;

  private isTooltip: boolean | null;

  constructor(element: HTMLElement) {
    this.slider = element;
    this.tooltipsElements = [];
    this.textInTooltips = [];
    this.tooltipsValues = [];
    this.thumbsCount = 0;
    this.orientation = null;
    this.driver = null;
    this.isTooltip = null;
  }

  public initializeTooltips(state: IModelState): void {
    if (this.thumbsCount !== state.thumbsCount) {
      this.thumbsCount = state.thumbsCount;
    }
    if (this.tooltipsValues !== state.thumbsValues) {
      this.tooltipsValues = state.thumbsValues;
    }
    if (this.orientation !== state.orientation) {
      this.orientation = state.orientation;
    }
    if (state.orientation === 'horizontal') {
      this.driver = driverHorizontal;
    } else if (state.orientation === 'vertical') {
      this.driver = driverVertical;
    }

    this.createTooltips(this.thumbsCount);
    this.setTooltipsValues();

    if (state.isTooltip) {
      this.isTooltip = true;
      this.showTooltip();
    } else if (!state.isTooltip) {
      this.isTooltip = false;
      this.hideTooltip();
    }
  }

  public setConfig(state: IModelState): void {
    if (this.thumbsCount !== state.thumbsCount) {
      this.thumbsCount = state.thumbsCount;
      this.changeCountTooltips(state.isTooltip);
    }
    if (this.tooltipsValues !== state.thumbsValues) {
      this.tooltipsValues = state.thumbsValues;
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
      if (state.orientation === 'horizontal') {
        this.driver = driverHorizontal;
      }
      if (state.orientation === 'vertical') {
        this.driver = driverVertical;
      }
      this.orientation = state.orientation;
      this.changeOrientation();
      this.setTooltipsValues();
    }
    this.setTooltipsValues();
  }

  /* createTooltips function adds tooltip elements to the main html slider structure */
  private createTooltips(thumbsCount: number): void {
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
  private setTooltipsValues(): void {
    this.tooltipsValues.forEach((element: number, i: number) => {
      this.textInTooltips[i].innerHTML = String(element);
    });
  }

  /* changes the number of rendered tooltips */
  private changeCountTooltips(isTooltip: boolean): void {
    if (this.tooltipsElements.length < this.thumbsCount) {
      const thumbsCount: number =
        this.thumbsCount - this.tooltipsElements.length;
      this.createTooltips(thumbsCount);
      if (!isTooltip) {
        this.hideTooltip();
      }
    }
    if (this.tooltipsElements.length > this.thumbsCount) {
      const excessCount: number =
        this.tooltipsElements.length - this.thumbsCount;

      new Array(excessCount).fill(1).forEach(() => {
        this.tooltipsElements.splice(-1, 1);
        this.textInTooltips.splice(-1, 1);
      });
    }
    if (this.tooltipsValues.length > this.thumbsCount) {
      const excessCount: number = this.tooltipsValues.length - this.thumbsCount;

      new Array(excessCount).fill(1).forEach(() => {
        this.tooltipsValues.splice(-1, 1);
      });
    }
  }

  /* redraws tooltips when orientation changes */
  private changeOrientation(): void {
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

  /* hideTooltip method hides sliders tooltips */
  private hideTooltip(): void {
    const $allTooltips: HTMLElement[] = Array.from(
      $(this.slider).find('.js-slider__tooltip'),
    );

    $allTooltips.forEach((element: HTMLElement): void => {
      element.classList.add('slider__tooltip-hide');
    });
  }

  /* showTooltip method shows sliders tooltips */
  private showTooltip(): void {
    const $allTooltips: HTMLElement[] = Array.from(
      $(this.slider).find('.js-slider__tooltip'),
    );
    $allTooltips.forEach((element: HTMLElement): void => {
      element.classList.remove('slider__tooltip-hide');
    });
  }
}
export default Tooltips;
