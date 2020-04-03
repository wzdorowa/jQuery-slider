import {IModelState} from './iModelState';
import {IConfigurator} from './iConfigurator';
import {createElement} from './functions/createElement';
import {getCoefficientPoint} from './functions/getCoefficientPoint'

export const configuratorVertical: IConfigurator = {
    setWidthHeightSliderContainer(slider: HTMLElement): void {
        slider.classList.remove('width-horizontal-slider-container');
        slider.classList.add('height-vertical-slider-container');
    },
    createSliderTooltipText(): HTMLElement {
        return createElement('span', 'slider-tooltip-text-for-verticalView');
    },
    createSliderLine(): HTMLElement {
        return createElement('div', 'slider-line-for-verticalView');
    },
    createSliderLineSpan(): HTMLElement {
        return createElement('span', 'slider-line-span-for-verticalView');
    },
    searchElementsTooltipText(slider: HTMLElement): HTMLElement[] {
        return Array.from($(slider).find('.slider-tooltip-text'));
    },
    sliderLineToDelete(slider: HTMLElement): JQuery<HTMLElement> {
        return $(slider).find('.slider-line');
    },
    calculateCoefficientPoint(elementSliderLine: HTMLElement, max: number, min: number): number {
        return (elementSliderLine.offsetHeight / (max - min));
    },
    calculateValueSliderTouch(elements: HTMLElement[], modelState: IModelState, elementSliderLineSpan: HTMLElement, elementSliderLine: HTMLElement): void {
        new Array(elements.length)
            .fill(1)
            .forEach((_element: number, i: number) => {
                elements[i].style.left = "";
                elements[i].style.top = (Math.ceil(getCoefficientPoint(configuratorVertical, elementSliderLine, modelState.max, modelState.min) * modelState.touchsValues[i])) + 'px';
            })
        elementSliderLineSpan.style.marginLeft = "";
        elementSliderLineSpan.style.width = "";

        elementSliderLineSpan.style.marginTop = elements[0].offsetTop + 'px';
        elementSliderLineSpan.style.height = (elements[elements.length - 1].offsetTop - elements[0].offsetTop) + 'px';
    },
    calculateNewValueSliderTouch(elements: HTMLElement[], currentTouchIndex: number | null, coefficientPoint: number, modelState: IModelState, shiftToMinValue: number, elementSliderLineSpan: HTMLElement): void {
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

        elementSliderLineSpan.style.marginTop = elements[0].offsetTop + 'px';
        elementSliderLineSpan.style.height = (elements[elements.length - 1].offsetTop - elements[0].offsetTop) + 'px';
    },
    setCurrentXorYtoOnStart(target: HTMLElement): number {
        return target.offsetTop;
    },
    setStartXorYtoOnStart(eventTouch: MouseEvent, currentXorY: number): number {
        return eventTouch.pageY - currentXorY;
    },
    setMaxXorYtoOnStart(elementSliderLine: HTMLElement): number {
        return elementSliderLine.offsetHeight;
    },
    setCurrentXorYtoOnMove(eventTouch: MouseEvent, startXorY: number): number {
        return eventTouch.pageY - startXorY;
    },
    setIndentForTarget(target: HTMLElement, currentXorY: number): void {
        target.style.top = currentXorY + 'px';
    },
    elementOffset(element: HTMLElement): number {
        return element.offsetTop;
    },
    targetOffset(target: HTMLElement): number {
        return target.offsetHeight;
    },
    setIndentForTargetToOnStop(target: HTMLElement, coefficientPoint: number, currentValue: number, shiftToMinValue: number): void {
        target.style.top = Math.ceil(coefficientPoint * currentValue) - shiftToMinValue  + 'px';
    },
    updateLineSpan(elementSliderLineSpan: HTMLElement, elements: HTMLElement[]): void {
        elementSliderLineSpan.style.marginTop = elements[0].offsetTop + 'px';
        elementSliderLineSpan.style.height = (elements[elements.length -1].offsetTop - elements[0].offsetTop) + 'px';
    },
};