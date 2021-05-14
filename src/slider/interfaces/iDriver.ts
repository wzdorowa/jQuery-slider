import { IModelState } from './iModelState';

export interface IDriver {
  getElementOffset(element: HTMLElement): number;
  createElementTooltipText(): HTMLElement;
  createElementScale(): HTMLElement;
  createElementActiveRange(): HTMLElement;
  searchElementsTooltipText(slider: HTMLElement): HTMLElement[];
  calculateCoefficientPoint(
    scale: HTMLElement,
    max: number,
    min: number,
  ): number;
  searchElementScaleToDelete(slider: HTMLElement): JQuery<HTMLElement>;
  searchElementActiveRangeToDelete(slider: HTMLElement): JQuery<HTMLElement>;
  setInPlaceThumb({
    elements,
    currentThumbIndex,
    coefficientPoint,
    thumbsValues,
    shiftToMinValue,
    slider,
  }: {
    elements: HTMLElement[];
    currentThumbIndex: number | null;
    coefficientPoint: number;
    thumbsValues: number[];
    shiftToMinValue: number;
    slider: HTMLElement;
  }): void;
  getCurrentValueAxisToProcessStart(target: HTMLElement): number;
  getStartValueAxisToProcessStart(
    eventThumb: MouseEvent,
    currentXorY: number,
  ): number;
  getMaxValueAxisToProcessStart(scale: HTMLElement): number;
  getCurrentValueAxisToProcessMove(
    eventThumb: MouseEvent,
    startXorY: number,
  ): number;
  setIndentForTarget(
    target: HTMLElement,
    currentXorY: number,
    slider: HTMLElement,
  ): void;
  setIndentForTargetToProcessStop({
    target,
    coefficientPoint,
    currentValue,
    shiftToMinValue,
    slider,
  }: {
    target: HTMLElement;
    coefficientPoint: number;
    currentValue: number;
    shiftToMinValue: number;
    slider: HTMLElement;
  }): void;
  updateActiveRange(slider: HTMLElement): void;
  calculateClickLocation(
    event: MouseEvent,
    target: HTMLElement,
    shiftToMinValue: number,
  ): number;
  getOffsetFromClick(event: MouseEvent): number;
}
