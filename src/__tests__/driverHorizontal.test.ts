import sinonLib = require('sinon');
import driverHorizontal from '../slider/view/drivers/driverHorizontal';
import createElement from '../slider/functions/createElement';
import { IModelState } from '../slider/interfaces/iModelState';

const sinon = sinonLib;

const createHTMLElement = (thumbsValues: number[]) => {
  const htmlFragment = document.createDocumentFragment();

  const elementScale = driverHorizontal.createElementScale();
  const elementActiveRange = driverHorizontal.createElementActiveRange();
  elementScale.append(elementActiveRange);
  htmlFragment.append(elementScale);

  thumbsValues.forEach(() => {
    const thumb: HTMLElement = createElement(
      'div',
      'slider__thumb js-slider__thumb',
    );
    const elementTooltip = driverHorizontal.createElementTooltipText();
    thumb.append(elementTooltip);
    htmlFragment.append(thumb);
  });

  return htmlFragment;
};

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
  const tooltipText: HTMLElement = createElement(
    'span',
    'js-slider__vertical-tooltip-text',
  );
  const parentTooltipText: HTMLElement = createElement(
    'div',
    'search-elements-tooltip-text',
  );
  const elementCount = 4;
  for (let i = 0; i < elementCount; i += 1) {
    parentTooltipText.append(tooltipText);
  }
  const searchElementsTooltipText: HTMLElement[] = driverHorizontal.searchElementsTooltipText(
    parentTooltipText,
  );
  expect(searchElementsTooltipText[0].className).toBe(
    'js-slider__vertical-tooltip-text',
  );
});
test('Calculate point coefficient', () => {
  const slider: HTMLElement = createElement('div', 'slider');
  const htmlFragment = createHTMLElement([20, 30, 40, 50]);
  slider.append(htmlFragment);

  const $scaleElement: HTMLElement[] = Array.from(
    $(slider).find('.js-slider__scale'),
  );
  $scaleElement[0].style.width = '200px';
  const calculateCoefficientPoint: number = driverHorizontal.calculateCoefficientPoint(
    slider,
    100,
    0,
  );
  expect(calculateCoefficientPoint).toBe(2);
});
test('Find element with class "js-slider__active-range" for delete', () => {
  const lineVerticalView: HTMLElement = createElement(
    'span',
    'js-slider__vertical-scale',
  );
  const parentLineVerticalView: HTMLElement = createElement(
    'div',
    'parent-scale-for-verticalView',
  );
  parentLineVerticalView.append(lineVerticalView);
  const elementScaleToDelete: JQuery<HTMLElement> = driverHorizontal.searchElementScaleToDelete(
    parentLineVerticalView,
  );
  expect(elementScaleToDelete[0].className).toBe('js-slider__vertical-scale');
});
test('Calculate value slider thumbs', () => {
  const modelState: IModelState = {
    min: 0,
    max: 100,
    thumbsValues: [20, 30, 40, 50],
    orientation: 'horizontal',
    thumbsCount: 4,
    step: 2,
    isTooltip: true,
  };

  const slider: HTMLElement = createElement('div', 'slider');
  const htmlFragment = createHTMLElement([20, 30, 40, 50]);
  slider.append(htmlFragment);

  const elements: HTMLElement[] = Array.from(
    $(slider).find('.js-slider__thumb'),
  );

  const currentThumbIndex = null;
  const coefficientPoint = 2;
  const { thumbsValues } = modelState;
  const shiftToMinValue = 0;

  const $activeRangeElement: HTMLElement[] = Array.from(
    $(slider).find('.js-slider__active-range'),
  );
  const range = $activeRangeElement[0];

  sinon.stub(driverHorizontal, 'calculateCoefficientPoint').callsFake(() => 2);
  const calculateElementOffsetLeft = sinon.stub(
    driverHorizontal,
    'getElementOffset',
  );
  calculateElementOffsetLeft.onCall(0).returns(40);
  calculateElementOffsetLeft.onCall(1).returns(90);
  calculateElementOffsetLeft.onCall(2).returns(40);
  driverHorizontal.setInPlaceThumb({
    elements,
    currentThumbIndex,
    coefficientPoint,
    thumbsValues,
    shiftToMinValue,
    slider,
  });
  expect(elements[0].style.left).toBe('40px');
  expect(elements[1].style.left).toBe('60px');
  expect(elements[2].style.left).toBe('80px');
  expect(elements[3].style.left).toBe('100px');
  expect(range.style.marginLeft).toBe('40px');
  expect(range.style.width).toBe('50px');
  sinon.restore();
});
test('Calculate value slider thumb', () => {
  const modelState: IModelState = {
    min: 0,
    max: 100,
    thumbsValues: [20],
    orientation: 'horizontal',
    thumbsCount: 1,
    step: 2,
    isTooltip: true,
  };

  const slider: HTMLElement = createElement('div', 'slider');
  const htmlFragment = createHTMLElement([20]);
  slider.append(htmlFragment);

  const elements: HTMLElement[] = Array.from(
    $(slider).find('.js-slider__thumb'),
  );

  const currentThumbIndex = null;
  const coefficientPoint = 2;
  const { thumbsValues } = modelState;
  const shiftToMinValue = 0;

  const $activeRangeElement: HTMLElement[] = Array.from(
    $(slider).find('.js-slider__active-range'),
  );
  const range = $activeRangeElement[0];

  sinon.stub(driverHorizontal, 'calculateCoefficientPoint').callsFake(() => 2);
  const calculateElementOffsetLeft = sinon.stub(
    driverHorizontal,
    'getElementOffset',
  );
  calculateElementOffsetLeft.onCall(0).returns(40);
  calculateElementOffsetLeft.onCall(1).returns(90);
  calculateElementOffsetLeft.onCall(2).returns(40);
  driverHorizontal.setInPlaceThumb({
    elements,
    currentThumbIndex,
    coefficientPoint,
    thumbsValues,
    shiftToMinValue,
    slider,
  });
  expect(elements[0].style.left).toBe('40px');
  expect(range.style.marginLeft).toBe('0px');
  expect(range.style.width).toBe('40px');
  sinon.restore();
});
test('set currentX to OnStart', () => {
  const target: HTMLElement = createElement('div', 'slider-element');

  sinon
    .stub(driverHorizontal, 'getCurrentValueAxisToProcessStart')
    .callsFake(() => 30);
  const targetOffsetLeft: number = driverHorizontal.getCurrentValueAxisToProcessStart(
    target,
  );
  expect(targetOffsetLeft).toBe(30);
  sinon.restore();
});
test('set startX to OnStart', () => {
  const eventThumb = new MouseEvent('click');
  const currentXorY = 20;

  sinon
    .stub(driverHorizontal, 'getStartValueAxisToProcessStart')
    .callsFake(() => 50);
  const setStartXorYtoOnStart: number = driverHorizontal.getStartValueAxisToProcessStart(
    eventThumb,
    currentXorY,
  );
  expect(setStartXorYtoOnStart).toBe(50);
  sinon.restore();
});
test('set MaxX to OnStart', () => {
  const elementSliderLine: HTMLElement = driverHorizontal.createElementScale();

  sinon
    .stub(driverHorizontal, 'getMaxValueAxisToProcessStart')
    .callsFake(() => 150);
  const setMaxXorYtoOnStart: number = driverHorizontal.getMaxValueAxisToProcessStart(
    elementSliderLine,
  );
  expect(setMaxXorYtoOnStart).toBe(150);
  sinon.restore();
});
test('set currentX to OnMove', () => {
  const eventThumb = new MouseEvent('click');
  const startXorY = 20;

  sinon
    .stub(driverHorizontal, 'getCurrentValueAxisToProcessMove')
    .callsFake(() => 50);
  const setCurrentXorYtoOnMove: number = driverHorizontal.getCurrentValueAxisToProcessMove(
    eventThumb,
    startXorY,
  );
  expect(setCurrentXorYtoOnMove).toBe(50);
  sinon.restore();
});
test('set indent for target', () => {
  const target: HTMLElement = createElement('div', 'slider-element');
  const slider: HTMLElement = createElement('div', 'slider');
  const htmlFragment = createHTMLElement([20, 30, 40, 50]);
  slider.append(htmlFragment);
  const currentXorY = 20;

  driverHorizontal.setIndentForTarget(target, currentXorY, slider);
  expect(target.style.left).toBe('20px');
});
test('get element Offset', () => {
  const element: HTMLElement = createElement('div', 'slider-element');

  sinon.stub(driverHorizontal, 'getElementOffset').callsFake(() => 120);
  const elementOffset: number = driverHorizontal.getElementOffset(element);
  expect(elementOffset).toBe(120);
  sinon.restore();
});
test('set indent for target to OnStop', () => {
  const target: HTMLElement = createElement('div', 'slider-element');
  const slider: HTMLElement = createElement('div', 'slider');
  const htmlFragment = createHTMLElement([20, 30, 40, 50]);
  slider.append(htmlFragment);
  const coefficientPoint = 2;
  const currentValue = 25;
  const shiftToMinValue = 10;

  driverHorizontal.setIndentForTargetToProcessStop({
    target,
    coefficientPoint,
    currentValue,
    shiftToMinValue,
    slider,
  });
  expect(target.style.left).toBe('40px');
});
test('update LineSpan', () => {
  const slider: HTMLElement = createElement('div', 'slider');
  const htmlFragment = createHTMLElement([20, 30, 40, 50]);
  slider.append(htmlFragment);

  const calculateElementOffsetLeft = sinon.stub(
    driverHorizontal,
    'getElementOffset',
  );
  const $activeRangeElement: HTMLElement[] = Array.from(
    $(slider).find('.js-slider__active-range'),
  );
  const range = $activeRangeElement[0];

  calculateElementOffsetLeft.onCall(0).returns(30);
  calculateElementOffsetLeft.onCall(1).returns(95);
  calculateElementOffsetLeft.onCall(2).returns(30);
  driverHorizontal.updateActiveRange(slider);
  expect(range.style.marginLeft).toBe('30px');
  expect(range.style.width).toBe('65px');
});
