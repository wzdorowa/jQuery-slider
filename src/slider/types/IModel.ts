type orientation = 'horizontal' | 'vertical';
export type IModel = {
  min?: number;
  max?: number;
  thumbsValues?: number[];
  orientation?: orientation;
  step?: number;
  hasTooltips?: boolean;
  hasScaleValues?: boolean;
};
