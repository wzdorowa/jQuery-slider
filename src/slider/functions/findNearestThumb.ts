import { IThumbData } from '../interfaces/IThumbData';

const findNearestThumb = (
  currentValue: number,
  thumbsValues: number[],
): IThumbData | null => {
  const leftSpacing: number[] = [];
  const rightSpacing: number[] = [];

  thumbsValues.forEach((thumbValue: number) => {
    const valueLeftSpacing = thumbValue - currentValue;
    leftSpacing.push(Math.abs(valueLeftSpacing));

    const valueRightSpacing = thumbValue + currentValue;
    rightSpacing.push(Math.abs(valueRightSpacing));
  });

  let currentSpacingValue: number | null = null;
  let currentThumbIndex: number | null = null;

  const checkValueSpacing = (element: number, index: number) => {
    if (currentSpacingValue === null) {
      currentSpacingValue = element;
    }
    if (currentThumbIndex === null) {
      currentThumbIndex = index;
    }
    if (element < currentSpacingValue) {
      currentSpacingValue = element;
      currentThumbIndex = index;
    }
  };
  leftSpacing.forEach((element, index) => {
    checkValueSpacing(element, index);
  });
  rightSpacing.forEach((element, index) => {
    checkValueSpacing(element, index);
  });

  if (currentThumbIndex !== null) {
    return { value: currentValue, index: currentThumbIndex };
  }
  return null;
};

export default findNearestThumb;
