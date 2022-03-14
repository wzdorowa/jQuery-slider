import ProgressBar from '../../view/ProgressBar';
import EventEmitter from '../../EventEmitter';
import { IModelState } from '../../interfaces/iModelState';
import { IAdapter } from '../../interfaces/IAdapter';

const state: IModelState = {
  min: 0,
  max: 100,
  thumbsValues: [20, 30, 40, 50],
  orientation: 'horizontal',
  thumbsCount: 4,
  step: 2,
  tooltipIsActive: true,
  isScaleOfValues: true,
};

describe('Unit tests', () => {
  const element = window.document.createElement('div');
  element.className = 'js-slider-test';
  window.document.body.appendChild(element);

  const eventEmitter = new EventEmitter();
  const scale = new ProgressBar(element, eventEmitter);

  let adapter: IAdapter;

  const setAdapter = (orientation: string): void => {
    if (orientation === 'horizontal') {
      adapter = {
        offsetDirection: 'offsetLeft',
        offsetAxis: 'offsetX',
        offsetLength: 'offsetWidth',
        pageAxis: 'pageX',
        currentAxis: 'currentX',
        direction: 'left',
        margin: 'marginLeft',
        length: 'width',
      };
    } else if (orientation === 'vertical') {
      adapter = {
        offsetDirection: 'offsetTop',
        offsetAxis: 'offsetY',
        offsetLength: 'offsetHeight',
        pageAxis: 'pageY',
        currentAxis: 'currentY',
        direction: 'top',
        margin: 'marginTop',
        length: 'height',
      };
    }
  };

  test('render ProgressBar', () => {
    setAdapter(state.orientation);
    state.min = 20;
    state.max = 80;
    scale.renderProgressBar(state, adapter);

    state.isScaleOfValues = false;
    scale.renderProgressBar(state, adapter);

    state.isScaleOfValues = true;
    scale.renderProgressBar(state, adapter);
  });

  test('find and set the nearest thumb', () => {
    scale.findAndSetTheNearestThumb(26);
  });

  test('test vertical orientation', () => {
    state.orientation = 'vertical';
    setAdapter(state.orientation);
    scale.renderProgressBar(state, adapter);
  });
});
