export interface IThumbsState {
  thumbs: HTMLElement[];
  coefficientPoint: number;
  shiftToMinValue: number;
  valueAxisFromStartMove: number;
  startValueAxis: number;
  maxValueAxis: number;
  thumbValueAxis: number | null;
  target: HTMLElement | null;
  lastStep: number;
}
