import createElement from '../functions/createElement';
import { IModelState } from '../interfaces/iModelState';
import { IDriver } from '../interfaces/iDriver';

class Tooltips {
  private slider: HTMLElement;

  public tooltipsElements: HTMLElement[];

  public textInTooltips!: HTMLElement[];

  constructor(element: HTMLElement) {
    this.slider = element;
    this.tooltipsElements = [];
    this.textInTooltips = [];
  }

  /* createTooltips function adds tooltip elements to the main html slider structure */
  createTooltips(
    amount: number,
    sliders: HTMLElement[],
    driver: IDriver,
  ): void {
    new Array(amount).fill(1).forEach((_element: number, i: number) => {
      const tooltip: HTMLElement = createElement(
        'div',
        'slider__tooltip js-slider__tooltip',
      );
      const textInTooltips: HTMLElement = driver.createElementTooltipText();

      tooltip.append(textInTooltips);
      sliders[sliders.length - (amount - i)].append(tooltip);
      this.tooltipsElements.push(tooltip);
      this.textInTooltips.push(textInTooltips);
    });
  }

  /* sets the default sliders for their respective tooltips */
  setTooltipsValues(modelState: IModelState): void {
    modelState.thumbsValues.forEach((element: number, i: number) => {
      this.textInTooltips[i].innerHTML = String(element);
    });
  }

  /* changes the number of rendered tooltips */
  changeAmountTooltips(
    sliders: HTMLElement[],
    driver: IDriver,
    modelState: IModelState,
  ): void {
    if (this.tooltipsElements.length < modelState.thumbsValues.length) {
      const amount: number =
        modelState.thumbsValues.length - this.tooltipsElements.length;
      this.createTooltips(amount, sliders, driver);
    }
    if (this.tooltipsElements.length > modelState.thumbsValues.length) {
      const excessAmount: number =
        this.tooltipsElements.length - modelState.thumbsValues.length;

      new Array(excessAmount).fill(1).forEach(() => {
        this.tooltipsElements.splice(-1, 1);
        this.textInTooltips.splice(-1, 1);
      });
    }
  }

  /* redraws tooltips when orientation changes */
  changeOrientation(driver: IDriver): void {
    const $tooltips: HTMLElement[] = Array.from(
      $(this.slider).find('.js-slider__tooltip'),
    );
    this.textInTooltips = [];
    const textInTooltips: HTMLElement[] = driver.searchElementsTooltipText(
      this.slider,
    );
    textInTooltips.forEach((element: HTMLElement) => {
      element.remove();
    });
    $tooltips.forEach((element: HTMLElement) => {
      const tooltipText: HTMLElement = driver.createElementTooltipText();
      element.append(tooltipText);
      this.textInTooltips.push(tooltipText);
    });
  }

  /* the method sets the current value to the slider tooltip when it moves */
  setCurrentTooltipValue(modelState: IModelState, i: number): void {
    this.textInTooltips[i].innerHTML = String(modelState.thumbsValues[i]);
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
