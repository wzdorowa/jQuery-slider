const utilities = {
  calculateValueForClickOnScale(
    currentValueAxis: number,
    pointSize: number,
    stepSlider: number,
  ): number {
    let currentValue: number = currentValueAxis / pointSize;
    const minValue: number = Math.floor(currentValue / stepSlider) * stepSlider;
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
