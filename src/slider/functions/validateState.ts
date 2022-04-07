import { IModelState } from '../interfaces/iModelState';

const validateState = (
  newState: unknown,
  currentState: IModelState,
): IModelState => {
  const state: IModelState = currentState;
  state.thumbsValues = Array.from(currentState.thumbsValues);

  if (typeof newState === 'object' && newState !== null) {
    const newModelState = newState as Record<string, unknown>;

    if (
      newModelState.min !== undefined &&
      typeof newModelState.min === 'number'
    ) {
      state.min = newModelState.min;
    }

    if (
      newModelState.max !== undefined &&
      typeof newModelState.max === 'number'
    ) {
      state.max = newModelState.max;
    }

    if (
      newModelState.thumbsValues !== undefined &&
      Array.isArray(newModelState.thumbsValues)
    ) {
      state.thumbsValues = Array.from(newModelState.thumbsValues);
    }

    if (
      newModelState.orientation !== undefined &&
      typeof newModelState.orientation === 'string'
    ) {
      if (
        newModelState.orientation === 'horizontal' ||
        newModelState.orientation === 'vertical'
      )
        state.orientation = newModelState.orientation;
    }

    if (
      newModelState.step !== undefined &&
      typeof newModelState.step === 'number'
    ) {
      state.step = newModelState.step;
    }

    if (
      newModelState.hasTooltips !== undefined &&
      typeof newModelState.hasTooltips === 'boolean'
    ) {
      state.hasTooltips = newModelState.hasTooltips;
    }

    if (
      newModelState.hasScaleValues !== undefined &&
      typeof newModelState.hasScaleValues === 'boolean'
    ) {
      state.hasScaleValues = newModelState.hasScaleValues;
    }
  }
  return state;
};

export default validateState;
