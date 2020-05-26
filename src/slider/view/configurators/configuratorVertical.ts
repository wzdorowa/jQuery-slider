import {IModelState} from '../../interfaces/iModelState';
import {IConfigurator} from '../../interfaces/iConfigurator';
import {createElement} from '../../functions/createElement';

export const configuratorVertical: IConfigurator = {
    getElementOffset(element: HTMLElement): number {
        return element.offsetTop;
    },
    createElementTooltipText(): HTMLElement {
        return createElement('span', 'slider-tooltip-text-for-verticalView');
    },
    createElementScale(): HTMLElement {
        return createElement('div', 'slider-line-for-verticalView');
    },
    createElementActivRange(): HTMLElement {
        return createElement('span', 'slider-line-span-for-verticalView');
    },
    searchElementsTooltipText(slider: HTMLElement): HTMLElement[] {
        return Array.from($(slider).find('.slider-tooltip-text'));
    },
    searchElementScaleToDelete(slider: HTMLElement): JQuery<HTMLElement> {
        return $(slider).find('.slider-line');
    },
    searchElementActivRangeToDelete(slider: HTMLElement): JQuery<HTMLElement> {
        return $(slider).find('.slider-line-span');
    },
    calculateCoefficientPoint(elementSliderLine: HTMLElement, max: number, min: number): number {
        return (elementSliderLine.offsetHeight / (max - min));
    },
    setInPlaceThumb(elements: HTMLElement[], modelState: IModelState, elementSliderLineSpan: HTMLElement, elementSliderLine: HTMLElement): void {
        new Array(elements.length)
            .fill(1)
            .forEach((_element: number, i: number) => {
                elements[i].style.top = (Math.ceil(configuratorVertical.calculateCoefficientPoint(elementSliderLine, modelState.max, modelState.min) * modelState.touchsValues[i])) + 'px';
            })

        elementSliderLineSpan.style.marginTop = configuratorVertical.getElementOffset(elements[0]) + 'px';
        elementSliderLineSpan.style.height = (configuratorVertical.getElementOffset(elements[elements.length - 1]) - configuratorVertical.getElementOffset(elements[0])) + 'px';
    },
    setInPlaceNewThumb(elements: HTMLElement[], currentTouchIndex: number | null, coefficientPoint: number, modelState: IModelState, shiftToMinValue: number, elementSliderLineSpan: HTMLElement): void {
        new Array(elements.length)
            .fill(1)
            .forEach((_element: number, i: number) => {
                if (i != currentTouchIndex) {
                    elements[i].style.left = "";
                    elements[i].style.top = (Math.ceil(coefficientPoint * modelState.touchsValues[i]) - shiftToMinValue) + 'px';
                }
            })
        elementSliderLineSpan.style.marginLeft = "";
        elementSliderLineSpan.style.width = "";

        elementSliderLineSpan.style.marginTop = configuratorVertical.getElementOffset(elements[0]) + 'px';
        elementSliderLineSpan.style.height = (configuratorVertical.getElementOffset(elements[elements.length - 1]) - configuratorVertical.getElementOffset(elements[0])) + 'px';
    },
    getCurrentValueAxisToOnStart(target: HTMLElement): number {
        return target.offsetTop;
    },
    getStartValueAxisToOnStart(eventTouch: MouseEvent, currentXorY: number): number {
        return eventTouch.pageY - currentXorY;
    },
    getMaxValueAxisToOnStart(elementSliderLine: HTMLElement): number {
        return elementSliderLine.offsetHeight;
    },
    getCurrentValueAxisToOnMove(eventTouch: MouseEvent, startXorY: number): number {
        return eventTouch.pageY - startXorY;
    },
    setIndentForTarget(target: HTMLElement, currentXorY: number): void {
        target.style.top = currentXorY + 'px';
    },
    getTargetWidth(target: HTMLElement): number {
        return target.offsetHeight;
    },
    setIndentForTargetToOnStop(target: HTMLElement, coefficientPoint: number, currentValue: number, shiftToMinValue: number): void {
        target.style.top = Math.ceil(coefficientPoint * currentValue) - shiftToMinValue  + 'px';
    },
    updateActiveRange(elementSliderLineSpan: HTMLElement, elements: HTMLElement[]): void {
        elementSliderLineSpan.style.marginTop = configuratorVertical.getElementOffset(elements[0]) + 'px';
        elementSliderLineSpan.style.height = (configuratorVertical.getElementOffset(elements[elements.length -1]) - configuratorVertical.getElementOffset(elements[0])) + 'px';
    },
    calculateClickLocation(event: MouseEvent, target: HTMLElement): number {
        return event.offsetY + target.offsetTop;
    },
    getOffsetFromClick(event: MouseEvent): number {
        return event.offsetY
    }
};