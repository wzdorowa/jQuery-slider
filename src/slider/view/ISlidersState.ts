export interface ISlidersState {
    sliders: HTMLElement[]
    coefficientPoint: number
    shiftToMinValue: number
    currentSliderIndex: number | null
    currentValue: number | null
    currentXorY: number
    startXorY: number
    maxXorY: number
}