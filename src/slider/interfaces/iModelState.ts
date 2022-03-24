export interface IModelState {
  min: number;
  max: number;
  thumbsValues: number[];
  orientation: 'horizontal' | 'vertical';
  step: number;
  hasTooltips: boolean;
  hasScaleValues: boolean;
}
