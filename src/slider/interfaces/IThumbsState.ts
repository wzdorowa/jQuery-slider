export interface IThumbsState {
  thumbs: HTMLElement[];
  coefficientPoint: number;
  shiftToMinValue: number;
  currentThumbIndex: number | null;
  currentValue: number | null;
  currentValueAxis: number;
  startValueAxis: number;
  stopValueAxis: number;
  valueAxisFromStartMove: number;
  minValueSlider: number;
  maxValueSlider: number;
  stepSlider: number;
  thumbsCount: number;
  thumbsValues: number[];
  orientation: string | null;
  thumbValueAxis: number | null;
  target: HTMLElement | null;
}
