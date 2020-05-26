export interface IThumbsState {
    thumbs: HTMLElement[]
    coefficientPoint: number
    shiftToMinValue: number
    currentThumbIndex: number | null
    currentValue: number | null
    currentValueAxis: number
    startValueAxis: number
    maxValueAxis: number
}