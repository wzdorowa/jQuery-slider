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
    this.createTooltips(state.thumbsValues, state.orientation);
    this.setTooltipsValues(state.thumbsValues);
  }

  public setTooltipsValues(tooltipsValues: number[]): void {
    tooltipsValues.forEach((element: number, i: number) => {
      this.textInTooltips[i].innerHTML = String(element);
    });
  }

  private createTooltips(thumbsValues: number[], orientation: string): void {
    thumbsValues.forEach((_element: number, i: number) => {
      const tooltip: HTMLElement = createElement(
        'div',
        'slider__tooltip js-slider__tooltip',
      );
      const textInTooltips: HTMLElement = createElement(
        'span',
        'slider__tooltip-text js-slider__tooltip-text',
      );
      if (orientation === 'vertical') {
        tooltip.classList.add('slider__tooltip_vertical');
        textInTooltips.classList.add('slider__tooltip-text_vertical');
      }

      tooltip.append(textInTooltips);
      const thumbs = this.slider.querySelectorAll('.js-slider__thumb');
      thumbs[i].append(tooltip);
      this.tooltipsElements.push(tooltip);
      this.textInTooltips.push(textInTooltips);
    });
  }
}
export default Tooltips;
