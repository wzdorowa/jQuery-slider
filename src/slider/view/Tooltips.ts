import createElement from '../functions/createElement';
import { IModelState } from '../interfaces/iModelState';

class Tooltips {
  private slider: HTMLElement;

  private tooltipsElements: HTMLElement[];

  private textInTooltips!: HTMLElement[];

  constructor(element: HTMLElement) {
    this.slider = element;
    this.tooltipsElements = [];
    this.textInTooltips = [];
  }

  public renderTooltips(state: IModelState): void {
    if (state.isTooltip) {
      this.createTooltips(state.thumbsCount, state.orientation);
      this.setTooltipsValues(state.thumbsValues);
    } else {
      this.removeTooltips();
    }
  }

  /* createTooltips function adds tooltip elements to the main html slider structure */
  private createTooltips(thumbsCount: number, orientation: string): void {
    this.removeTooltips();

    new Array(thumbsCount).fill(1).forEach((_element: number, i: number) => {
      const tooltip: HTMLElement = createElement(
        'div',
        'slider__tooltip js-slider__tooltip',
      );
      const textInTooltips: HTMLElement = createElement(
        'span',
        'slider__tooltip-text js-slider__tooltip-text',
      );
      if (orientation === 'vertical') {
        textInTooltips.classList.add('slider__tooltip-text_vertical');
      }

      tooltip.append(textInTooltips);
      const thumbs = this.slider.querySelectorAll('.js-slider__thumb');
      thumbs[thumbs.length - (thumbsCount - i)].append(tooltip);
      this.tooltipsElements.push(tooltip);
      this.textInTooltips.push(textInTooltips);
    });
  }

  private removeTooltips(): void {
    this.tooltipsElements = [];
    this.textInTooltips = [];
    const tooltips = this.slider.querySelectorAll('.js-slider__tooltip');

    if (tooltips !== null) {
      tooltips.forEach(element => {
        element.remove();
      });
    }
  }

  /* sets the default sliders for their respective tooltips */
  private setTooltipsValues(tooltipsValues: number[]): void {
    tooltipsValues.forEach((element: number, i: number) => {
      this.textInTooltips[i].innerHTML = String(element);
    });
  }
}
export default Tooltips;
