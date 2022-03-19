import { IModelState } from '../interfaces/iModelState';

const defaultState: IModelState = {
  min: 0,
  max: 100,
  thumbsValues: [20, 32, 44, 60],
  orientation: 'horizontal',
  step: 2,
  hasTooltips: true,
  hasScaleValues: true,
};

export default defaultState;
