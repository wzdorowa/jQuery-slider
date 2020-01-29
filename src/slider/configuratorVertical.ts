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
export const configuratorVertical: IConfigurator = {
    setWidthHeightSliderContainer(slider: HTMLElement): void {
        slider.classList.remove('width-horizontal-slider-container');
        slider.classList.add('height-vertical-slider-container');
    },
    createSliderTooltipText(createElement: (teg: string, className: string) => HTMLElement): HTMLElement {
        return createElement('span', 'slider-tooltip-text-for-verticalView');
    },
    createSliderLine(createElement: (teg: string, className: string) => HTMLElement): HTMLElement {
        return createElement('div', 'slider-line-for-verticalView');
    },
    createSliderLineSpan(createElement: (teg: string, className: string) => HTMLElement): HTMLElement {
        return createElement('span', 'slider-line-span-for-verticalView');
    },
    searchElementsTooltipText(slider: HTMLElement): HTMLElement[] {
        return Array.from($(slider).find('.slider-tooltip-text'));
    },
    sliderLineToDelete(slider: HTMLElement) { //дописать возвращаемый тип метода
        return $(slider).find('.slider-line');
    },
    calculateCoefficientPoint(elementSliderLine: HTMLElement, max: number, min: number): number {
        return (elementSliderLine.offsetHeight / (max - min));
    },
    calculateValueSliderTouch(elements: HTMLElement[], getCoefficientPoint: () => number, modelState: StateObject, elementSliderLineSpan: HTMLElement): void {
        for(let i = 0; i < elements.length; i++) {
            elements[i].style.left = "";
            elements[i].style.top = (Math.ceil(getCoefficientPoint() * modelState.touchsValues[i])) + 'px';
        }
        elementSliderLineSpan.style.marginLeft = "";
        elementSliderLineSpan.style.width = "";

        elementSliderLineSpan.style.marginTop = elements[0].offsetTop + 'px';
        elementSliderLineSpan.style.height = (elements[elements.length - 1].offsetTop - elements[0].offsetTop) + 'px';
    },
    calculateNewValueSliderTouch(elements: HTMLElement[], currentTouchIndex: number, coefficientPoint: number, modelState: StateObject, shiftToMinValue: number, elementSliderLineSpan: HTMLElement): void {
        for(let i = 0; i < elements.length && i != currentTouchIndex; i++) {
            elements[i].style.left = "";
            elements[i].style.top = (Math.ceil(coefficientPoint * modelState.touchsValues[i]) - shiftToMinValue) + 'px';
        }
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