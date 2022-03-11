import EventEmitter from '../../EventEmitter';
import View from '../../view/View';
import { IModelState } from '../../interfaces/iModelState';

const state: IModelState = {
  min: 0,
  max: 100,
  thumbsValues: [20, 30, 40, 50],
  orientation: 'horizontal',
  thumbsCount: 4,
  step: 2,
  isTooltip: true,
  isScaleOfValues: true,
};

describe('test View', () => {
  const slider = window.document.createElement('div');
  slider.className = 'js-slider-test';
  window.document.body.appendChild(slider);

  const eventEmitter = new EventEmitter();
  new View(slider, eventEmitter);

  test('checking subscriptions', () => {
    eventEmitter.emit('model:state-changed', state);

    state.thumbsValues = [22, 32, 42, 52];
    eventEmitter.emit('model:thumbsValues-changed', state);

    state.orientation = 'vertical';
    eventEmitter.emit('model:state-changed', state);
  });
});
