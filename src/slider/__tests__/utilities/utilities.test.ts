import utilities from '../../view/utilities/utilities';

test('calculate value for click on scale', () => {
  const value1 = utilities.calculateValueForClickOnScale(286, 2, 4);
  expect(value1).toBe(144);

  const value2 = utilities.calculateValueForClickOnScale(280, 2, 4);
  expect(value2).toBe(140);
});
