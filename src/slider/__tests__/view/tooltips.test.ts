import EventEmitter from '../../EventEmitter';
import { IAdapter } from '../../interfaces/IAdapter';
import { IModelState } from '../../interfaces/iModelState';
import Thumbs from '../../view/Thumbs';
import Tooltips from '../../view/Tooltips';
import View from '../../view/View';

const state: IModelState = {
  min: 0,
  max: 100,
  thumbsValues: [20, 30, 40, 50],
  orientation: 'horizontal',
  thumbsCount: 4,
  step: 2,
  tooltipIsActive: true,
  scaleValuesIsActive: true,
};

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
      direction: 'top',
      position: 'top',
      length: 'height',
    };
  }
};

describe('Unit tests', () => {
  const slider = window.document.createElement('div');
  slider.className = 'js-slider-test';
  window.document.body.appendChild(slider);

  const eventEmitter = new EventEmitter();
  new View(slider, eventEmitter);
  const tooltips = new Tooltips(slider);
  const thumbs = new Thumbs(slider, eventEmitter);
  setAdapter(state.orientation);

  test('render tooltips', () => {
    thumbs.renderThumbs(state, adapter);
    tooltips.renderTooltips(state);

    const tooltipsElements = window.document.querySelectorAll(
      '.js-slider__tooltip',
    );
    const textInTooltipsElements = window.document.querySelectorAll(
      '.js-slider__tooltip-text',
    );
    const slidersElements = window.document.querySelectorAll(
      '.js-slider__thumb',
    );

    expect(tooltipsElements.length).toBe(state.thumbsCount);
    tooltipsElements.forEach(element => {
      expect(element.className).toContain('js-slider__tooltip');
    });
    expect(textInTooltipsElements.length).toBe(state.thumbsCount);
    textInTooltipsElements.forEach(element => {
      expect(element.className).toContain('js-slider__tooltip-text');
    });
    tooltipsElements.forEach((element, i: number) => {
      expect(element.childNodes).toContain(textInTooltipsElements[i]);
    });
    slidersElements.forEach((element, i: number) => {
      expect(element.childNodes).toContain(tooltipsElements[i]);
    });
  });
});
