import {IModelState} from '../../interfaces/iModelState';
import {IConfigurator} from '../../interfaces/iConfigurator';
import {createElement} from '../../functions/createElement';

export const configuratorVertical: IConfigurator = {
    getElementOffset(element: HTMLElement): number {
        return element.offsetTop;
    },
    createElementTooltipText(): HTMLElement {
        const element: HTMLElement = createElement('span', 'slider__vertical-tooltip-text js-slider__vertical-tooltip-text');
        return element;
    },
    createElementScale(): HTMLElement {
        const element: HTMLElement = createElement('div', 'slider__vertical-scale js-slider__vertical-scale');
        return element;
    },
    createElementActivRange(): HTMLElement {
        const element: HTMLElement = createElement('span', 'slider__vertical-active-range js-slider__vertical-active-range');
        return element;
    },
    searchElementsTooltipText(slider: HTMLElement): HTMLElement[] {
        const $elements: HTMLElement[] = Array.from($(slider).find('.js-slider__tooltip-text'));
        return $elements;
    },
    searchElementScaleToDelete(slider: HTMLElement): JQuery<HTMLElement> {
        const $element: JQuery<HTMLElement> = $(slider).find('.js-slider__scale');
        return $element;
    },
    searchElementActivRangeToDelete(slider: HTMLElement): JQuery<HTMLElement> {
        const $element: JQuery<HTMLElement> = $(slider).find('.js-slider__active-range');
        return $element;
    },
    calculateCoefficientPoint(scale: HTMLElement, max: number, min: number): number {
        return (scale.offsetHeight / (max - min));
    },
    setInPlaceThumb(elements: HTMLElement[], modelState: IModelState, activeRange: HTMLElement, scale: HTMLElement): void {
        new Array(elements.length)
            .fill(1)
            .forEach((_element: number, i: number) => {
                elements[i].style.top = String((Math.ceil(configuratorVertical.calculateCoefficientPoint(scale, modelState.max, modelState.min) * modelState.thumbsValues[i]))) + 'px';
            })

        activeRange.style.marginTop = String(configuratorVertical.getElementOffset(elements[0])) + 'px';
        activeRange.style.height = String((configuratorVertical.getElementOffset(elements[elements.length - 1]) - configuratorVertical.getElementOffset(elements[0]))) + 'px';
    },
    setInPlaceNewThumb(elements: HTMLElement[], currentThumbIndex: number | null, coefficientPoint: number, modelState: IModelState, shiftToMinValue: number, activeRange: HTMLElement): void {
        new Array(elements.length)
            .fill(1)
            .forEach((_element: number, i: number) => {
                if (i != currentThumbIndex) {
                    elements[i].style.left = "";
                    elements[i].style.top = String((Math.ceil(coefficientPoint * modelState.thumbsValues[i]) - shiftToMinValue)) + 'px';
                }
            })
        activeRange.style.marginLeft = "";
        activeRange.style.width = "";

        activeRange.style.marginTop = String(configuratorVertical.getElementOffset(elements[0])) + 'px';
        activeRange.style.height = String((configuratorVertical.getElementOffset(elements[elements.length - 1]) - configuratorVertical.getElementOffset(elements[0]))) + 'px';
    },
    getCurrentValueAxisToOnStart(target: HTMLElement): number {
        return target.offsetTop;
    },
    getStartValueAxisToOnStart(eventThumb: MouseEvent, currentXorY: number): number {
        return eventThumb.pageY - currentXorY;
    },
    getMaxValueAxisToOnStart(scale: HTMLElement): number {
        return scale.offsetHeight;
    },
    getCurrentValueAxisToOnMove(eventThumb: MouseEvent, startXorY: number): number {
        return eventThumb.pageY - startXorY;
    },
    setIndentForTarget(target: HTMLElement, currentXorY: number): void {
        target.style.top = String(currentXorY) + 'px';
    },
    getTargetWidth(target: HTMLElement): number {
        return target.offsetHeight;
    },
    setIndentForTargetToOnStop(target: HTMLElement, coefficientPoint: number, currentValue: number, shiftToMinValue: number): void {
        target.style.top = String(Math.ceil(coefficientPoint * currentValue) - shiftToMinValue)  + 'px';
    },
    updateActiveRange(activeRange: HTMLElement, elements: HTMLElement[]): void {
        activeRange.style.marginTop = String(configuratorVertical.getElementOffset(elements[0])) + 'px';
        activeRange.style.height = String((configuratorVertical.getElementOffset(elements[elements.length -1]) - configuratorVertical.getElementOffset(elements[0]))) + 'px';
    },
    calculateClickLocation(event: MouseEvent, target: HTMLElement): number {
        return event.offsetY + target.offsetTop;
    },
    getOffsetFromClick(event: MouseEvent): number {
        return event.offsetY
    }
};