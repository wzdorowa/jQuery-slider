import Scale from '../../slider/view/Scale';
import EventEmitter from '../../slider/EventEmitter';
import { IModelState } from '../../slider/interfaces/iModelState';

const state: IModelState = {
  min: 0,
  max: 100,
  thumbsValues: [20, 30, 40, 50],
  orientation: 'horizontal',
  thumbsCount: 4,
  step: 2,
  isTooltip: true,
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
});
