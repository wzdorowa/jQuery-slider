import { IDriver } from '../../interfaces/iDriver';
import createElement from '../../functions/createElement';

const driverHorizontal: IDriver = {
  getElementOffset(element: HTMLElement): number {
    return element.offsetLeft;
  },
  getOffsetNextThumb(element: HTMLElement, stepWidth: number): number {
    return this.getElementOffset(element) - stepWidth;
  },
  getOffsetPreviousThumb(element: HTMLElement, stepWidth: number): number {
    return this.getElementOffset(element) + stepWidth;
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
  createElementScaleValue(): HTMLElement {
    const element: HTMLElement = createElement(
      'div',
      'slider__scale-value js-slider__scale-value',
    );
    return element;
  },
  createElementScaleValueContainer(): HTMLElement {
    const element: HTMLElement = createElement(
      'div',
      'slider__scale-value-container js-slider__scale-value-container',
    );
    return element;
  },
  createElementScaleValueWithNumber(): HTMLElement {
    const element: HTMLElement = createElement(
      'span',
      'slider__scale-value-with-number js-slider__scale-value-with-number',
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
  searchElementScaleValueToDelete(slider: HTMLElement): HTMLElement[] {
    const $elements: HTMLElement[] = Array.from(
      $(slider).find('.js-slider__scale-value'),
    );
    return $elements;
  },
  searchElementScaleValueContainerToDelete(
    slider: HTMLElement,
  ): JQuery<HTMLElement> {
    const $element: JQuery<HTMLElement> = $(slider).find(
      '.js-slider__vertical-scale-value-container',
    );
    return $element;
  },
  searchElementScaleValueBaseContainerToDelete(
    slider: HTMLElement,
  ): HTMLElement {
    const $elements: HTMLElement[] = Array.from(
      $(slider).find('.js-slider__scale-value-container'),
    );
    return $elements[0];
  },
  setInPlaceElement({
    elements,
    currentThumbIndex,
    coefficientPoint,
    elementsValues,
    shiftToMinValue,
  }: {
    elements: HTMLElement[];
    currentThumbIndex: number | null;
    coefficientPoint: number;
    elementsValues: number[];
    shiftToMinValue: number;
  }): void {
    new Array(elements.length)
      .fill(1)
      .forEach((_element: number, i: number) => {
        if (i !== currentThumbIndex) {
          const element = elements[i];
          let indentLeft = '';
          if (i === elements.length - 1) {
            indentLeft = String(
              Math.ceil(coefficientPoint * elementsValues[i]) -
                shiftToMinValue -
                1,
            );
          } else {
            indentLeft = String(
              Math.ceil(coefficientPoint * elementsValues[i]) - shiftToMinValue,
            );
          }
          element.style.marginTop = '0px';
          element.style.marginLeft = `${indentLeft}px`;
        }
      });
  },
  setInPlaceThumb({
    elements,
    currentThumbIndex,
    coefficientPoint,
    thumbsValues,
    shiftToMinValue,
    slider,
  }: {
    elements: HTMLElement[];
    currentThumbIndex: number | null;
    coefficientPoint: number;
    thumbsValues: number[];
    shiftToMinValue: number;
    slider: HTMLElement;
  }): void {
    new Array(elements.length)
      .fill(1)
      .forEach((_element: number, i: number) => {
        if (i !== currentThumbIndex) {
          const element = elements[i];
          const indentLeft = String(
            Math.ceil(coefficientPoint * thumbsValues[i]) - shiftToMinValue,
          );
          element.style.top = '';
          element.style.left = `${indentLeft}px`;
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
  setIndentForTargetToProcessStop({
    target,
    coefficientPoint,
    currentValue,
    shiftToMinValue,
    slider,
  }: {
    target: HTMLElement;
    coefficientPoint: number;
    currentValue: number;
    shiftToMinValue: number;
    slider: HTMLElement;
  }): void {
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
  calculateClickLocationOnScaleValue(
    event: MouseEvent,
    shiftToMinValue: number,
    slider: HTMLElement,
  ): number {
    const scale = Array.from($(slider).find('.js-slider__scale'));
    const startAxis = scale[0].getBoundingClientRect();

    const offsetX = event.pageX - startAxis.x;
    return offsetX + shiftToMinValue;
  },
  getOffsetFromClick(event: MouseEvent): number {
    return event.offsetX;
  },
};
export default driverHorizontal;