import utilities from '../../view/utilities/utilities';

test('Calculate value', () => {
  const value1 = utilities.calculateValue(280, 2, 0);
  expect(value1).toBe(140);

  const value2 = utilities.calculateValue(300, 2, 100);
  expect(value2).toBe(200);
});

test('calculate value for click on scale', () => {
  const value1 = utilities.calculateValueForClickOnScale(286, 2, 4);
  expect(value1).toBe(144);

  const value2 = utilities.calculateValueForClickOnScale(280, 2, 4);
  expect(value2).toBe(140);
});
