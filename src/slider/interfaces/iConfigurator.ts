import { IModelState } from './iModelState';

export interface IConfigurator {
    getElementOffset(element: HTMLElement): number
    createElementTooltipText(): HTMLElement
    createElementScale(): HTMLElement
    createElementActivRange(): HTMLElement
    searchElementsTooltipText(slider: HTMLElement): HTMLElement[]
    calculateCoefficientPoint(scale: HTMLElement, max: number, min: number): number
    searchElementScaleToDelete(slider: HTMLElement): JQuery<HTMLElement>
    searchElementActivRangeToDelete(slider: HTMLElement): JQuery<HTMLElement>
    setInPlaceThumb(elements: HTMLElement[], modelState: IModelState,
        activRange: HTMLElement, scale: HTMLElement): void
    setInPlaceNewThumb(elements: HTMLElement[], currentThumbIndex: number | null,
        coefficientPoint: number, modelState: IModelState, shiftToMinValue: number,
        activRange: HTMLElement): void
    getCurrentValueAxisToProcessStart(target: HTMLElement): number
    getStartValueAxisToProcessStart(eventThumb: MouseEvent, currentXorY: number): number
    getMaxValueAxisToProcessStart(scale: HTMLElement): number
    getCurrentValueAxisToProcessMove(eventThumb: MouseEvent, startXorY: number): number
    setIndentForTarget(target: HTMLElement, currentXorY: number): void
    getTargetWidth(target: HTMLElement): number
    setIndentForTargetToProcessStop(target: HTMLElement, coefficientPoint: number,
        currentValue: number, shiftToMinValue: number): void
    updateActiveRange(activRange: HTMLElement, elements: HTMLElement[]): void
    calculateClickLocation(event: MouseEvent, target: HTMLElement): number
    getOffsetFromClick(event: MouseEvent): number
}
