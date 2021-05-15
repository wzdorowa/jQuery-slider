import sinonLib = require('sinon');
import driverHorizontal from '../../slider/view/drivers/driverHorizontal';
import driverVertical from '../../slider/view/drivers/driverVertical';
import View from '../../slider/view/View';
import Thumbs from '../../slider/view/Thumbs';
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
  const slider = window.document.createElement('div');
  slider.className = 'js-slider-test';
  window.document.body.appendChild(slider);

  const eventEmitter = new EventEmitter();
  const emitter = eventEmitter;

  new View(slider, eventEmitter);
  const thumbs = new Thumbs(slider, eventEmitter);

  test('Checking the correct creation of elements', () => {
    emitter.emit('model:state-changed', state);

    const thumbsElements = window.document.querySelectorAll(
      '.js-slider__thumb',
    );

    expect(thumbsElements.length).toBe(state.thumbsCount);
  });
  test('Check if the created elements have parents', () => {
    const parentThumbsElements = window.document.querySelectorAll(
      '.js-slider__thumb',
    )[0].parentNode as HTMLElement;

    expect(parentThumbsElements.className).toContain('js-slider-test');
  });
  test('Check the change in the number of created elements when changing the number of thumbs up', () => {
    state.thumbsCount = 5;
    emitter.emit('model:state-changed', state);

    const thumbsElements = window.document.querySelectorAll(
      '.js-slider__thumb',
    );

    expect(thumbsElements.length).toBe(state.thumbsCount);
  });
  test('Check removal of thumbs', () => {
    state.thumbsCount = 3;
    emitter.emit('model:state-changed', state);

    const thumbsElements = window.document.querySelectorAll(
      '.js-slider__thumb',
    );

    expect(thumbsElements.length).toBe(state.thumbsCount);
  });
  test('Checking the installation of the nearest thumb to the clicked position on the slider scale', () => {
    const sinon: sinonLib.SinonStatic = sinonLib;

    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      clientX: 150,
      clientY: 67,
    });

    sinon
      .stub(driverHorizontal, 'calculateCoefficientPoint')
      .callsFake(() => 2);
    sinon.stub(driverHorizontal, 'getOffsetFromClick').callsFake(() => 100);
    sinon.stub(driverHorizontal, 'calculateClickLocation').callsFake(() => 130);

    const scale = Array.from($(slider).find('.js-slider__scale'));
    const range = Array.from($(slider).find('.js-slider__active-range'));

    scale[0].dispatchEvent(event);
    range[0].dispatchEvent(event);

    sinon.reset();
  });
  test('onStart call test', () => {
    const sinon: sinonLib.SinonStatic = sinonLib;

    const thumbs = Array.from($(slider).find('.js-slider__thumb'));
    const event = new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
      clientX: 450,
      clientY: 65,
    });

    sinon
      .stub(driverHorizontal, 'getCurrentValueAxisToProcessStart')
      .callsFake(() => 90);
    sinon
      .stub(driverHorizontal, 'getStartValueAxisToProcessStart')
      .callsFake(() => 50);
    sinon
      .stub(driverHorizontal, 'getMaxValueAxisToProcessStart')
      .callsFake(() => 300);

    thumbs[0].dispatchEvent(event);

    sinon.reset();
  });
  test('Checking onMove', () => {
    const sinon: sinonLib.SinonStatic = sinonLib;

    const thumbs: HTMLElement[] = Array.from(
      $(slider).find('.js-slider__thumb'),
    );

    const event = new MouseEvent('mousemove', {
      bubbles: true,
      cancelable: true,
      clientX: 450,
      clientY: 100,
      movementX: 500,
    });

    const getCurrentValueAxisToOnMove = sinon.stub(
      driverHorizontal,
      'getCurrentValueAxisToProcessMove',
    );
    getCurrentValueAxisToOnMove.onCall(0).returns(290);
    getCurrentValueAxisToOnMove.onCall(1).returns(290);
    getCurrentValueAxisToOnMove.onCall(2).returns(10);
    const elementOffset = sinon
      .stub(driverHorizontal, 'getElementOffset')
      .callsFake(() => 290);
    const setIndentForTarget = sinon
      .stub(driverHorizontal, 'setIndentForTarget')
      .callsFake(() => 0);
    const updateLineSpan = sinon
      .stub(driverHorizontal, 'updateActiveRange')
      .callsFake(() => 0);

    thumbs[0].dispatchEvent(event);
    thumbs[1].dispatchEvent(event);
    thumbs[2].dispatchEvent(event);

    // reset stubs
    getCurrentValueAxisToOnMove.restore();
    elementOffset.restore();
    setIndentForTarget.restore();
    updateLineSpan.restore();
  });
  test('checking onMove for first thumb, case 1', () => {
    const sinon: sinonLib.SinonStatic = sinonLib;

    state.thumbsCount = 1;
    emitter.emit('model:state-changed', state);

    const thumbsElements: HTMLElement[] = Array.from(
      $(slider).find('.js-slider__thumb'),
    );

    const event = new MouseEvent('mousemove', {
      bubbles: true,
      cancelable: true,
      clientX: 450,
      clientY: 65,
    });

    const getCurrentValueAxisToOnMove = sinon.stub(
      driverHorizontal,
      'getCurrentValueAxisToProcessMove',
    );
    getCurrentValueAxisToOnMove.onCall(0).returns(700);
    const elementOffset = sinon
      .stub(driverHorizontal, 'getElementOffset')
      .callsFake(() => 1000);
    const setIndentForTarget = sinon
      .stub(driverHorizontal, 'setIndentForTarget')
      .callsFake(() => 0);
    const updateLineSpan = sinon
      .stub(driverHorizontal, 'updateActiveRange')
      .callsFake(() => 0);

    thumbsElements[0].dispatchEvent(event);

    // reset stubs
    getCurrentValueAxisToOnMove.restore();
    elementOffset.restore();
    setIndentForTarget.restore();
    updateLineSpan.restore();
  });
  test('checking onMove for first thumb, case 2', () => {
    const sinon: sinonLib.SinonStatic = sinonLib;

    state.thumbsCount = 1;
    emitter.emit('model:state-changed', state);

    const thumbsElements: HTMLElement[] = Array.from(
      $(slider).find('.js-slider__thumb'),
    );

    const event = new MouseEvent('mousemove', {
      bubbles: true,
      cancelable: true,
      clientX: 450,
      clientY: 65,
    });

    const getCurrentValueAxisToOnMove = sinon.stub(
      driverHorizontal,
      'getCurrentValueAxisToProcessMove',
    );
    getCurrentValueAxisToOnMove.onCall(0).returns(-100);
    const elementOffset = sinon
      .stub(driverHorizontal, 'getElementOffset')
      .callsFake(() => -100);
    const setIndentForTarget = sinon
      .stub(driverHorizontal, 'setIndentForTarget')
      .callsFake(() => 0);
    const updateLineSpan = sinon
      .stub(driverHorizontal, 'updateActiveRange')
      .callsFake(() => 0);

    thumbsElements[0].dispatchEvent(event);

    // reset stubs
    getCurrentValueAxisToOnMove.restore();
    elementOffset.restore();
    setIndentForTarget.restore();
    updateLineSpan.restore();
  });
  test('checking onMove for first thumb, case 3', () => {
    const sinon: sinonLib.SinonStatic = sinonLib;

    state.thumbsCount = 1;
    state.step = 1;
    emitter.emit('model:state-changed', state);

    const thumbsElements: HTMLElement[] = Array.from(
      $(slider).find('.js-slider__thumb'),
    );

    const event = new MouseEvent('mousemove', {
      bubbles: true,
      cancelable: true,
      clientX: 50,
      clientY: 65,
    });

    const getCurrentValueAxisToOnMove = sinon.stub(
      driverHorizontal,
      'getCurrentValueAxisToProcessMove',
    );
    getCurrentValueAxisToOnMove.onCall(0).returns(200);
    const elementOffset = sinon
      .stub(driverHorizontal, 'getElementOffset')
      .callsFake(() => 200);
    const setIndentForTarget = sinon
      .stub(driverHorizontal, 'setIndentForTarget')
      .callsFake(() => 0);
    const updateLineSpan = sinon
      .stub(driverHorizontal, 'updateActiveRange')
      .callsFake(() => 0);

    thumbsElements[0].dispatchEvent(event);

    // reset stubs
    getCurrentValueAxisToOnMove.restore();
    elementOffset.restore();
    setIndentForTarget.restore();
    updateLineSpan.restore();
  });
  test('checking onMove for first thumb, case 4', () => {
    const sinon: sinonLib.SinonStatic = sinonLib;

    state.thumbsCount = 4;
    state.step = 1;
    emitter.emit('model:state-changed', state);

    const thumbsElements: HTMLElement[] = Array.from(
      $(slider).find('.js-slider__thumb'),
    );

    const event = new MouseEvent('mousemove', {
      bubbles: true,
      cancelable: true,
      clientX: 50,
      clientY: 65,
    });

    const getCurrentValueAxisToOnMove = sinon.stub(
      driverHorizontal,
      'getCurrentValueAxisToProcessMove',
    );
    getCurrentValueAxisToOnMove.onCall(0).returns(200);
    const elementOffset = sinon
      .stub(driverHorizontal, 'getElementOffset')
      .callsFake(() => 200);
    const setIndentForTarget = sinon
      .stub(driverHorizontal, 'setIndentForTarget')
      .callsFake(() => 0);
    const updateLineSpan = sinon
      .stub(driverHorizontal, 'updateActiveRange')
      .callsFake(() => 0);

    thumbsElements[0].dispatchEvent(event);

    // reset stubs
    getCurrentValueAxisToOnMove.restore();
    elementOffset.restore();
    setIndentForTarget.restore();
    updateLineSpan.restore();
  });
  test('checking onMove for first thumb, case 5', () => {
    const sinon: sinonLib.SinonStatic = sinonLib;

    state.step = 2;
    emitter.emit('model:state-changed', state);

    const thumbsElements: HTMLElement[] = Array.from(
      $(slider).find('.js-slider__thumb'),
    );

    const event = new MouseEvent('mousemove', {
      bubbles: true,
      cancelable: true,
      clientX: 40,
      clientY: 65,
    });

    const getCurrentValueAxisToOnMove = sinon.stub(
      driverHorizontal,
      'getCurrentValueAxisToProcessMove',
    );
    getCurrentValueAxisToOnMove.onCall(0).returns(-100);
    const elementOffset = sinon
      .stub(driverHorizontal, 'getElementOffset')
      .callsFake(() => -100);
    const setIndentForTarget = sinon
      .stub(driverHorizontal, 'setIndentForTarget')
      .callsFake(() => 0);
    const updateLineSpan = sinon
      .stub(driverHorizontal, 'updateActiveRange')
      .callsFake(() => 0);

    thumbsElements[0].dispatchEvent(event);

    // reset stubs
    getCurrentValueAxisToOnMove.restore();
    elementOffset.restore();
    setIndentForTarget.restore();
    updateLineSpan.restore();
  });
  test('checking onMove for last thumb, case 1', () => {
    const sinon: sinonLib.SinonStatic = sinonLib;

    state.step = 1;
    emitter.emit('model:state-changed', state);

    const thumbsElements: HTMLElement[] = Array.from(
      $(slider).find('.js-slider__thumb'),
    );

    const event = new MouseEvent('mousemove', {
      bubbles: true,
      cancelable: true,
      clientX: 600,
      clientY: 65,
      movementX: 1000,
    });

    const getCurrentValueAxisToOnMove = sinon
      .stub(driverHorizontal, 'getCurrentValueAxisToProcessMove')
      .callsFake(() => 650);
    const elementOffset = sinon
      .stub(driverHorizontal, 'getOffsetPreviousThumb')
      .callsFake(() => 550);
    const setIndentForTarget = sinon
      .stub(driverHorizontal, 'setIndentForTarget')
      .callsFake(() => 0);
    const updateLineSpan = sinon
      .stub(driverHorizontal, 'updateActiveRange')
      .callsFake(() => 0);

    thumbsElements[3].dispatchEvent(event);

    // reset stubs
    getCurrentValueAxisToOnMove.restore();
    elementOffset.restore();
    setIndentForTarget.restore();
    updateLineSpan.restore();
  });
  test('Checking onStop', () => {
    const sinon: sinonLib.SinonStatic = sinonLib;

    const thumbs: HTMLElement[] = Array.from(
      $(slider).find('.js-slider__thumb'),
    );

    const event = new MouseEvent('mouseup', {
      bubbles: true,
      cancelable: true,
      clientX: 100,
      clientY: 100,
    });

    sinon
      .stub(driverHorizontal, 'setIndentForTargetToProcessStop')
      .callsFake(() => 0);

    thumbs[0].dispatchEvent(event);
    sinon.reset();
  });
  test('checking the method initializeThumbs', () => {
    const sinon: sinonLib.SinonStatic = sinonLib;

    state.min = 10;
    thumbs.initializeThumbs(state);

    state.max = 80;
    thumbs.initializeThumbs(state);

    const updateLineSpan = sinon
      .stub(driverVertical, 'updateActiveRange')
      .callsFake(() => 0);

    state.orientation = 'vertical';
    thumbs.initializeThumbs(state);

    updateLineSpan.restore();
  });
  test('checking the method setConfig', () => {
    const sinon: sinonLib.SinonStatic = sinonLib;

    sinon.stub(driverVertical, 'calculateCoefficientPoint').callsFake(() => 2);
    sinon.stub(driverVertical, 'updateActiveRange').callsFake(() => 0);

    state.min = 0;
    thumbs.setConfig(state);

    state.max = 100;
    thumbs.setConfig(state);

    state.step = 5;
    thumbs.setConfig(state);

    sinon.reset();
  });
  test('checking resize window', () => {
    const sinon: sinonLib.SinonStatic = sinonLib;

    const event = new MouseEvent('resize', {
      bubbles: true,
      cancelable: true,
      clientX: 100,
      clientY: 100,
    });

    window.dispatchEvent(event);
    sinon.reset();
  });
});
