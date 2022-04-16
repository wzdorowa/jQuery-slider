import ProgressBar from '../../view/ProgressBar';
import EventEmitter from '../../EventEmitter';
import { IModelState } from '../../interfaces/iModelState';
import { IAdapter } from '../../interfaces/IAdapter';

const state: IModelState = {
  min: 0,
  max: 100,
  thumbsValues: [20, 30, 40, 50],
  orientation: 'horizontal',
  step: 2,
  hasTooltips: true,
  hasScaleValues: true,
};

describe('Unit tests', () => {
  const element = window.document.createElement('div');
  element.className = 'js-slider-test';
  window.document.body.appendChild(element);

  const eventEmitter = new EventEmitter();
  const progressBar = new ProgressBar(element, eventEmitter);

  let adapter: IAdapter;

  const setAdapter = (orientation: string): void => {
    if (orientation === 'horizontal') {
      adapter = {
        offsetDirection: 'offsetLeft',
        offsetAxis: 'offsetX',
        offsetLength: 'offsetWidth',
        pageAxis: 'pageX',
        currentAxis: 'currentX',
        clientAxis: 'clientX',
        clientRect: 'x',
        direction: 'left',
        position: 'left',
        length: 'width',
      };
    } else if (orientation === 'vertical') {
      adapter = {
        offsetDirection: 'offsetTop',
        offsetAxis: 'offsetY',
        offsetLength: 'offsetHeight',
        pageAxis: 'pageY',
        currentAxis: 'currentY',
        clientAxis: 'clientY',
        clientRect: 'y',
        direction: 'top',
        position: 'top',
        length: 'height',
      };
    }
  };

  test('render ProgressBar', () => {
    setAdapter(state.orientation);

    state.min = 20;
    state.max = 80;
    progressBar.renderProgressBar(state, adapter);

    state.hasScaleValues = false;
    progressBar.renderProgressBar(state, adapter);

    state.hasScaleValues = true;
    progressBar.renderProgressBar(state, adapter);
  });

  test('test vertical orientation', () => {
    state.orientation = 'vertical';
    setAdapter(state.orientation);
    progressBar.renderProgressBar(state, adapter);
  });

  test('test click on progress bar', () => {
    const progressBar: HTMLElement | null = element.querySelector(
      '.js-slider__progress-bar',
    );

    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      clientX: 450,
      clientY: 100,
      movementX: 500,
    });

    if (progressBar !== null) {
      progressBar.dispatchEvent(event);
    }
  });
});
