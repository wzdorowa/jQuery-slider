import {IModelState} from './iModelState';

export interface IConfigurator {
    setWidthHeightSliderContainer(slider: HTMLElement): void
    createSliderTooltipText(): HTMLElement
    createSliderLine(): HTMLElement
    createSliderLineSpan(): HTMLElement
    searchElementsTooltipText(slider: HTMLElement): HTMLElement[]
    calculateCoefficientPoint(elementSliderLine: HTMLElement, max: number, min: number): number
    sliderLineToDelete(slider: HTMLElement): JQuery<HTMLElement>
    calculateValueSliderTouch(elements: HTMLElement[], getCoefficientPoint: () => number, modelState: IModelState, elementSliderLineSpan: HTMLElement): void
    calculateNewValueSliderTouch(elements: HTMLElement[], currentTouchIndex: number | null, coefficientPoint: number, modelState: IModelState, shiftToMinValue: number, elementSliderLineSpan: HTMLElement): void
    setCurrentXorYtoOnStart(target: HTMLElement): number
    setStartXorYtoOnStart(eventTouch: MouseEvent, currentXorY: number): number
    setMaxXorYtoOnStart(elementSliderLine: HTMLElement): number
    setCurrentXorYtoOnMove(eventTouch: MouseEvent, startXorY: number): number
    setIndentForTarget(target: HTMLElement, currentXorY: number): void
    elementOffset(element: HTMLElement): number
    targetOffset(target: HTMLElement): number
    setIndentForTargetToOnStop(target: HTMLElement, coefficientPoint: number, currentValue: number, shiftToMinValue: number): void
    updateLineSpan(elementSliderLineSpan: HTMLElement, elements: HTMLElement[]): void
}