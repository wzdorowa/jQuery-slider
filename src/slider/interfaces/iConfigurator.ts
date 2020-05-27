import {IModelState} from './iModelState';

export interface IConfigurator {
    getElementOffset(element: HTMLElement): number
    createElementTooltipText(): HTMLElement
    createElementScale(): HTMLElement
    createElementActivRange(): HTMLElement
    searchElementsTooltipText(slider: HTMLElement): HTMLElement[]
    calculateCoefficientPoint(elementSliderLine: HTMLElement, max: number, min: number): number
    searchElementScaleToDelete(slider: HTMLElement): JQuery<HTMLElement>
    searchElementActivRangeToDelete(slider: HTMLElement): JQuery<HTMLElement>
    setInPlaceThumb(elements: HTMLElement[], modelState: IModelState, elementSliderLineSpan: HTMLElement, elementSliderLine: HTMLElement): void
    setInPlaceNewThumb(elements: HTMLElement[], currentThumbIndex: number | null, coefficientPoint: number, modelState: IModelState, shiftToMinValue: number, elementSliderLineSpan: HTMLElement): void
    getCurrentValueAxisToOnStart(target: HTMLElement): number
    getStartValueAxisToOnStart(eventThumb: MouseEvent, currentXorY: number): number
    getMaxValueAxisToOnStart(elementSliderLine: HTMLElement): number
    getCurrentValueAxisToOnMove(eventThumb: MouseEvent, startXorY: number): number
    setIndentForTarget(target: HTMLElement, currentXorY: number): void
    getTargetWidth(target: HTMLElement): number
    setIndentForTargetToOnStop(target: HTMLElement, coefficientPoint: number, currentValue: number, shiftToMinValue: number): void
    updateActiveRange(elementSliderLineSpan: HTMLElement, elements: HTMLElement[]): void
    calculateClickLocation(event: MouseEvent, target: HTMLElement): number
    getOffsetFromClick(event: MouseEvent): number
}