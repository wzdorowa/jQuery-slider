type orientation = 'horizontal' | 'vertical';
export interface IModelState {
  min: number;
  max: number;
  thumbsValues: number[];
  orientation: orientation;
  step: number;
  hasTooltips: boolean;
  hasScaleValues: boolean;
}
