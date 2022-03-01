const utilities = {
  /* the method calculates the current value of the thumb */
  calculateValue(
    currentValueAxis: number,
    coefficientPoint: number,
    shiftToMinValue: number,
  ): number {
    const currentValue: number =
      (currentValueAxis + shiftToMinValue) / coefficientPoint;

    return currentValue;
  },

  calculateValueForClickOnScale(
    currentValueAxis: number,
    coefficientPoint: number,
    stepSlider: number,
  ): number {
    let currentValue: number = currentValueAxis / coefficientPoint;
    const minValue: number = (currentValue / stepSlider) * stepSlider;
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
    coefficientPoint: number,
    shiftToMinValue: number,
  ): number {
    const currentValueAxis: number = value * coefficientPoint - shiftToMinValue;
    return currentValueAxis;
  },
};

export default utilities;
