import {IModelState} from './iModelState';
import {IConfigurator} from './iConfigurator';
import {createElement} from './functions/createElement';
import {getCoefficientPoint} from './functions/getCoefficientPoint'

export const configuratorHorizontal: IConfigurator = {
    setWidthHeightSliderContainer(slider: HTMLElement): void {
        slider.classList.remove('height-vertical-slider-container');
        slider.classList.add('width-horizontal-slider-container');
    },
    createSliderTooltipText(): HTMLElement {
        return createElement('span', 'slider-tooltip-text');
    },
    createSliderLine(): HTMLElement {
        return createElement('div', 'slider-line');
    },
    createSliderLineSpan(): HTMLElement {
        return createElement('span', 'slider-line-span');
    },
    searchElementsTooltipText(slider: HTMLElement): HTMLElement[] {
        return Array.from($(slider).find('.slider-tooltip-text-for-verticalView'));
    },
    calculateCoefficientPoint(elementSliderLine: HTMLElement, max: number, min: number): number {
        return (elementSliderLine.offsetWidth / (max - min));
    },
    sliderLineToDelete(slider: HTMLElement): JQuery<HTMLElement> {
        return $(slider).find('.slider-line-for-verticalView');
    },
    calculateValueSliderTouch(elements: HTMLElement[], modelState: IModelState, elementSliderLineSpan: HTMLElement, elementSliderLine: HTMLElement): void {
        new Array(elements.length)
            .fill(1)
            .forEach((_element: number, i: number) => {
                elements[i].style.top = "";
                elements[i].style.left = (Math.ceil(getCoefficientPoint(configuratorHorizontal, elementSliderLine, modelState.max, modelState.min) * modelState.touchsValues[i])) + 'px';
            })
        elementSliderLineSpan.style.marginTop = "";
        elementSliderLineSpan.style.height = "";

        elementSliderLineSpan.style.marginLeft = elements[0].offsetLeft + 'px';
        elementSliderLineSpan.style.width = (elements[elements.length - 1].offsetLeft - elements[0].offsetLeft) + 'px';
    },
    calculateNewValueSliderTouch(elements: HTMLElement[], currentTouchIndex: number | null, coefficientPoint: number, modelState: IModelState, shiftToMinValue: number, elementSliderLineSpan: HTMLElement): void {
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

        elementSliderLineSpan.style.marginLeft = elements[0].offsetLeft + 'px';
        elementSliderLineSpan.style.width = (elements[elements.length - 1].offsetLeft - elements[0].offsetLeft) + 'px';
    },
    setCurrentXorYtoOnStart(target: HTMLElement): number {
        return target.offsetLeft;
    },
    setStartXorYtoOnStart(eventTouch: MouseEvent, currentXorY: number): number {
        return eventTouch.pageX - currentXorY;
    },
    setMaxXorYtoOnStart(elementSliderLine: HTMLElement): number {
        return elementSliderLine.offsetWidth;
    },
    setCurrentXorYtoOnMove(eventTouch: MouseEvent, startXorY: number): number {
            return eventTouch.pageX - startXorY;
    },
    setIndentForTarget(target: HTMLElement, currentXorY: number): void {
        target.style.left = currentXorY + 'px';
    },
    elementOffset(element: HTMLElement): number {
        return element.offsetLeft;
    },
    targetOffset(target: HTMLElement): number {
        return target.offsetWidth;
    },
    setIndentForTargetToOnStop(target: HTMLElement, coefficientPoint: number, currentValue: number, shiftToMinValue: number): void {
        target.style.left = Math.ceil(coefficientPoint * currentValue) - shiftToMinValue  + 'px';
    },
    updateLineSpan(elementSliderLineSpan: HTMLElement, elements: HTMLElement[]): void {
        elementSliderLineSpan.style.marginLeft = elements[0].offsetLeft + 'px';
        elementSliderLineSpan.style.width = (elements[elements.length -1].offsetLeft - elements[0].offsetLeft) + 'px';
    },
};