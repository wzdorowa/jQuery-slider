import { IModelState } from '../interfaces/iModelState';

const defaultState: IModelState = {
  min: 0,
  max: 100,
  thumbsValues: [20, 32, 44, 60],
  orientation: 'horizontal',
  thumbsCount: 4,
  step: 2,
  tooltipIsActive: true,
  scaleValuesIsActive: true,
};

export default defaultState;
