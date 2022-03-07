const utilities = {
  /* the method calculates the current value of the thumb */
  calculateValue(
    currentValueAxis: number,
    pointSize: number,
    shiftToMinValue: number,
  ): number {
    const currentValue: number =
      (currentValueAxis + shiftToMinValue) / pointSize;

    return currentValue;
  },

  calculateValueForClickOnScale(
    currentValueAxis: number,
    pointSize: number,
    stepSlider: number,
  ): number {
    let currentValue: number = currentValueAxis / pointSize;
    const minValue: number = (currentValue / stepSlider) * stepSlider;
    const halfStep = minValue + stepSlider / 2;

    if (currentValue > halfStep) {
      currentValue = minValue + stepSlider;
    } else {
      currentValue = minValue;
    }

    return currentValue;
  },
};

export default utilities;
