import { IDriver } from '../../interfaces/iDriver';
import createElement from '../../functions/createElement';

const driverVertical: IDriver = {
  getElementOffset(element: HTMLElement): number {
    return element.offsetTop;
  },
  createElementTooltipText(): HTMLElement {
    const element: HTMLElement = createElement(
      'span',
      'slider__vertical-tooltip-text js-slider__vertical-tooltip-text',
    );
    return element;
  },
  createElementScale(): HTMLElement {
    const element: HTMLElement = createElement(
      'div',
      'slider__vertical-scale js-slider__vertical-scale',
    );
    return element;
  },
  createElementActiveRange(): HTMLElement {
    const element: HTMLElement = createElement(
      'span',
      'slider__vertical-active-range js-slider__vertical-active-range',
    );
    return element;
  },
  searchElementsTooltipText(slider: HTMLElement): HTMLElement[] {
    const $elements: HTMLElement[] = Array.from(
      $(slider).find('.js-slider__tooltip-text'),
    );
    return $elements;
  },
  searchElementScaleToDelete(slider: HTMLElement): JQuery<HTMLElement> {
    const $element: JQuery<HTMLElement> = $(slider).find('.js-slider__scale');
    return $element;
  },
  searchElementActiveRangeToDelete(slider: HTMLElement): JQuery<HTMLElement> {
    const $element: JQuery<HTMLElement> = $(slider).find(
      '.js-slider__active-range',
    );
    return $element;
  },
  calculateCoefficientPoint(
    slider: HTMLElement,
    max: number,
    min: number,
  ): number {
    const $elements: HTMLElement[] = Array.from(
      $(slider).find('.js-slider__vertical-scale'),
    );
    const scale = $elements[0];
    return scale.offsetHeight / (max - min);
  },
  setInPlaceThumb(
    elements: HTMLElement[],
    min: number,
    max: number,
    thumbsValues: number[],
    slider: HTMLElement,
  ): void {
    const $activeRangeElement: HTMLElement[] = Array.from(
      $(slider).find('.js-slider__vertical-active-range'),
    );
    const range = $activeRangeElement[0];
    new Array(elements.length)
      .fill(1)
      .forEach((_element: number, i: number) => {
        const thumb = elements[i];
        const indentTop = String(
          Math.ceil(
            driverVertical.calculateCoefficientPoint(slider, max, min) *
              thumbsValues[i],
          ),
        );
        thumb.style.top = `${indentTop}px`;
      });
    if (elements.length === 1) {
      const height = String(driverVertical.getElementOffset(elements[0]));
      range.style.marginTop = `0px`;
      range.style.width = `${height}px`;
    } else if (elements.length > 1) {
      const marginTop = String(driverVertical.getElementOffset(elements[0]));
      const height = String(
        driverVertical.getElementOffset(elements[elements.length - 1]) -
          driverVertical.getElementOffset(elements[0]),
      );
      range.style.marginTop = `${marginTop}px`;
      range.style.height = `${height}px`;
    }
  },
  setInPlaceNewThumb(
    elements: HTMLElement[],
    currentThumbIndex: number | null,
    coefficientPoint: number,
    thumbsValues: number[],
    shiftToMinValue: number,
    slider: HTMLElement,
  ): void {
    const $activeRangeElement: HTMLElement[] = Array.from(
      $(slider).find('.js-slider__vertical-active-range'),
    );
    const range = $activeRangeElement[0];
    new Array(elements.length)
      .fill(1)
      .forEach((_element: number, i: number) => {
        if (i !== currentThumbIndex) {
          const thumb = elements[i];
          const indentTop = String(
            Math.ceil(coefficientPoint * thumbsValues[i]) - shiftToMinValue,
          );
          thumb.style.left = '';
          thumb.style.top = `${indentTop}px`;
        }
      });
    range.style.marginLeft = '';
    range.style.width = '';

    if (elements.length === 1) {
      const height = String(driverVertical.getElementOffset(elements[0]));

      range.style.marginTop = `0px`;
      range.style.height = `${height}px`;
    } else if (elements.length > 1) {
      const marginTop = String(driverVertical.getElementOffset(elements[0]));
      const height = String(
        driverVertical.getElementOffset(elements[elements.length - 1]) -
          driverVertical.getElementOffset(elements[0]),
      );
      range.style.marginTop = `${marginTop}px`;
      range.style.height = `${height}px`;
    }
  },
  getCurrentValueAxisToProcessStart(target: HTMLElement): number {
    return target.offsetTop;
  },
  getStartValueAxisToProcessStart(
    eventThumb: MouseEvent,
    currentXorY: number,
  ): number {
    return eventThumb.pageY - currentXorY;
  },
  getMaxValueAxisToProcessStart(slider: HTMLElement): number {
    const $elements: HTMLElement[] = Array.from(
      $(slider).find('.js-slider__vertical-scale'),
    );
    const scale = $elements[0];
    return scale.offsetHeight;
  },
  getCurrentValueAxisToProcessMove(
    eventThumb: MouseEvent,
    startXorY: number,
  ): number {
    return eventThumb.pageY - startXorY;
  },
  setIndentForTarget(target: HTMLElement, currentXorY: number): void {
    const element = target;
    const indentTop = String(currentXorY);
    element.style.top = `${indentTop}px`;
  },
  setIndentForTargetToProcessStop(
    target: HTMLElement,
    coefficientPoint: number,
    currentValue: number,
    shiftToMinValue: number,
  ): void {
    const element = target;
    const indentTop = String(
      Math.ceil(coefficientPoint * currentValue) - shiftToMinValue,
    );
    element.style.top = `${indentTop}px`;
  },
  updateActiveRange(activeRange: HTMLElement, elements: HTMLElement[]): void {
    const range = activeRange;
    const marginTop = String(driverVertical.getElementOffset(elements[0]));
    const height = String(
      driverVertical.getElementOffset(elements[elements.length - 1]) -
        driverVertical.getElementOffset(elements[0]),
    );
    range.style.marginTop = `${marginTop}px`;
    range.style.height = `${height}px`;
  },
  calculateClickLocation(event: MouseEvent, target: HTMLElement): number {
    return event.offsetY + target.offsetTop;
  },
  getOffsetFromClick(event: MouseEvent): number {
    return event.offsetY;
  },
};
export default driverVertical;
