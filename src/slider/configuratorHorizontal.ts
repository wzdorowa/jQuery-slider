interface StateObject {
    min: number
    max: number,
    touchsValues: number[],
    orientation: string,
    amount: number,
    step: number,
    tooltip: boolean,
}
interface IConfigurator {
    setWidthHeightSliderContainer: Function
    createSliderTooltipText: Function
    createSliderLine: Function
    createSliderLineSpan: Function
    searchElementsTooltipText: Function
    calculateCoefficientPoint: Function
    sliderLineToDelete: Function
    calculateValueSliderTouch: Function
    calculateNewValueSliderTouch: Function
    setCurrentXorYtoOnStart: Function
    setStartXorYtoOnStart: Function
    setMaxXorYtoOnStart: Function
    setCurrentXorYtoOnMove: Function
    setIndentForTarget: Function
    elementOffset: Function
    targetOffset: Function
    setIndentForTargetToOnStop: Function
    updateLineSpan: Function
}
export const configuratorHorizontal: IConfigurator = {
    setWidthHeightSliderContainer(slider: HTMLElement): void {
        slider.classList.remove('height-vertical-slider-container');
        slider.classList.add('width-horizontal-slider-container');
    },
    createSliderTooltipText(createElement: Function): HTMLElement {
        return createElement('span', 'slider-tooltip-text');
    },
    createSliderLine(createElement: Function): HTMLElement {
        return createElement('div', 'slider-line');
    },
    createSliderLineSpan(createElement: Function): HTMLElement {
        return createElement('span', 'slider-line-span');
    },
    searchElementsTooltipText(slider: HTMLElement): HTMLElement[] {
        return Array.from($(slider).find('.slider-tooltip-text-for-verticalView'));
    },
    calculateCoefficientPoint(elementSliderLine: HTMLElement, max: number, min: number): number {
        return (elementSliderLine.offsetWidth / (max - min));
    },
    sliderLineToDelete(slider: HTMLElement) { // дописать возвращаемый тип метода
        return $(slider).find('.slider-line-for-verticalView');
    },
    calculateValueSliderTouch(elements: HTMLElement[], getCoefficientPoint: Function, modelState: StateObject, elementSliderLineSpan: HTMLElement): void {
        for(let i = 0; i < elements.length; i++) {
            elements[i].style.top = "";
            elements[i].style.left = (Math.ceil(getCoefficientPoint(modelState) * modelState.touchsValues[i])) + 'px';
        }
        elementSliderLineSpan.style.marginTop = "";
        elementSliderLineSpan.style.height = "";

        elementSliderLineSpan.style.marginLeft = elements[0].offsetLeft + 'px';
        elementSliderLineSpan.style.width = (elements[elements.length - 1].offsetLeft - elements[0].offsetLeft) + 'px';
    },
    calculateNewValueSliderTouch(elements: HTMLElement[], currentTouchIndex: number, coefficientPoint: number, modelState: StateObject, shiftToMinValue: number, elementSliderLineSpan: HTMLElement): void {
        for(let i = 0; i < elements.length && i != currentTouchIndex; i++) {
            elements[i].style.top = "";
            elements[i].style.left = (Math.ceil(coefficientPoint * modelState.touchsValues[i]) - shiftToMinValue) + 'px';
        }
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