import {IModelState} from '../../interfaces/iModelState';
import {IConfigurator} from '../../interfaces/iConfigurator';
import {createElement} from '../../functions/createElement';

export const configuratorHorizontal: IConfigurator = {
    getElementOffset(element: HTMLElement): number {
        return element.offsetLeft;
    },
    createElementTooltipText(): HTMLElement {
        return createElement('span', 'slider-tooltip-text');
    },
    createElementScale(): HTMLElement {
        return createElement('div', 'slider-line');
    },
    createElementActivRange(): HTMLElement {
        return createElement('span', 'slider-line-span');
    },
    searchElementsTooltipText(slider: HTMLElement): HTMLElement[] {
        return Array.from($(slider).find('.slider-tooltip-text-for-verticalView'));
    },
    calculateCoefficientPoint(elementSliderLine: HTMLElement, max: number, min: number): number {
        return (elementSliderLine.offsetWidth / (max - min));
    },
    searchElementScaleToDelete(slider: HTMLElement): JQuery<HTMLElement> {
        return $(slider).find('.slider-line-for-verticalView');
    },
    searchElementActivRangeToDelete(slider: HTMLElement): JQuery<HTMLElement> {
        return $(slider).find('.slider-line-span-for-verticalView');
    },
    setInPlaceThumb(elements: HTMLElement[], modelState: IModelState, elementSliderLineSpan: HTMLElement, elementSliderLine: HTMLElement): void {
        new Array(elements.length)
            .fill(1)
            .forEach((_element: number, i: number) => {
                elements[i].style.left = (Math.ceil(configuratorHorizontal.calculateCoefficientPoint(elementSliderLine, modelState.max, modelState.min) * modelState.touchsValues[i])) + 'px';
            })

        elementSliderLineSpan.style.marginLeft = configuratorHorizontal.getElementOffset(elements[0]) + 'px';
        elementSliderLineSpan.style.width = (configuratorHorizontal.getElementOffset(elements[elements.length - 1]) - configuratorHorizontal.getElementOffset(elements[0])) + 'px';
    },
    setInPlaceNewThumb(elements: HTMLElement[], currentTouchIndex: number | null, coefficientPoint: number, modelState: IModelState, shiftToMinValue: number, elementSliderLineSpan: HTMLElement): void {
        new Array(elements.length)
            .fill(1)
            .forEach((_element: number, i: number) => {
                if (i != currentTouchIndex) {
                    elements[i].style.top = "";
                    elements[i].style.left = (Math.ceil(coefficientPoint * modelState.touchsValues[i]) - shiftToMinValue) + 'px';
                }
            })
        elementSliderLineSpan.style.marginTop = "";
        elementSliderLineSpan.style.height = "";

        elementSliderLineSpan.style.marginLeft = configuratorHorizontal.getElementOffset(elements[0]) + 'px';
        elementSliderLineSpan.style.width = (configuratorHorizontal.getElementOffset(elements[elements.length - 1]) - configuratorHorizontal.getElementOffset(elements[0])) + 'px';
    },
    getCurrentValueAxisToOnStart(target: HTMLElement): number {
        return target.offsetLeft;
    },
    getStartValueAxisToOnStart(eventTouch: MouseEvent, currentXorY: number): number {
        return eventTouch.pageX - currentXorY;
    },
    getMaxValueAxisToOnStart(elementSliderLine: HTMLElement): number {
        return elementSliderLine.offsetWidth;
    },
    getCurrentValueAxisToOnMove(eventTouch: MouseEvent, startXorY: number): number {
        return eventTouch.pageX - startXorY;
    },
    setIndentForTarget(target: HTMLElement, currentXorY: number): void {
        target.style.left = currentXorY + 'px';
    },
    getTargetWidth(target: HTMLElement): number {
        return target.offsetWidth;
    },
    setIndentForTargetToOnStop(target: HTMLElement, coefficientPoint: number, currentValue: number, shiftToMinValue: number): void {
        target.style.left = Math.ceil(coefficientPoint * currentValue) - shiftToMinValue  + 'px';
    },
    updateActiveRange(elementSliderLineSpan: HTMLElement, elements: HTMLElement[]): void {
        elementSliderLineSpan.style.marginLeft = configuratorHorizontal.getElementOffset(elements[0]) + 'px';
        elementSliderLineSpan.style.width = (configuratorHorizontal.getElementOffset(elements[elements.length -1]) - configuratorHorizontal.getElementOffset(elements[0])) + 'px';
    },
    calculateClickLocation(event: MouseEvent, target: HTMLElement): number {
        return event.offsetX + target.offsetLeft;
    },
    getOffsetFromClick(event: MouseEvent): number {
        return event.offsetX
    }
};