const utilities = {
  calculateShiftToMinValue(coefficientPoint: number, min: number): number {
    const shiftToMinValue = Math.ceil(coefficientPoint * min);
    return shiftToMinValue;
  },

  /* the method calculates the current value of the thumb */
  calculateValue(
    currentValueAxis: number,
    coefficientPoint: number,
    shiftToMinValue: number,
  ): number {
    const currentValue: number = Math.floor(
      (currentValueAxis + shiftToMinValue) / coefficientPoint,
    );
    return currentValue;
  },

  calculateValueForClickOnScale(
    currentValueAxis: number,
    coefficientPoint: number,
    stepSlider: number,
  ): number {
    let currentValue: number = Math.ceil(currentValueAxis / coefficientPoint);

    const minValue: number = Math.floor(currentValue / stepSlider) * stepSlider;

    const halfStep = minValue + stepSlider / 2;

    if (currentValue > halfStep) {
      currentValue = minValue + stepSlider;
    } else {
      currentValue = minValue;
    }

    return currentValue;
  },

  calculateValueAxis(
    value: number,
    stepSlider: number,
    coefficientPoint: number,
    shiftToMinValue: number,
  ): number {
    const intermediateValue: number = value / stepSlider;
    const currentValue: number = intermediateValue * stepSlider;

    const currentValueAxis: number =
      Math.ceil(currentValue * coefficientPoint) - shiftToMinValue;

    return currentValueAxis;
  },
};

export default utilities;
