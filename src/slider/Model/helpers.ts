import { IModelState } from '../interfaces/iModelState';
import defaultState from './defaultState';

const normalizeThumbValue = (
  thumbsValue: number,
  min: number,
  max: number,
  step: number,
): number => {
  const lastStep = Math.round(((max - min) % step) * 10) / 10;

  const previousLastStep = max - lastStep;

  let value: number = Math.round(thumbsValue * 100) / 100;

  if (lastStep > 0 && value > previousLastStep + lastStep / 2) {
    value = Math.round((value - min) / step) * step + min + lastStep;
  } else {
    value = Math.round((value - min) / step) * step + min;
  }

  value = Math.round(value * 100) / 100;

  if (value < min) {
    value = min;
  } else if (value >= max) {
    value = max;
  }

  return value;
};

const checkThumbsValuesIntersection = (
  thumbIndex: number | null,
  thumbsValues: number[],
  min: number,
  max: number,
  step: number,
): number[] => {
  let index = thumbIndex;
  if (index === null) {
    index = 0;
  }
  const values = thumbsValues;
  for (let i = index; i < values.length; i += 1) {
    values[i] = normalizeThumbValue(values[i], min, max, step);
    if (values[i] > values[i + 1]) {
      values[i + 1] = values[i];
    }
  }

  for (let i = index; i > 0; i -= 1) {
    values[i] = normalizeThumbValue(values[i], min, max, step);
    if (values[i] < values[i - 1]) {
      values[i - 1] = values[i];
    }
  }

  return values;
};

const validateState = (state: IModelState) => {
  const newState: IModelState = {};

  Object.keys(defaultState).forEach(key => {
    if (!(key in state)) {
      newState[key] = defaultState[key];
      if (key === 'thumbsValues') {
        if (defaultState.thumbsValues !== undefined) {
          newState.thumbsValues = Array.from(defaultState.thumbsValues);
        }
      }
    } else {
      newState[key] = state[key];
    }
  });

  return newState;
};

const normalizeState = (state: IModelState): IModelState => {
  const newState: IModelState = validateState(state);

  if (newState.step !== undefined) {
    if (newState.step <= 0) {
      newState.step = 1;
    }
  }

  if (newState.thumbsValues !== undefined && newState.min !== undefined) {
    if (newState.thumbsValues.length === 0) {
      newState.thumbsValues[0] = newState.min;
    }
  }

  if (newState.orientation !== undefined) {
    if (!['horizontal', 'vertical'].includes(newState.orientation)) {
      newState.orientation = defaultState.orientation;
    }
  }

  if (newState.min !== undefined && newState.max !== undefined) {
    if (!Number.isInteger(newState.min)) {
      newState.min = Math.floor(newState.min);
    }

    if (!Number.isInteger(newState.max)) {
      newState.max = Math.floor(newState.max);
    }

    if (newState.step !== undefined && newState.thumbsValues !== undefined) {
      const minPossibleMaxValue =
        newState.min + newState.step * newState.thumbsValues.length;

      if (newState.max < minPossibleMaxValue) {
        newState.max = minPossibleMaxValue;
      }
    }

    if (newState.thumbsValues !== undefined && newState.step !== undefined) {
      newState.thumbsValues = checkThumbsValuesIntersection(
        null,
        newState.thumbsValues,
        newState.min,
        newState.max,
        newState.step,
      );
    }
  }

  return newState;
};

export { normalizeThumbValue, checkThumbsValuesIntersection, normalizeState };
