import { IModelState } from "./iModelState";

export interface IThumbsState {
  thumbs: HTMLElement[];
  coefficientPoint: number;
  shiftToMinValue: number;
  currentThumbIndex: number | null;
  currentValue: number | null;
  currentValueAxis: number;
  startValueAxis: number;
  maxValueAxis: number;
  minValueSlider: number;
  maxValueSlider: number;
  stepSlider: number;
  thumbValueAxis: number | null;
  modelState: IModelState | null;
  target: HTMLElement | null;
  activeRange: HTMLElement | null;
  scale: HTMLElement | null;
  setCurrentTooltipValue: null | ((modelState: IModelState, i: number) => void);
}
