import configuratorVertical from '../slider/view/configurators/configuratorVertical';
import createElement from '../slider/functions/createElement';
import { IModelState } from '../slider/interfaces/iModelState';
import sinonLib = require('sinon');

const sinon = sinonLib;

test('Create element with class "js-slider__vertical-tooltip-text"', () => {
  const elementTooltip = configuratorVertical.createElementTooltipText();
  expect(elementTooltip.tagName).toBe('SPAN');
  expect(elementTooltip.className).toContain('js-slider__vertical-tooltip-text');
});
test('Create element with class "js-slider__vertical-scale"', () => {
  const elementScale = configuratorVertical.createElementScale();
  expect(elementScale.tagName).toBe('DIV');
  expect(elementScale.className).toContain('js-slider__vertical-scale');
});
test('Create element with class "js-slider__active-range"', () => {
  const elementActivRange = configuratorVertical.createElementActivRange();
  expect(elementActivRange.tagName).toBe('SPAN');
  expect(elementActivRange.className).toContain('js-slider__vertical-active-range');
});
test('Find element with class "slider__tooltip-text"', () => {
  const tooltipText: HTMLElement = createElement('span', 'js-slider__tooltip-text');
  const parentTooltipText: HTMLElement = createElement('div', 'js-search-elements-tooltip-text');
  const elementCount = 4;
  for (let i = 0; i < elementCount; i += 1) {
    parentTooltipText.append(tooltipText);
  }
  const searchElementsTooltipText: HTMLElement[] = configuratorVertical.searchElementsTooltipText(parentTooltipText);
  expect(searchElementsTooltipText[0].className).toContain('js-slider__tooltip-text');
});
test('Calculate point coefficient', () => {
  const elementScale = configuratorVertical.createElementScale();
  elementScale.style.height = '200px';
  const calculateCoefficientPoint = configuratorVertical.calculateCoefficientPoint(elementScale, 100, 0);
  expect(calculateCoefficientPoint).toBe(2);
});
test('Find element with class "js-slider__scale" for delete', () => {
  const lineVerticalView: HTMLElement = createElement('span', 'js-slider__scale');
  const parentLineVerticalView: HTMLElement = createElement('div', 'parent-scale');
  parentLineVerticalView.append(lineVerticalView);
  const elementScaleToDelete: JQuery<HTMLElement> = configuratorVertical.searchElementScaleToDelete(parentLineVerticalView);
  expect(elementScaleToDelete[0].className).toBe('js-slider__scale');
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
  const elementScale: HTMLElement = configuratorVertical.createElementScale();
  const elementActivRange: HTMLElement = configuratorVertical.createElementActivRange();

  sinon.stub(configuratorVertical, 'calculateCoefficientPoint').callsFake( function () { return 2; });
  const calculateElementOffsetTop = sinon.stub(configuratorVertical, 'getElementOffset');
  calculateElementOffsetTop.onCall(0).returns(40);
  calculateElementOffsetTop.onCall(1).returns(90);
  calculateElementOffsetTop.onCall(2).returns(40);
  configuratorVertical.setInPlaceThumb(elements, modelState, elementActivRange, elementScale);
  expect(elements[0].style.top).toBe('40px');
  expect(elements[1].style.top).toBe('50px');
  expect(elements[2].style.top).toBe('60px');
  expect(elements[3].style.top).toBe('70px');
  expect(elementActivRange.style.marginTop).toBe('40px');
  expect(elementActivRange.style.height).toBe('50px');
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

  const elementSliderLineSpan: HTMLElement = configuratorVertical.createElementActivRange();

  const calculateElementOffsetleft = sinon.stub(configuratorVertical, 'getElementOffset');
  calculateElementOffsetleft.onCall(0).returns(40);
  calculateElementOffsetleft.onCall(1).returns(90);
  calculateElementOffsetleft.onCall(2).returns(40);

  configuratorVertical.setInPlaceNewThumb(elements, currentThumbIndex, coefficientPoint, modelState, shiftToMinValue, elementSliderLineSpan);
  expect(elements[0].style.top).toBe('30px');
  expect(elements[1].style.top).toBe('40px');
  expect(elements[2].style.top).toBe('50px');
  expect(elements[3].style.top).toBe('');
  expect(elementSliderLineSpan.style.marginTop).toBe('40px');
  expect(elementSliderLineSpan.style.height).toBe('50px');
  sinon.restore();
});
test('set currentY to OnStart', () => {
  const target: HTMLElement = createElement('div', 'slider-element');

  sinon.stub(configuratorVertical, 'getCurrentValueAxisToOnStart').callsFake( function () { return 30; });
  const targetOffsetLeft = configuratorVertical.getCurrentValueAxisToOnStart(target);
  expect(targetOffsetLeft).toBe(30);
  sinon.restore();
});
test('set startY to OnStart', () => {
  const eventThumb = new MouseEvent('click');
  const currentXorY = 20;

  sinon.stub(configuratorVertical, 'getStartValueAxisToOnStart').callsFake( function () { return 50; });
  const setStartXorYtoOnStart = configuratorVertical.getStartValueAxisToOnStart(eventThumb, currentXorY);
  expect(setStartXorYtoOnStart).toBe(50);
  sinon.restore();
});
test('set MaxY to OnStart', () => {
  const elementSliderLine: HTMLElement = configuratorVertical.createElementScale();

  sinon.stub(configuratorVertical, 'getMaxValueAxisToOnStart').callsFake( function () { return 150; });
  const setMaxXorYtoOnStart = configuratorVertical.getMaxValueAxisToOnStart(elementSliderLine);
  expect(setMaxXorYtoOnStart).toBe(150);
  sinon.restore();
});
test('set currentY to OnMove', () => {
  const eventThumb = new MouseEvent('click');
  const startXorY = 20;

  sinon.stub(configuratorVertical, 'getCurrentValueAxisToOnMove').callsFake( function () { return 50; });
  const setCurrentXorYtoOnMove = configuratorVertical.getCurrentValueAxisToOnMove(eventThumb, startXorY);
  expect(setCurrentXorYtoOnMove).toBe(50);
  sinon.restore();
});
test('set indent for target', () => {
  const target: HTMLElement = createElement('div', 'slider-element');
  const currentXorY = 20;

  configuratorVertical.setIndentForTarget(target, currentXorY);
  expect(target.style.top).toBe('20px');
});
test('get element Offset', () => {
  const element: HTMLElement = createElement('div', 'slider-element');

  sinon.stub(configuratorVertical, 'getElementOffset').callsFake( function () { return 120; });
  const elementOffset: number = configuratorVertical.getElementOffset(element);
  expect(elementOffset).toBe(120);
  sinon.restore();
});
test('get target Offset', () => {
  const target: HTMLElement = createElement('div', 'slider-element');

  sinon.stub(configuratorVertical, 'getTargetWidth').callsFake( function () { return 60; });
  const targetOffset: number = configuratorVertical.getTargetWidth(target);
  expect(targetOffset).toBe(60);
  sinon.restore();
});
test('set indent for target to OnStop', () => {
  const target: HTMLElement = createElement('div', 'slider-element');
  const coefficientPoint = 2;
  const currentValue = 25;
  const shiftToMinValue = 10;

  configuratorVertical.setIndentForTargetToOnStop(target, coefficientPoint, currentValue, shiftToMinValue);
  expect(target.style.top).toBe('40px');
});
test('update LineSpan', () => {
  const elementSliderLineSpan: HTMLElement = configuratorVertical.createElementActivRange();
  const elements: HTMLElement[] = [];
  const elementCount = 4;
  for (let i = 0; i < elementCount; i += 1) {
    const element: HTMLElement = createElement('div', 'slider-element');
    elements.push(element);
  }
  const calculateElementOffsetTop = sinon.stub(configuratorVertical, 'getElementOffset');
  calculateElementOffsetTop.onCall(0).returns(30);
  calculateElementOffsetTop.onCall(1).returns(95);
  calculateElementOffsetTop.onCall(2).returns(30);
  configuratorVertical.updateActiveRange(elementSliderLineSpan, elements);
  expect(elementSliderLineSpan.style.marginTop).toBe('30px');
  expect(elementSliderLineSpan.style.height).toBe('65px');
});
