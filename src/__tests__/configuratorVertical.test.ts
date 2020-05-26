import {configuratorVertical} from '../slider/view/configurators/configuratorVertical';
import {createElement} from '../slider/functions/createElement';
import { IModelState } from '../slider/interfaces/iModelState';
//import puppeteer from 'puppeteer';

var sinon = require('sinon');

test('Create element with class "slider-tooltip-text-for-verticalView"', () => {
    const elementTooltip = configuratorVertical.createElementTooltipText();
    expect(elementTooltip.tagName).toBe('SPAN');
    expect(elementTooltip.className).toBe('slider-tooltip-text-for-verticalView');
});
test('Create element with class "slider-line-for-verticalView"', () => {
    const elementScale = configuratorVertical.createElementScale();
    expect(elementScale.tagName).toBe('DIV');
    expect(elementScale.className).toBe('slider-line-for-verticalView');
});
test('Create element with class "slider-line-span"', () => {
    const elementActivRange = configuratorVertical.createElementActivRange();
    expect(elementActivRange.tagName).toBe('SPAN');
    expect(elementActivRange.className).toBe('slider-line-span-for-verticalView');
});
test('Find element with class "slider-tooltip-text"', () => {
    const tooltipText: HTMLElement = createElement('span', 'slider-tooltip-text');
    const parentTooltipText: HTMLElement = createElement('div', 'search-elements-tooltip-text');;
    const elementCount: number = 4;
    for(let i = 0; i < elementCount; i++) {
        parentTooltipText.append(tooltipText);
    }
    const searchElementsTooltipText: HTMLElement[] = configuratorVertical.searchElementsTooltipText(parentTooltipText);
    expect(searchElementsTooltipText[0].className).toBe('slider-tooltip-text');
});
test('Calculate point coefficient', () => {
    const elementScale = configuratorVertical.createElementScale();
    elementScale.style.height = 200 + 'px';
    const calculateCoefficientPoint = configuratorVertical.calculateCoefficientPoint(elementScale, 100, 0);
    expect(calculateCoefficientPoint).toBe(2);
});
test('Find element with class "slider-line" for delete', () => {
    const lineVerticalView: HTMLElement = createElement('span', 'slider-line');
    const parentLineVerticalView: HTMLElement = createElement('div', 'parent-slider-line');
    parentLineVerticalView.append(lineVerticalView);
    const elementScaleToDelete: JQuery<HTMLElement> = configuratorVertical.searchElementScaleToDelete(parentLineVerticalView);
    expect(elementScaleToDelete[0].className).toBe('slider-line');
});
test('Calculate value slider touch', () => {
    //@ts-ignore
    const modelState: IModelState = {};
    modelState.touchsValues = [];
    modelState.max = 100;
    modelState.min = 0;

    const elements: HTMLElement[] = [];
    const elementCount: number = 4;
    let touchsValue: number = 20;
    for(let i = 0; i < elementCount; i++) {
        const element: HTMLElement = createElement('div', 'slider-element');
        elements.push(element);
        modelState.touchsValues.push(touchsValue);
        touchsValue = touchsValue + 5;
    }
    const elementScale: HTMLElement = configuratorVertical.createElementScale();
    const elementActivRange: HTMLElement = configuratorVertical.createElementActivRange();
    
    sinon.stub(configuratorVertical, 'calculateCoefficientPoint').callsFake( function () { return 2; });
    let calculateElementOffsetTop = sinon.stub(configuratorVertical, 'getElementOffset');
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
test('Calculate new value slider touch', () => {
    //@ts-ignore
    const modelState: IModelState = {};
    modelState.touchsValues = [];
    modelState.max = 100;
    modelState.min = 0;

    const elements: HTMLElement[] = [];
    const elementCount: number = 4;
    let touchsValue: number = 20;
    for(let i = 0; i < elementCount; i++) {
        const element: HTMLElement = createElement('div', 'slider-element');
        elements.push(element);
        modelState.touchsValues.push(touchsValue);
        touchsValue = touchsValue + 5;
    }
    const currentTouchIndex: number = 3;
    const coefficientPoint: number = 2;
    const shiftToMinValue: number = 10;

    const elementSliderLineSpan: HTMLElement = configuratorVertical.createElementActivRange();

    let calculateElementOffsetleft = sinon.stub(configuratorVertical, 'getElementOffset');
    calculateElementOffsetleft.onCall(0).returns(40);
    calculateElementOffsetleft.onCall(1).returns(90);
    calculateElementOffsetleft.onCall(2).returns(40);

    configuratorVertical.setInPlaceNewThumb(elements, currentTouchIndex, coefficientPoint, modelState, shiftToMinValue, elementSliderLineSpan);
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
    //@ts-ignore
    const eventTouch: MouseEvent = MouseEvent;
    const currentXorY: number = 20;

    sinon.stub(configuratorVertical, 'getStartValueAxisToOnStart').callsFake( function () { return 50; });
    const setStartXorYtoOnStart = configuratorVertical.getStartValueAxisToOnStart(eventTouch, currentXorY);
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
    //@ts-ignore
    const eventTouch: MouseEvent = MouseEvent;
    const startXorY: number = 20;

    sinon.stub(configuratorVertical, 'getCurrentValueAxisToOnMove').callsFake( function () { return 50; });
    const setCurrentXorYtoOnMove = configuratorVertical.getCurrentValueAxisToOnMove(eventTouch, startXorY);
    expect(setCurrentXorYtoOnMove).toBe(50);
    sinon.restore();
});
test('set indent for target', () => {
    const target: HTMLElement = createElement('div', 'slider-element');
    const currentXorY: number = 20;

    configuratorVertical.setIndentForTarget(target, currentXorY);
    expect(target.style.top).toBe('20px');
})
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
test('set indent for target to OnStop', () =>{
    const target: HTMLElement = createElement('div', 'slider-element');
    const coefficientPoint: number = 2;
    const currentValue: number = 25;
    const shiftToMinValue: number = 10;

    configuratorVertical.setIndentForTargetToOnStop(target, coefficientPoint, currentValue, shiftToMinValue);
    expect(target.style.top).toBe('40px');
});
test('update LineSpan', () => {
    const elementSliderLineSpan: HTMLElement = configuratorVertical.createElementActivRange();
    const elements: HTMLElement[] = [];
    const elementCount: number = 4;
    for(let i = 0; i < elementCount; i++) {
        const element: HTMLElement = createElement('div', 'slider-element');
        elements.push(element);
    }
    let calculateElementOffsetTop = sinon.stub(configuratorVertical, 'getElementOffset');
    calculateElementOffsetTop.onCall(0).returns(30);
    calculateElementOffsetTop.onCall(1).returns(95);
    calculateElementOffsetTop.onCall(2).returns(30);
    configuratorVertical.updateActiveRange(elementSliderLineSpan, elements);
    expect(elementSliderLineSpan.style.marginTop).toBe('30px');
    expect(elementSliderLineSpan.style.height).toBe('65px');
})