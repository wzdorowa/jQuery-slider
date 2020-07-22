import sinonLib = require('sinon');
import driverHorizontal from '../../slider/view/drivers/driverHorizontal';
import View from '../../slider/view/view';
import Thumbs from '../../slider/view/thumbs';
import EventEmitter from '../../slider/eventEmitter';
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
  const emitter = eventEmitter;

  const view = new View(element, eventEmitter);
  const thumbs = new Thumbs(element, eventEmitter);

  test('Checking the correct creation of elements', () => {
    emitter.emit('model:state-changed', state);

    const thumbsElements = window.document.querySelectorAll('.js-slider__thumb');

    expect(thumbsElements.length).toBe(state.amount);
  });
  test('Check if the created elements have parents', () => {
    const parentThumbsElements = window.document.querySelectorAll('.js-slider__thumb')[0].parentNode as HTMLElement;

    expect(parentThumbsElements.className).toContain('js-slider-test');
  });
  test('Check the change in the number of created elements when changing the number of thumbs up', () => {
    state.amount = 5;
    emitter.emit('model:state-changed', state);

    const thumbsElements = window.document.querySelectorAll('.js-slider__thumb');

    expect(thumbsElements.length).toBe(state.amount);

    // Check value of added thumb
    expect(state.thumbsValues.length).toBe(5);
    expect(state.thumbsValues[4]).toBe(52);
  });
  test('Check removal of thumbs', () => {
    state.amount = 3;
    emitter.emit('model:state-changed', state);

    const thumbsElements = window.document.querySelectorAll('.js-slider__thumb');

    expect(thumbsElements.length).toBe(state.amount);
    expect(state.thumbsValues.length).toBe(3);
  });
  test('Check the correctness of the calculation of the current value of the thumb', () => {
    thumbs.state.coefficientPoint = 3.5;
    const currentValue: number = thumbs.calculateValue(state, 345);
    expect(currentValue).toBe(98);
  });
  test('Checking the calculation of the value of the thumb position on the scale', () => {
    thumbs.state.coefficientPoint = 3.2;
    thumbs.state.currentValueAxis = 273;
    thumbs.state.shiftToMinValue = 0;
    thumbs.calculateValueOfPlaceOnScale(state, 3);
    expect(thumbs.state.currentValue).toBe(86);
  });
  test('Checking the installation of the nearest thumb to the clicked position on the slider scale', () => {
    const sinon: sinonLib.SinonStatic = sinonLib;

    const driver = driverHorizontal;
    const activeRange: HTMLElement = driver.createElementActiveRange();
    const scale: HTMLElement = driver.createElementScale();

    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      clientX: 100,
      clientY: 100,
    });

    sinon.stub(driverHorizontal, 'calculateCoefficientPoint').callsFake(() => 2);
    sinon.stub(driverHorizontal, 'getOffsetFromClick').callsFake(() => 100);
    sinon.stub(driverHorizontal, 'calculateClickLocation').callsFake(() => 130);

    scale.dispatchEvent(event);
    let currentValues = thumbs.setThumbToNewPosition.apply(thumbs, [event, state, driver]);
    expect(currentValues[0]).toBe(30);
    expect(currentValues[1]).toBe(1);

    activeRange.dispatchEvent(event);
    currentValues = thumbs.setThumbToNewPosition.apply(thumbs, [event, state, driver]);
    expect(currentValues[0]).toBe(40);
    expect(currentValues[1]).toBe(2);

    sinon.reset();
  });
  test('onStart call test', () => {
    const sinon: sinonLib.SinonStatic = sinonLib;

    thumbs.driver = driverHorizontal;
    const activeRange: HTMLElement = thumbs.driver.createElementActiveRange();
    const scale: HTMLElement = thumbs.driver.createElementScale();
    const i = 0;
    const setCurrentTooltipValue = () => 0;
    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      clientX: 100,
      clientY: 100,
    });

    sinon.stub(driverHorizontal, 'getCurrentValueAxisToProcessStart').callsFake(() => 90);
    sinon.stub(driverHorizontal, 'getStartValueAxisToProcessStart').callsFake(() => 50);
    sinon.stub(driverHorizontal, 'getMaxValueAxisToProcessStart').callsFake(() => 300);

    thumbs.processStart(state, event, i, scale, activeRange, setCurrentTooltipValue);
    expect(thumbs.state.currentValue).toBe(state.thumbsValues[i]);

    sinon.reset();
  });
  test('Checking onMove for the first thumb', () => {
    const sinon: sinonLib.SinonStatic = sinonLib;

    thumbs.driver = driverHorizontal;
    const activeRange: HTMLElement = thumbs.driver.createElementActiveRange();
    const elements: HTMLElement[] = thumbs.state.thumbs;

    const setCurrentTooltipValue = () => 0;
    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      clientX: 100,
      clientY: 100,
    });

    const getCurrentValueAxisToOnMove = sinon.stub(driverHorizontal, 'getCurrentValueAxisToProcessMove');
    getCurrentValueAxisToOnMove.onCall(0).returns(290);
    getCurrentValueAxisToOnMove.onCall(1).returns(290);
    getCurrentValueAxisToOnMove.onCall(2).returns(10);
    const elementOffset = sinon.stub(driverHorizontal, 'getElementOffset').callsFake(() => 290);
    const targetOffset = sinon.stub(driverHorizontal, 'getTargetWidth').callsFake(() => 24);
    const setIndentForTarget = sinon.stub(driverHorizontal, 'setIndentForTarget').callsFake(() => 0);
    const updateLineSpan = sinon.stub(driverHorizontal, 'updateActiveRange').callsFake(() => 0);

    const i = 0;
    const target: HTMLElement = elements[i];

    // If the thumb on the scale is one
    thumbs.state.maxValueAxis = 280;
    thumbs.state.thumbs.length = 1;

    thumbs.processMove(state, event, i, target, activeRange, setCurrentTooltipValue);
    expect(thumbs.state.currentValueAxis).toBe(thumbs.state.maxValueAxis);
    thumbs.state.maxValueAxis = 350;

    // Checking the first thumb if there are many thumbs on the scale
    thumbs.state.thumbs.length = 4;

    thumbs.processMove(state, event, i, target, activeRange, setCurrentTooltipValue);
    expect(thumbs.state.currentValueAxis).toBe(266);

    // If the value of the first thumb becomes less than the minimum possible value
    state.min = 20;

    thumbs.processMove(state, event, i, target, activeRange, setCurrentTooltipValue);
    expect(thumbs.state.currentValueAxis).toBe(state.min);

    // reset stubs
    getCurrentValueAxisToOnMove.restore();
    elementOffset.restore();
    targetOffset.restore();
    setIndentForTarget.restore();
    updateLineSpan.restore();
  });
  test('Checking onMove for any thumb except first and last', () => {
    const sinon: sinonLib.SinonStatic = sinonLib;

    thumbs.driver = driverHorizontal;
    const activeRange: HTMLElement = thumbs.driver.createElementActiveRange();
    const elements: HTMLElement[] = thumbs.state.thumbs;

    const setCurrentTooltipValue = () => 0;
    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      clientX: 100,
      clientY: 100,
    });

    const setCurrentXorYtoOnMove = sinon.stub(driverHorizontal, 'getCurrentValueAxisToProcessMove');
    setCurrentXorYtoOnMove.onCall(0).returns(290);
    setCurrentXorYtoOnMove.onCall(1).returns(250);

    const elementOffset = sinon.stub(driverHorizontal, 'getElementOffset').callsFake(() => 290);
    elementOffset.onCall(0).returns(290);
    elementOffset.onCall(1).returns(250);
    elementOffset.onCall(2).returns(350);
    elementOffset.onCall(3).returns(250);

    const targetOffset = sinon.stub(driverHorizontal, 'getTargetWidth').callsFake(() => 24);
    const setIndentForTarget = sinon.stub(driverHorizontal, 'setIndentForTarget').callsFake(() => 0);
    const updateLineSpan = sinon.stub(driverHorizontal, 'updateActiveRange').callsFake(() => 0);

    const i = 1;
    const target: HTMLElement = elements[i];

    // If the value of any other than the first and last thumb exceeds the value of the next thumb
    thumbs.processMove(state, event, i, target, activeRange, setCurrentTooltipValue);
    expect(thumbs.state.currentValueAxis).toBe(266);

    // If the value of any other than the first and last thumb
    // is less than the value of the previous thumb
    thumbs.processMove(state, event, i, target, activeRange, setCurrentTooltipValue);
    expect(thumbs.state.currentValueAxis).toBe(274);

    // reset stubs
    setCurrentXorYtoOnMove.restore();
    elementOffset.restore();
    targetOffset.restore();
    setIndentForTarget.restore();
    updateLineSpan.restore();
  });
  test('Checking onMove for the last thumb', () => {
    const sinon: sinonLib.SinonStatic = sinonLib;

    thumbs.driver = driverHorizontal;
    const activeRange: HTMLElement = thumbs.driver.createElementActiveRange();
    const elements: HTMLElement[] = thumbs.state.thumbs;

    const setCurrentTooltipValue = () => 0;
    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      clientX: 100,
      clientY: 100,
    });

    const i = 3;
    const target: HTMLElement = elements[i];

    const setCurrentXorYtoOnMove = sinon.stub(driverHorizontal, 'getCurrentValueAxisToProcessMove');
    setCurrentXorYtoOnMove.onCall(0).returns(290);
    setCurrentXorYtoOnMove.onCall(1).returns(350);

    const elementOffset = sinon.stub(driverHorizontal, 'getElementOffset').callsFake(() => 290);
    const targetOffset = sinon.stub(driverHorizontal, 'getTargetWidth').callsFake(() => 24);
    const setIndentForTarget = sinon.stub(driverHorizontal, 'setIndentForTarget').callsFake(() => 0);
    const updateLineSpan = sinon.stub(driverHorizontal, 'updateActiveRange').callsFake(() => 0);

    // If the value of the thumb is less than the value of the previous thumb
    thumbs.processMove(state, event, i, target, activeRange, setCurrentTooltipValue);
    expect(thumbs.state.currentValueAxis).toBe(314);

    thumbs.state.maxValueAxis = 280;
    // If the thumb value is greater than the maximum allowable value of the previous thumb
    thumbs.processMove(state, event, i, target, activeRange, setCurrentTooltipValue);
    expect(thumbs.state.currentValueAxis).toBe(thumbs.state.maxValueAxis);

    // reset stubs
    setCurrentXorYtoOnMove.restore();
    elementOffset.restore();
    targetOffset.restore();
    setIndentForTarget.restore();
    updateLineSpan.restore();
  });
  test('Checking onStop', () => {
    const sinon: sinonLib.SinonStatic = sinonLib;

    thumbs.driver = driverHorizontal;
    const activeRange: HTMLElement = thumbs.driver.createElementActiveRange();
    const elements: HTMLElement[] = thumbs.state.thumbs;

    const setCurrentTooltipValue = () => 0;
    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      clientX: 100,
      clientY: 100,
    });
    const i = 1;
    const target: HTMLElement = elements[i];

    sinon.stub(driverHorizontal, 'setIndentForTargetToProcessStop').callsFake(() => 0);

    const handleMove = () => thumbs.processMove(state, event,
      i, target, activeRange, setCurrentTooltipValue);
    const handleStop = () => thumbs.processStop(handleMove, handleStop, event,
      i, target, state, setCurrentTooltipValue);

    thumbs.processStop(handleMove, handleStop, event, i, target, state, setCurrentTooltipValue);
    expect(thumbs.state.currentValue).toBe(null);
    expect(thumbs.state.currentThumbIndex).toBe(null);
  });
});
