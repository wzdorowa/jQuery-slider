import EventEmitter from '../../EventEmitter';
import View from '../../view/View';
import { IModelState } from '../../interfaces/iModelState';

const state: IModelState = {
  min: 0,
  max: 100,
  thumbsValues: [20, 30, 40, 50],
  orientation: 'horizontal',
  step: 2,
  hasTooltips: true,
  hasScaleValues: true,
};

describe('test View', () => {
  const slider = window.document.createElement('div');
  slider.className = 'js-slider-test';
  window.document.body.appendChild(slider);

  const eventEmitter = new EventEmitter();
  const view = new View(slider, eventEmitter);

  test('checking subscriptions', () => {
    view.initialize(state);

    state.orientation = 'vertical';
    view.render(state);

    state.thumbsValues = [22, 32, 42, 52];
    view.update(state.thumbsValues);
  });
});
