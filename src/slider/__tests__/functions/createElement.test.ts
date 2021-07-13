import createElement from '../../functions/createElement';

test('Create element', () => {
  const element: HTMLElement = createElement('span', 'text');
  expect(element.tagName).toBe('SPAN');
  expect(element.className).toBe('text');
});
