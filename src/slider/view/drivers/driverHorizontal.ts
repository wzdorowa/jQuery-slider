import { IDriver } from '../../interfaces/iDriver';
import createElement from '../../functions/createElement';

const driverHorizontal: IDriver = {
  getElementOffset(element: HTMLElement): number {
    return element.offsetLeft;
  },
  createElementTooltipText(): HTMLElement {
    const element: HTMLElement = createElement(
      'span',
      'slider__tooltip-text js-slider__tooltip-text',
    );
    return element;
  },
  createElementScale(): HTMLElement {
    const element: HTMLElement = createElement(
      'div',
      'slider__scale js-slider__scale',
    );
    return element;
  },
  createElementActiveRange(): HTMLElement {
    const element: HTMLElement = createElement(
      'span',
      'slider__active-range js-slider__active-range',
    );
    return element;
  },
  searchElementsTooltipText(slider: HTMLElement): HTMLElement[] {
    const $elements: HTMLElement[] = Array.from(
      $(slider).find('.js-slider__vertical-tooltip-text'),
    );
    return $elements;
  },
  calculateCoefficientPoint(
    slider: HTMLElement,
    max: number,
    min: number,
  ): number {
    const $elements: HTMLElement[] = Array.from(
      $(slider).find('.js-slider__scale'),
    );
    const scale = $elements[0];
    return scale.offsetWidth / (max - min);
  },
  searchElementScaleToDelete(slider: HTMLElement): JQuery<HTMLElement> {
    const $element: JQuery<HTMLElement> = $(slider).find(
      '.js-slider__vertical-scale',
    );
    return $element;
  },
  searchElementActiveRangeToDelete(slider: HTMLElement): JQuery<HTMLElement> {
    const $element: JQuery<HTMLElement> = $(slider).find(
      '.js-slider__vertical-active-range',
    );
    return $element;
  },
  setInPlaceThumb(
    elements: HTMLElement[],
    currentThumbIndex: number | null,
    coefficientPoint: number,
    thumbsValues: number[],
    shiftToMinValue: number,
    slider: HTMLElement,
  ): void {
    new Array(elements.length)
      .fill(1)
      .forEach((_element: number, i: number) => {
        if (i !== currentThumbIndex) {
          const thumb = elements[i];
          const indentLeft = String(
            Math.ceil(coefficientPoint * thumbsValues[i]) - shiftToMinValue,
          );
          thumb.style.top = '';
          thumb.style.left = `${indentLeft}px`;
        }
      });
    this.updateActiveRange(slider);
  },
  getCurrentValueAxisToProcessStart(target: HTMLElement): number {
    return target.offsetLeft;
  },
  getStartValueAxisToProcessStart(
    eventThumb: MouseEvent,
    currentXorY: number,
  ): number {
    return eventThumb.pageX - currentXorY;
  },
  getMaxValueAxisToProcessStart(slider: HTMLElement): number {
    const $elements: HTMLElement[] = Array.from(
      $(slider).find('.js-slider__scale'),
    );
    const scale = $elements[0];
    return scale.offsetWidth;
  },
  getCurrentValueAxisToProcessMove(
    eventThumb: MouseEvent,
    startXorY: number,
  ): number {
    return eventThumb.pageX - startXorY;
  },
  setIndentForTarget(
    target: HTMLElement,
    currentXorY: number,
    slider: HTMLElement,
  ): void {
    const element = target;
    const indentLeft = String(currentXorY);
    element.style.left = `${indentLeft}px`;

    this.updateActiveRange(slider);
  },
  setIndentForTargetToProcessStop(
    target: HTMLElement,
    coefficientPoint: number,
    currentValue: number,
    shiftToMinValue: number,
    slider: HTMLElement,
  ): void {
    const element = target;
    const indentLeft = String(
      Math.ceil(coefficientPoint * currentValue) - shiftToMinValue,
    );
    element.style.left = `${indentLeft}px`;

    this.updateActiveRange(slider);
  },
  updateActiveRange(slider: HTMLElement): void {
    const $activeRangeElement: HTMLElement[] = Array.from(
      $(slider).find('.js-slider__active-range'),
    );
    const range = $activeRangeElement[0];
    const $allThumbs: HTMLElement[] = Array.from(
      $(slider).find('.js-slider__thumb'),
    );

    range.style.marginTop = '';
    range.style.height = '';

    if ($allThumbs.length === 1) {
      const widthActiveRange = String(
        driverHorizontal.getElementOffset($allThumbs[0]),
      );
      range.style.marginLeft = `0px`;
      range.style.width = `${widthActiveRange}px`;
    } else if ($allThumbs.length > 1) {
      const marginLeft = String(
        driverHorizontal.getElementOffset($allThumbs[0]),
      );
      const widthActiveRange = String(
        driverHorizontal.getElementOffset($allThumbs[$allThumbs.length - 1]) -
          driverHorizontal.getElementOffset($allThumbs[0]),
      );
      range.style.marginLeft = `${marginLeft}px`;
      range.style.width = `${widthActiveRange}px`;
    }
  },
  calculateClickLocation(
    event: MouseEvent,
    target: HTMLElement,
    shiftToMinValue: number,
  ): number {
    return event.offsetX + target.offsetLeft + shiftToMinValue;
  },
  getOffsetFromClick(event: MouseEvent): number {
    return event.offsetX;
  },
};
export default driverHorizontal;
