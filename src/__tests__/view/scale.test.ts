import Scale from '../../slider/view/Scale';
import Thumbs from '../../slider/view/Thumbs';
import driverHorizontal from '../../slider/view/drivers/driverHorizontal';
import driverVertical from '../../slider/view/drivers/driverVertical';
import EventEmitter from '../../slider/EventEmitter';
import { IModelState } from '../../slider/interfaces/iModelState';

const state: IModelState = {
  min: 0,
  max: 100,
  thumbsValues: [20, 30, 40, 50],
  orientation: 'horizontal',
  amount: 4,
  step: 2,
  isTooltip: true,
};

describe('Unit tests', () => {
  const element = window.document.createElement('div');
  element.className = 'js-slider-test';
  window.document.body.appendChild(element);

  const eventEmitter = new EventEmitter();
  const scale = new Scale(element);
  const sliders = new Thumbs(element, eventEmitter);

  test('Checking the correct creation of scale elements', () => {
    scale.createScale(driverHorizontal);

    const scaleElement = window.document.querySelector('.js-slider__scale');
    const activeRange = window.document.querySelector(
      '.js-slider__active-range',
    );

    expect(scaleElement?.className).toContain('js-slider__scale');
    expect(activeRange?.className).toContain('js-slider__active-range');
    expect(scale.slider.childElementCount).toBe(1);
    expect(scale.scale).toBe(scaleElement);
    expect(scale.activeRange).toBe(activeRange);
  });
  test('Checking orientation change', () => {
    state.orientation = 'vertical';
    scale.changeOrientation(
      sliders.setThumbToNewPosition.bind(sliders),
      state,
      driverVertical,
    );
    const scaleToDelete = window.document.querySelector('.js-slider__scale');
    const activeRangeToRemove = window.document.querySelector(
      '.js-slider__active-range',
    );

    expect(scaleToDelete).toBe(null);
    expect(activeRangeToRemove).toBe(null);

    const scaleElement = window.document.querySelector(
      '.js-slider__vertical-scale',
    );
    const activeRange = window.document.querySelector(
      '.js-slider__vertical-active-range',
    );

    expect(scaleElement?.className).toContain('js-slider__vertical-scale');
    expect(activeRange?.className).toContain(
      'js-slider__vertical-active-range',
    );
    expect(scale.slider.childElementCount).toBe(1);
    expect(scale.scale).toBe(scaleElement);
    expect(scale.activeRange).toBe(activeRange);
  });
});
