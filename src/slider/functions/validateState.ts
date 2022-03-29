import { IModelState } from '../interfaces/iModelState';

const validateState = (
  newState: unknown,
  currentState: IModelState,
): IModelState => {
  const state: IModelState = currentState;
  state.thumbsValues = Array.from(currentState.thumbsValues);

  if (typeof newState === 'object' && newState !== null) {
    const newModelState = newState as IModelState;

    if ('min' in newModelState) {
      state.min = newModelState.min;
    }

    if ('max' in newModelState) {
      state.max = newModelState.max;
    }

    if ('thumbsValues' in newModelState) {
      state.thumbsValues = Array.from(newModelState.thumbsValues);
    }

    if ('orientation' in newModelState) {
      state.orientation = newModelState.orientation;
    }

    if ('step' in newModelState) {
      state.step = newModelState.step;
    }

    if ('hasTooltips' in newModelState) {
      state.hasTooltips = newModelState.hasTooltips;
    }

    if ('hasScaleValues' in newModelState) {
      state.hasScaleValues = newModelState.hasScaleValues;
    }
  }
  return state;
};

export default validateState;
