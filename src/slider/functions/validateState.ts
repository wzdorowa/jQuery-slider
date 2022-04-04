import { IModelState } from '../interfaces/iModelState';

type orientation = 'horizontal' | 'vertical';
export type state = {
  min?: number;
  max?: number;
  thumbsValues?: number[];
  orientation?: orientation;
  step?: number;
  hasTooltips?: boolean;
  hasScaleValues?: boolean;
};

const validateState = (
  newState: unknown,
  currentState: IModelState,
): IModelState => {
  const state: IModelState = currentState;
  state.thumbsValues = Array.from(currentState.thumbsValues);

  if (typeof newState === 'object' && newState !== null) {
    const newModelState: state = newState;

    if (newModelState.min !== undefined) {
      state.min = newModelState.min;
    }

    if (newModelState.max !== undefined) {
      state.max = newModelState.max;
    }

    if (newModelState.thumbsValues !== undefined) {
      state.thumbsValues = Array.from(newModelState.thumbsValues);
    }

    if (newModelState.orientation !== undefined) {
      state.orientation = newModelState.orientation;
    }

    if (newModelState.step !== undefined) {
      state.step = newModelState.step;
    }

    if (newModelState.hasTooltips !== undefined) {
      state.hasTooltips = newModelState.hasTooltips;
    }

    if (newModelState.hasScaleValues !== undefined) {
      state.hasScaleValues = newModelState.hasScaleValues;
    }
  }
  return state;
};

export default validateState;
