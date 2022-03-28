type orientation = 'horizontal' | 'vertical';
export interface IModelState {
  [key: string]: number | number[] | boolean | orientation | undefined;
  min?: number;
  max?: number;
  thumbsValues?: number[];
  orientation?: orientation;
  step?: number;
  hasTooltips?: boolean;
  hasScaleValues?: boolean;
}
