import View from '../../view/View';
import Thumb from '../../view/Thumb';
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

describe('Unit tests', () => {
  const slider = (window.document.createElement(
    'div',
  ) as unknown) as HTMLElement;
  slider.className = 'js-slider-test';
  window.document.body.appendChild(slider);

  const eventEmitter = new EventEmitter();

  new View(slider, eventEmitter);
  const thumb = new Thumb(slider, eventEmitter, 0);

  test('renderThumbs', () => {
    setAdapter(state.orientation);
    thumb.renderThumb(state, adapter);

    const slidersElements = window.document.querySelectorAll(
      '.js-slider__thumb',
    );
    slidersElements.forEach(element => {
      expect(slider.childNodes).toContain(element);
    });
  });

  test('Checking onStart', () => {
    const thumbs: HTMLElement[] = Array.from(
      $(slider).find('.js-slider__thumb'),
    );

    const event = new MouseEvent('pointerdown', {
      bubbles: true,
      cancelable: true,
      clientX: 450,
      clientY: 100,
      movementX: 500,
    });

    thumbs[0].dispatchEvent(event);
    thumbs[1].dispatchEvent(event);
    thumbs[2].dispatchEvent(event);
  });

  test('Checking onMove', () => {
    const thumbs: HTMLElement[] = Array.from(
      $(slider).find('.js-slider__thumb'),
    );

    const event = new MouseEvent('pointermove', {
      bubbles: true,
      cancelable: true,
      clientX: 450,
      clientY: 100,
      movementX: 500,
    });

    thumbs[0].dispatchEvent(event);
    thumbs[1].dispatchEvent(event);
    thumbs[2].dispatchEvent(event);
  });

  test('Checking onStop', () => {
    const thumbs: HTMLElement[] = Array.from(
      $(slider).find('.js-slider__thumb'),
    );

    const event = new MouseEvent('pointerup', {
      bubbles: true,
      cancelable: true,
      clientX: 450,
      clientY: 100,
      movementX: 500,
    });

    thumbs[0].dispatchEvent(event);
    thumbs[1].dispatchEvent(event);
    thumbs[2].dispatchEvent(event);
  });
});
