import Scale from '../../view/Scale';
import EventEmitter from '../../EventEmitter';
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

describe('Unit tests', () => {
  const element = window.document.createElement('div');
  element.className = 'js-slider-test';
  window.document.body.appendChild(element);

  const eventEmitter = new EventEmitter();
  const scale = new Scale(element, eventEmitter);

  test('test vertical orientation', () => {
    state.orientation = 'vertical';
    scale.initializeScale(state);
  });
  test('initialize scale and configuration change', () => {
    state.min = 20;
    scale.initializeScale(state);

    state.min = 15;
    scale.setConfig(state);

    state.max = 80;
    scale.setConfig(state);

    state.isScaleOfValues = false;
    scale.initializeScale(state);

    state.isScaleOfValues = true;
    scale.setConfig(state);
  });
});
