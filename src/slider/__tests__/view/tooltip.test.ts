import EventEmitter from '../../EventEmitter';
import createElement from '../../functions/createElement';
import { IModelState } from '../../interfaces/iModelState';
import Tooltip from '../../view/Tooltip';
import View from '../../view/View';

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
  const slider = window.document.createElement('div');
  slider.className = 'js-slider-test';
  window.document.body.appendChild(slider);

  const eventEmitter = new EventEmitter();
  new View(slider, eventEmitter);
  const tooltip = new Tooltip();

  test('render tooltips', () => {
    const thumb: HTMLElement = createElement(
      'div',
      'slider__thumb js-slider__thumb',
    );
    tooltip.createTooltip(thumb, state.orientation);

    const tooltipsElements = window.document.querySelectorAll(
      '.js-slider__tooltip',
    );
    const textInTooltipsElements = window.document.querySelectorAll(
      '.js-slider__tooltip-text',
    );
    const slidersElements = window.document.querySelectorAll(
      '.js-slider__thumb',
    );

    tooltipsElements.forEach(element => {
      expect(element.className).toContain('js-slider__tooltip');
    });
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
