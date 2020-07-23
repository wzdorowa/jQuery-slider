import sinonLib = require('sinon');
import driverHorizontal from '../slider/view/drivers/driverHorizontal';
import createElement from '../slider/functions/createElement';
import { IModelState } from '../slider/interfaces/iModelState';

const sinon = sinonLib;

test('Create element with class "slider__tooltip-text"', () => {
  const createElementTooltip = driverHorizontal.createElementTooltipText();
  expect(createElementTooltip.tagName).toBe('SPAN');
  expect(createElementTooltip.className).toContain('slider__tooltip-text');
});
test('Create element with class "js-slider__scale"', () => {
  const createSliderLine = driverHorizontal.createElementScale();
  expect(createSliderLine.tagName).toBe('DIV');
  expect(createSliderLine.className).toContain('js-slider__scale');
});
test('Create element with class "js-slider__active-range"', () => {
  const elementActiveRange = driverHorizontal.createElementActiveRange();
  expect(elementActiveRange.tagName).toBe('SPAN');
  expect(elementActiveRange.className).toContain('js-slider__active-range');
});
test('Find element with class "js-slider__vertical-tooltip-text"', () => {
  const tooltipText: HTMLElement = createElement('span', 'js-slider__vertical-tooltip-text');
  const parentTooltipText: HTMLElement = createElement('div', 'search-elements-tooltip-text');
  const elementCount = 4;
  for (let i = 0; i < elementCount; i += 1) {
    parentTooltipText.append(tooltipText);
  }
  const searchElementsTooltipText:
  HTMLElement[] = driverHorizontal.searchElementsTooltipText(parentTooltipText);
  expect(searchElementsTooltipText[0].className).toBe('js-slider__vertical-tooltip-text');
});
test('Calculate point coefficient', () => {
  const elementScale = driverHorizontal.createElementScale();
  elementScale.style.width = '200px';
  const calculateCoefficientPoint:
  number = driverHorizontal.calculateCoefficientPoint(elementScale, 100, 0);
  expect(calculateCoefficientPoint).toBe(2);
});
test('Find element with class "js-slider__active-range" for delete', () => {
  const lineVerticalView: HTMLElement = createElement('span', 'js-slider__vertical-scale');
  const parentLineVerticalView: HTMLElement = createElement('div', 'parent-scale-for-verticalView');
  parentLineVerticalView.append(lineVerticalView);
  const elementScaleToDelete:
  JQuery<HTMLElement> = driverHorizontal.searchElementScaleToDelete(parentLineVerticalView);
  expect(elementScaleToDelete[0].className).toBe('js-slider__vertical-scale');
});
test('Calculate value slider thumbs', () => {
  const modelState: IModelState = {
    min: 0,
    max: 100,
    thumbsValues: [],
    orientation: 'horizontal',
    amount: 4,
    step: 2,
    isTooltip: true,
  };

  const elements: HTMLElement[] = [];
  const elementCount = 4;
  let thumbsValue = 20;
  for (let i = 0; i < elementCount; i += 1) {
    const element: HTMLElement = createElement('div', 'slider-element');
    elements.push(element);
    modelState.thumbsValues.push(thumbsValue);
    thumbsValue += 5;
  }
  const elementScale: HTMLElement = driverHorizontal.createElementScale();
  const elementActiveRange: HTMLElement = driverHorizontal.createElementActiveRange();

  sinon.stub(driverHorizontal, 'calculateCoefficientPoint').callsFake(() => 2);
  const calculateElementOffsetLeft = sinon.stub(driverHorizontal, 'getElementOffset');
  calculateElementOffsetLeft.onCall(0).returns(40);
  calculateElementOffsetLeft.onCall(1).returns(90);
  calculateElementOffsetLeft.onCall(2).returns(40);
  driverHorizontal.setInPlaceThumb(elements, modelState, elementActiveRange, elementScale);
  expect(elements[0].style.left).toBe('40px');
  expect(elements[1].style.left).toBe('50px');
  expect(elements[2].style.left).toBe('60px');
  expect(elements[3].style.left).toBe('70px');
  expect(elementActiveRange.style.marginLeft).toBe('40px');
  expect(elementActiveRange.style.width).toBe('50px');
  sinon.restore();
});
test('Calculate new value slider thumbs', () => {
  const modelState: IModelState = {
    min: 0,
    max: 100,
    thumbsValues: [],
    orientation: 'horizontal',
    amount: 4,
    step: 2,
    isTooltip: true,
  };

  const elements: HTMLElement[] = [];
  const elementCount = 4;
  let thumbsValue = 20;
  for (let i = 0; i < elementCount; i += 1) {
    const element: HTMLElement = createElement('div', 'slider-element');
    elements.push(element);
    modelState.thumbsValues.push(thumbsValue);
    thumbsValue += 5;
  }
  const currentThumbIndex = 3;
  const coefficientPoint = 2;
  const shiftToMinValue = 10;

  const activeRange: HTMLElement = driverHorizontal.createElementActiveRange();

  const calculateElementOffsetLeft = sinon.stub(driverHorizontal, 'getElementOffset');
  calculateElementOffsetLeft.onCall(0).returns(40);
  calculateElementOffsetLeft.onCall(1).returns(90);
  calculateElementOffsetLeft.onCall(2).returns(40);

  driverHorizontal.setInPlaceNewThumb(elements,
    currentThumbIndex, coefficientPoint, modelState, shiftToMinValue, activeRange);
  expect(elements[0].style.left).toBe('30px');
  expect(elements[1].style.left).toBe('40px');
  expect(elements[2].style.left).toBe('50px');
  expect(elements[3].style.left).toBe('');
  expect(activeRange.style.marginLeft).toBe('40px');
  expect(activeRange.style.width).toBe('50px');
  sinon.restore();
});
test('set currentX to OnStart', () => {
  const target: HTMLElement = createElement('div', 'slider-element');

  sinon.stub(driverHorizontal, 'getCurrentValueAxisToProcessStart').callsFake(() => 30);
  const targetOffsetLeft: number = driverHorizontal.getCurrentValueAxisToProcessStart(target);
  expect(targetOffsetLeft).toBe(30);
  sinon.restore();
});
test('set startX to OnStart', () => {
  const eventThumb = new MouseEvent('click');
  const currentXorY = 20;

  sinon.stub(driverHorizontal, 'getStartValueAxisToProcessStart').callsFake(() => 50);
  const setStartXorYtoOnStart:
  number = driverHorizontal.getStartValueAxisToProcessStart(eventThumb, currentXorY);
  expect(setStartXorYtoOnStart).toBe(50);
  sinon.restore();
});
test('set MaxX to OnStart', () => {
  const elementSliderLine: HTMLElement = driverHorizontal.createElementScale();

  sinon.stub(driverHorizontal, 'getMaxValueAxisToProcessStart').callsFake(() => 150);
  const setMaxXorYtoOnStart:
  number = driverHorizontal.getMaxValueAxisToProcessStart(elementSliderLine);
  expect(setMaxXorYtoOnStart).toBe(150);
  sinon.restore();
});
test('set currentX to OnMove', () => {
  const eventThumb = new MouseEvent('click');
  const startXorY = 20;

  sinon.stub(driverHorizontal, 'getCurrentValueAxisToProcessMove').callsFake(() => 50);
  const setCurrentXorYtoOnMove:
  number = driverHorizontal.getCurrentValueAxisToProcessMove(eventThumb, startXorY);
  expect(setCurrentXorYtoOnMove).toBe(50);
  sinon.restore();
});
test('set indent for target', () => {
  const target: HTMLElement = createElement('div', 'slider-element');
  const currentXorY = 20;

  driverHorizontal.setIndentForTarget(target, currentXorY);
  expect(target.style.left).toBe('20px');
});
test('get element Offset', () => {
  const element: HTMLElement = createElement('div', 'slider-element');

  sinon.stub(driverHorizontal, 'getElementOffset').callsFake(() => 120);
  const elementOffset: number = driverHorizontal.getElementOffset(element);
  expect(elementOffset).toBe(120);
  sinon.restore();
});
test('get target Offset', () => {
  const target: HTMLElement = createElement('div', 'slider-element');

  sinon.stub(driverHorizontal, 'getTargetWidth').callsFake(() => 60);
  const targetOffset: number = driverHorizontal.getTargetWidth(target);
  expect(targetOffset).toBe(60);
  sinon.restore();
});
test('set indent for target to OnStop', () => {
  const target: HTMLElement = createElement('div', 'slider-element');
  const coefficientPoint = 2;
  const currentValue = 25;
  const shiftToMinValue = 10;

  driverHorizontal.setIndentForTargetToProcessStop(target,
    coefficientPoint, currentValue, shiftToMinValue);
  expect(target.style.left).toBe('40px');
});
test('update LineSpan', () => {
  const elementActiveRange: HTMLElement = driverHorizontal.createElementActiveRange();
  const elements: HTMLElement[] = [];
  const elementCount = 4;
  for (let i = 0; i < elementCount; i += 1) {
    const element: HTMLElement = createElement('div', 'slider-element');
    elements.push(element);
  }
  const calculateElementOffsetLeft = sinon.stub(driverHorizontal, 'getElementOffset');
  calculateElementOffsetLeft.onCall(0).returns(30);
  calculateElementOffsetLeft.onCall(1).returns(95);
  calculateElementOffsetLeft.onCall(2).returns(30);
  driverHorizontal.updateActiveRange(elementActiveRange, elements);
  expect(elementActiveRange.style.marginLeft).toBe('30px');
  expect(elementActiveRange.style.width).toBe('65px');
});
