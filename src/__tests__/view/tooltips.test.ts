import EventEmitter from '../../slider/EventEmitter';
import { IModelState } from '../../slider/interfaces/iModelState';
import Tooltips from '../../slider/view/Tooltips';
import View from '../../slider/view/View';

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
  const slider = window.document.createElement('div');
  slider.className = 'js-slider-test';
  window.document.body.appendChild(slider);

  const eventEmitter = new EventEmitter();
  new View(slider, eventEmitter);
  const tooltips = new Tooltips(slider);

  test('Checking the correctness of tooltips creation', () => {
    eventEmitter.emit('model:state-changed', state);

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
  test('Checking the setting of default sliders values ​​in their corresponding tooltips', () => {
    const textInTooltipsElements = window.document.querySelectorAll(
      '.js-slider__tooltip-text',
    );
    state.thumbsValues.forEach((element: number, i: number) => {
      expect(String(element)).toBe(textInTooltipsElements[i].innerHTML);
    });
  });
  test('Checking the change in the number of rendered tooltips when changing the number of sliders', () => {
    state.thumbsCount = 6;
    eventEmitter.emit('model:state-changed', state);

    let tooltipsElements = window.document.querySelectorAll(
      '.js-slider__tooltip',
    );
    let textInTooltipsElements = window.document.querySelectorAll(
      '.js-slider__tooltip-text',
    );
    let slidersElements = window.document.querySelectorAll('.js-slider__thumb');

    expect(tooltipsElements.length).toBe(state.thumbsCount);
    expect(textInTooltipsElements.length).toBe(state.thumbsCount);
    tooltipsElements.forEach((element, i: number) => {
      expect(element.childNodes).toContain(textInTooltipsElements[i]);
    });
    slidersElements.forEach((element, i: number) => {
      expect(String(element.childNodes[0])).toContain(
        String(tooltipsElements[i]),
      );
    });

    state.thumbsCount = 4;
    eventEmitter.emit('model:state-changed', state);

    tooltipsElements = window.document.querySelectorAll('.js-slider__tooltip');
    textInTooltipsElements = window.document.querySelectorAll(
      '.js-slider__tooltip-text',
    );
    slidersElements = window.document.querySelectorAll('.js-slider__thumb');

    expect(tooltipsElements.length).toBe(state.thumbsCount);
    expect(textInTooltipsElements.length).toBe(state.thumbsCount);
    tooltipsElements.forEach((element, i: number) => {
      expect(element.childNodes).toContain(textInTooltipsElements[i]);
    });
    slidersElements.forEach((element, i: number) => {
      expect(element.childNodes).toContain(tooltipsElements[i]);
    });
  });
  test('Checking redrawing of tooltips when changing orientation', () => {
    state.orientation = 'vertical';
    eventEmitter.emit('model:state-changed', state);

    let tooltipsElements = window.document.querySelectorAll(
      '.js-slider__tooltip',
    );
    let textInTooltipsElements = window.document.querySelectorAll(
      '.js-slider__vertical-tooltip-text',
    );

    textInTooltipsElements.forEach(element => {
      expect(element.className).toContain('js-slider__vertical-tooltip-text');
    });
    tooltipsElements.forEach((element, i: number) => {
      expect(element.childNodes).toContain(textInTooltipsElements[i]);
    });

    state.orientation = 'horizontal';
    eventEmitter.emit('model:state-changed', state);

    tooltipsElements = window.document.querySelectorAll('.js-slider__tooltip');
    textInTooltipsElements = window.document.querySelectorAll(
      '.js-slider__tooltip-text',
    );

    textInTooltipsElements.forEach(element => {
      expect(element.className).toContain('js-slider__tooltip-text');
    });
    tooltipsElements.forEach((element, i: number) => {
      expect(element.childNodes).toContain(textInTooltipsElements[i]);
    });
  });
  test('Check for the presence of values ​​in tooltips', () => {
    const tooltipsText = window.document.querySelectorAll(
      '.js-slider__tooltip-text',
    );

    expect(tooltipsText[0].innerHTML).toContain('20');
    expect(tooltipsText[1].innerHTML).toContain('30');
  });
  test('Checking if thumbs tooltips are hidden', () => {
    state.isTooltip = false;
    eventEmitter.emit('model:state-changed', state);

    const tooltipsElements = window.document.querySelectorAll(
      '.js-slider__tooltip',
    );
    tooltipsElements.forEach(element => {
      expect(element.className).toContain('slider__tooltip-hide');
    });
  });
  test('Checking the display of thumbs tooltips', () => {
    state.isTooltip = true;
    eventEmitter.emit('model:state-changed', state);

    const tooltipsElements = window.document.querySelectorAll(
      '.js-slider__tooltip',
    );
    tooltipsElements.forEach(element => {
      expect(element.className).not.toContain('slider__tooltip-hide');
    });
  });
  test('check setting vertical orientation', () => {
    state.orientation = 'vertical';
    tooltips.initializeTooltips(state);
  });
  test('check visible tooltips', () => {
    state.isTooltip = false;
    tooltips.initializeTooltips(state);
  });
  test('check setting values in tooltips', () => {
    state.thumbsCount = 5;
    state.thumbsValues = [20, 30, 40, 50, 60];
    tooltips.setConfig(state);
  });
});
