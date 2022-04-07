import createElement from '../functions/createElement';

class Tooltip {
  private textInTooltip: HTMLElement | null;

  constructor() {
    this.textInTooltip = null;
  }

  public setTooltipValue(tooltipValue: number): void {
    if (this.textInTooltip !== null) {
      this.textInTooltip.innerHTML = String(tooltipValue);
    }
  }

  public createTooltip(thumb: HTMLElement, orientation: string): void {
    const tooltip: HTMLElement = createElement(
      'div',
      'slider__tooltip js-slider__tooltip',
    );
    const textInTooltip: HTMLElement = createElement(
      'span',
      'slider__tooltip-text js-slider__tooltip-text',
    );
    if (orientation === 'vertical') {
      tooltip.classList.add('slider__tooltip_vertical');
      textInTooltip.classList.add('slider__tooltip-text_vertical');
    }

    tooltip.append(textInTooltip);
    thumb.append(tooltip);
    this.textInTooltip = textInTooltip;
  }
}
export default Tooltip;
