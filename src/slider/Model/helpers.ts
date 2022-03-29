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

const normalizeState = (state: IModelState): IModelState => {
  const newState: IModelState = state;

  if (newState.step <= 0) {
    newState.step = 1;
  }

  if (newState.thumbsValues.length === 0) {
    newState.thumbsValues[0] = newState.min;
  }

  if (!['horizontal', 'vertical'].includes(newState.orientation)) {
    newState.orientation = defaultState.orientation;
  }

  if (!Number.isInteger(newState.min)) {
    newState.min = Math.floor(newState.min);
  }

  if (!Number.isInteger(newState.max)) {
    newState.max = Math.floor(newState.max);
  }

  const minPossibleMaxValue =
    newState.min + newState.step * newState.thumbsValues.length;

  if (newState.max < minPossibleMaxValue) {
    newState.max = minPossibleMaxValue;
  }

  newState.thumbsValues = checkThumbsValuesIntersection(
    null,
    newState.thumbsValues,
    newState.min,
    newState.max,
    newState.step,
  );

  return newState;
};

export { normalizeThumbValue, checkThumbsValuesIntersection, normalizeState };
