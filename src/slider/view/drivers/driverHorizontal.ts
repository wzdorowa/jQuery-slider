import { IModelState } from '../../interfaces/iModelState';
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
    scale: HTMLElement,
    max: number,
    min: number,
  ): number {
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
    modelState: IModelState,
    activeRange: HTMLElement,
    scale: HTMLElement,
  ): void {
    new Array(elements.length)
      .fill(1)
      .forEach((_element: number, i: number) => {
        const thumb = elements[i];
        const indentLeft = String(
          Math.ceil(
            driverHorizontal.calculateCoefficientPoint(
              scale,
              modelState.max,
              modelState.min,
            ) * modelState.thumbsValues[i],
          ),
        );
        thumb.style.left = `${indentLeft}px`;
      });

    const range = activeRange;
    const marginLeft = String(driverHorizontal.getElementOffset(elements[0]));
    const width = String(
      driverHorizontal.getElementOffset(elements[elements.length - 1]) -
        driverHorizontal.getElementOffset(elements[0]),
    );
    range.style.marginLeft = `${marginLeft}px`;
    range.style.width = `${width}px`;
  },
  setInPlaceNewThumb(
    elements: HTMLElement[],
    currentThumbIndex: number | null,
    coefficientPoint: number,
    modelState: IModelState,
    shiftToMinValue: number,
    activeRange: HTMLElement,
  ): void {
    const range = activeRange;
    new Array(elements.length)
      .fill(1)
      .forEach((_element: number, i: number) => {
        if (i !== currentThumbIndex) {
          const thumb = elements[i];
          const indentLeft = String(
            Math.ceil(coefficientPoint * modelState.thumbsValues[i]) -
              shiftToMinValue,
          );
          thumb.style.top = '';
          thumb.style.left = `${indentLeft}px`;
        }
      });
    range.style.marginTop = '';
    range.style.height = '';

    const marginLeft = String(driverHorizontal.getElementOffset(elements[0]));
    const width = String(
      driverHorizontal.getElementOffset(elements[elements.length - 1]) -
        driverHorizontal.getElementOffset(elements[0]),
    );
    range.style.marginLeft = `${marginLeft}px`;
    range.style.width = `${width}px`;
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
  getMaxValueAxisToProcessStart(scale: HTMLElement): number {
    return scale.offsetWidth;
  },
  getCurrentValueAxisToProcessMove(
    eventThumb: MouseEvent,
    startXorY: number,
  ): number {
    return eventThumb.pageX - startXorY;
  },
  setIndentForTarget(target: HTMLElement, currentXorY: number): void {
    const element = target;
    const indentLeft = String(currentXorY);
    element.style.left = `${indentLeft}px`;
  },
  getTargetWidth(target: HTMLElement): number {
    return target.offsetWidth;
  },
  setIndentForTargetToProcessStop(
    target: HTMLElement,
    coefficientPoint: number,
    currentValue: number,
    shiftToMinValue: number,
  ): void {
    const element = target;
    const indentLeft = String(
      Math.ceil(coefficientPoint * currentValue) - shiftToMinValue,
    );
    element.style.left = `${indentLeft}px`;
  },
  updateActiveRange(activeRange: HTMLElement, elements: HTMLElement[]): void {
    const range = activeRange;
    const marginLeft = String(driverHorizontal.getElementOffset(elements[0]));
    const width = String(
      driverHorizontal.getElementOffset(elements[elements.length - 1]) -
        driverHorizontal.getElementOffset(elements[0]),
    );
    range.style.marginLeft = `${marginLeft}px`;
    range.style.width = `${width}px`;
  },
  calculateClickLocation(event: MouseEvent, target: HTMLElement): number {
    return event.offsetX + target.offsetLeft;
  },
  getOffsetFromClick(event: MouseEvent): number {
    return event.offsetX;
  },
};
export default driverHorizontal;
