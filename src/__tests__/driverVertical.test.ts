import sinonLib = require('sinon');
import driverVertical from '../slider/view/drivers/driverVertical';
import createElement from '../slider/functions/createElement';
import { IModelState } from '../slider/interfaces/iModelState';

const sinon = sinonLib;

const createHTMLElement = (thumbsValues: number[]) => {
  const htmlFragment = document.createDocumentFragment();

  const elementScale = driverVertical.createElementScale();
  const elementActiveRange = driverVertical.createElementActiveRange();
  elementScale.append(elementActiveRange);
  htmlFragment.append(elementScale);

  thumbsValues.forEach(() => {
    const thumb: HTMLElement = createElement(
      'div',
      'slider__thumb js-slider__thumb',
    );
    const elementTooltip = driverVertical.createElementTooltipText();
    thumb.append(elementTooltip);
    htmlFragment.append(thumb);
  });

  return htmlFragment;
};

test('Create element with class "js-slider__vertical-tooltip-text"', () => {
  const elementTooltip = driverVertical.createElementTooltipText();
  expect(elementTooltip.tagName).toBe('SPAN');
  expect(elementTooltip.className).toContain(
    'js-slider__vertical-tooltip-text',
  );
});
test('Create element with class "js-slider__vertical-scale"', () => {
  const elementScale = driverVertical.createElementScale();
  expect(elementScale.tagName).toBe('DIV');
  expect(elementScale.className).toContain('js-slider__vertical-scale');
});
test('Create element with class "js-slider__active-range"', () => {
  const elementActiveRange = driverVertical.createElementActiveRange();
  expect(elementActiveRange.tagName).toBe('SPAN');
  expect(elementActiveRange.className).toContain(
    'js-slider__vertical-active-range',
  );
});
test('Find element with class "slider__tooltip-text"', () => {
  const tooltipText: HTMLElement = createElement(
    'span',
    'js-slider__tooltip-text',
  );
  const parentTooltipText: HTMLElement = createElement(
    'div',
    'js-search-elements-tooltip-text',
  );
  const elementCount = 4;
  for (let i = 0; i < elementCount; i += 1) {
    parentTooltipText.append(tooltipText);
  }
  const searchElementsTooltipText: HTMLElement[] = driverVertical.searchElementsTooltipText(
    parentTooltipText,
  );
  expect(searchElementsTooltipText[0].className).toContain(
    'js-slider__tooltip-text',
  );
});
test('Calculate point coefficient', () => {
  const slider: HTMLElement = createElement('div', 'slider');
  const htmlFragment = createHTMLElement([20, 30, 40, 50]);
  slider.append(htmlFragment);

  const $scaleElement: HTMLElement[] = Array.from(
    $(slider).find('.js-slider__vertical-scale'),
  );
  $scaleElement[0].style.height = '200px';
  const calculateCoefficientPoint: number = driverVertical.calculateCoefficientPoint(
    slider,
    100,
    0,
  );
  expect(calculateCoefficientPoint).toBe(2);
});
test('Find element with class "js-slider__scale" for delete', () => {
  const lineVerticalView: HTMLElement = createElement(
    'span',
    'js-slider__scale',
  );
  const parentLineVerticalView: HTMLElement = createElement(
    'div',
    'parent-scale',
  );
  parentLineVerticalView.append(lineVerticalView);
  const elementScaleToDelete: JQuery<HTMLElement> = driverVertical.searchElementScaleToDelete(
    parentLineVerticalView,
  );
  expect(elementScaleToDelete[0].className).toBe('js-slider__scale');
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
    isScaleOfValues: true,
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
    $(slider).find('.js-slider__vertical-active-range'),
  );
  const range = $activeRangeElement[0];

  sinon.stub(driverVertical, 'calculateCoefficientPoint').callsFake(() => 2);
  const calculateElementOffsetTop = sinon.stub(
    driverVertical,
    'getElementOffset',
  );
  calculateElementOffsetTop.onCall(0).returns(40);
  calculateElementOffsetTop.onCall(1).returns(90);
  calculateElementOffsetTop.onCall(2).returns(40);
  driverVertical.setInPlaceThumb({
    elements,
    currentThumbIndex,
    coefficientPoint,
    thumbsValues,
    shiftToMinValue,
    slider,
  });
  expect(elements[0].style.top).toBe('40px');
  expect(elements[1].style.top).toBe('60px');
  expect(elements[2].style.top).toBe('80px');
  expect(elements[3].style.top).toBe('100px');
  expect(range.style.marginTop).toBe('40px');
  expect(range.style.height).toBe('50px');
  sinon.restore();
});
test('Calculate value slider thumbs', () => {
  const modelState: IModelState = {
    min: 0,
    max: 100,
    thumbsValues: [20],
    orientation: 'horizontal',
    thumbsCount: 1,
    step: 2,
    isTooltip: true,
    isScaleOfValues: true,
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
    $(slider).find('.js-slider__vertical-active-range'),
  );
  const range = $activeRangeElement[0];

  sinon.stub(driverVertical, 'calculateCoefficientPoint').callsFake(() => 2);
  const calculateElementOffsetTop = sinon.stub(
    driverVertical,
    'getElementOffset',
  );
  calculateElementOffsetTop.onCall(0).returns(40);
  calculateElementOffsetTop.onCall(1).returns(90);
  calculateElementOffsetTop.onCall(2).returns(40);
  driverVertical.setInPlaceThumb({
    elements,
    currentThumbIndex,
    coefficientPoint,
    thumbsValues,
    shiftToMinValue,
    slider,
  });
  expect(elements[0].style.top).toBe('40px');
  expect(range.style.marginTop).toBe('0px');
  expect(range.style.height).toBe('40px');
  sinon.restore();
});
test('set currentY to OnStart', () => {
  const target: HTMLElement = createElement('div', 'slider-element');

  sinon
    .stub(driverVertical, 'getCurrentValueAxisToProcessStart')
    .callsFake(() => 30);
  const targetOffsetLeft = driverVertical.getCurrentValueAxisToProcessStart(
    target,
  );
  expect(targetOffsetLeft).toBe(30);
  sinon.restore();
});
test('set startY to OnStart', () => {
  const eventThumb = new MouseEvent('click');
  const currentXorY = 20;

  sinon
    .stub(driverVertical, 'getStartValueAxisToProcessStart')
    .callsFake(() => 50);
  const setStartXorYtoOnStart: number = driverVertical.getStartValueAxisToProcessStart(
    eventThumb,
    currentXorY,
  );
  expect(setStartXorYtoOnStart).toBe(50);
  sinon.restore();
});
test('set MaxY to OnStart', () => {
  const elementSliderLine: HTMLElement = driverVertical.createElementScale();

  sinon
    .stub(driverVertical, 'getMaxValueAxisToProcessStart')
    .callsFake(() => 150);
  const setMaxXorYtoOnStart = driverVertical.getMaxValueAxisToProcessStart(
    elementSliderLine,
  );
  expect(setMaxXorYtoOnStart).toBe(150);
  sinon.restore();
});
test('set currentY to OnMove', () => {
  const eventThumb = new MouseEvent('click');
  const startXorY = 20;

  sinon
    .stub(driverVertical, 'getCurrentValueAxisToProcessMove')
    .callsFake(() => 50);
  const setCurrentXorYtoOnMove: number = driverVertical.getCurrentValueAxisToProcessMove(
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

  driverVertical.setIndentForTarget(target, currentXorY, slider);
  expect(target.style.top).toBe('20px');
});
test('get element Offset', () => {
  const element: HTMLElement = createElement('div', 'slider-element');

  sinon.stub(driverVertical, 'getElementOffset').callsFake(() => 120);
  const elementOffset: number = driverVertical.getElementOffset(element);
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

  driverVertical.setIndentForTargetToProcessStop({
    target,
    coefficientPoint,
    currentValue,
    shiftToMinValue,
    slider,
  });
  expect(target.style.top).toBe('40px');
});
test('update LineSpan', () => {
  const slider: HTMLElement = createElement('div', 'slider');
  const htmlFragment = createHTMLElement([20, 30, 40, 50]);
  slider.append(htmlFragment);
  const calculateElementOffsetTop = sinon.stub(
    driverVertical,
    'getElementOffset',
  );

  const $activeRangeElement: HTMLElement[] = Array.from(
    $(slider).find('.js-slider__vertical-active-range'),
  );
  const range = $activeRangeElement[0];
  calculateElementOffsetTop.onCall(0).returns(30);
  calculateElementOffsetTop.onCall(1).returns(95);
  calculateElementOffsetTop.onCall(2).returns(30);
  driverVertical.updateActiveRange(slider);
  expect(range.style.marginTop).toBe('30px');
  expect(range.style.height).toBe('65px');
});
