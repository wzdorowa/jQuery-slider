import {configuratorHorizontal} from '../slider/view/configurators/configuratorHorizontal';
import {createElement} from '../slider/functions/createElement';
import { IModelState } from '../slider/interfaces/iModelState';
//import puppeteer from 'puppeteer';

var sinon = require('sinon');

test('Create element with class "slider-tooltip-text"', () => {
    const createElementTooltip = configuratorHorizontal.createElementTooltipText();
    expect(createElementTooltip.tagName).toBe('SPAN');
    expect(createElementTooltip.className).toBe('slider-tooltip-text');
});
test('Create element with class "slider-line"', () => {
    const createSliderLine = configuratorHorizontal.createElementScale();
    expect(createSliderLine.tagName).toBe('DIV');
    expect(createSliderLine.className).toBe('slider-line');
});
test('Create element with class "slider-line-span"', () => {
    const elementActivRange = configuratorHorizontal.createElementActivRange();
    expect(elementActivRange.tagName).toBe('SPAN');
    expect(elementActivRange.className).toBe('slider-line-span');
});
test('Find element with class "slider-tooltip-text-for-verticalView"', () => {
    const tooltipText: HTMLElement = createElement('span', 'slider-tooltip-text-for-verticalView');
    const parentTooltipText: HTMLElement = createElement('div', 'search-elements-tooltip-text');;
    const elementCount: number = 4;
    for(let i = 0; i < elementCount; i++) {
        parentTooltipText.append(tooltipText);
    }
    const searchElementsTooltipText: HTMLElement[] = configuratorHorizontal.searchElementsTooltipText(parentTooltipText);
    expect(searchElementsTooltipText[0].className).toBe('slider-tooltip-text-for-verticalView');
});
test('Calculate point coefficient', () => {
    const elementScale = configuratorHorizontal.createElementScale();
    elementScale.style.width = 200 + 'px';
    const calculateCoefficientPoint = configuratorHorizontal.calculateCoefficientPoint(elementScale, 100, 0);
    expect(calculateCoefficientPoint).toBe(2);
});
test('Find element with class "slider-line-span" for delete', () => {
    const lineVerticalView: HTMLElement = createElement('span', 'slider-line-for-verticalView');
    const parentLineVerticalView: HTMLElement = createElement('div', 'parent-slider-line-for-verticalView');
    parentLineVerticalView.append(lineVerticalView);
    const elementScaleToDelete: JQuery<HTMLElement> = configuratorHorizontal.searchElementScaleToDelete(parentLineVerticalView);
    expect(elementScaleToDelete[0].className).toBe('slider-line-for-verticalView');
});
test('Calculate value slider thumbs', () => {
    //@ts-ignore
    const modelState: IModelState = {};
    modelState.thumbsValues = [];
    modelState.max = 100;
    modelState.min = 0;

    const elements: HTMLElement[] = [];
    const elementCount: number = 4;
    let thumbsValue: number = 20;
    for(let i = 0; i < elementCount; i++) {
        const element: HTMLElement = createElement('div', 'slider-element');
        elements.push(element);
        modelState.thumbsValues.push(thumbsValue);
        thumbsValue = thumbsValue + 5;
    }
    const elementScale: HTMLElement = configuratorHorizontal.createElementScale();
    const elementActivRange: HTMLElement = configuratorHorizontal.createElementActivRange();
    
    sinon.stub(configuratorHorizontal, 'calculateCoefficientPoint').callsFake( function () { return 2; });
    let calculateElementOffsetleft = sinon.stub(configuratorHorizontal, 'getElementOffset');
    calculateElementOffsetleft.onCall(0).returns(40);
    calculateElementOffsetleft.onCall(1).returns(90);
    calculateElementOffsetleft.onCall(2).returns(40);
    configuratorHorizontal.setInPlaceThumb(elements, modelState, elementActivRange, elementScale);
    expect(elements[0].style.left).toBe('40px');
    expect(elements[1].style.left).toBe('50px');
    expect(elements[2].style.left).toBe('60px');
    expect(elements[3].style.left).toBe('70px');
    expect(elementActivRange.style.marginLeft).toBe('40px');
    expect(elementActivRange.style.width).toBe('50px');
    sinon.restore();
});
test('Calculate new value slider thumbs', () => {
    //@ts-ignore
    const modelState: IModelState = {};
    modelState.thumbsValues = [];
    modelState.max = 100;
    modelState.min = 0;

    const elements: HTMLElement[] = [];
    const elementCount: number = 4;
    let thumbsValue: number = 20;
    for(let i = 0; i < elementCount; i++) {
        const element: HTMLElement = createElement('div', 'slider-element');
        elements.push(element);
        modelState.thumbsValues.push(thumbsValue);
        thumbsValue = thumbsValue + 5;
    }
    const currentThumbIndex: number = 3;
    const coefficientPoint: number = 2;
    const shiftToMinValue: number = 10;

    const elementSliderLineSpan: HTMLElement = configuratorHorizontal.createElementActivRange();

    let calculateElementOffsetleft = sinon.stub(configuratorHorizontal, 'getElementOffset');
    calculateElementOffsetleft.onCall(0).returns(40);
    calculateElementOffsetleft.onCall(1).returns(90);
    calculateElementOffsetleft.onCall(2).returns(40);

    configuratorHorizontal.setInPlaceNewThumb(elements, currentThumbIndex, coefficientPoint, modelState, shiftToMinValue, elementSliderLineSpan);
    expect(elements[0].style.left).toBe('30px');
    expect(elements[1].style.left).toBe('40px');
    expect(elements[2].style.left).toBe('50px');
    expect(elements[3].style.left).toBe('');
    expect(elementSliderLineSpan.style.marginLeft).toBe('40px');
    expect(elementSliderLineSpan.style.width).toBe('50px');
    sinon.restore();
});
test('set currentX to OnStart', () => {
    const target: HTMLElement = createElement('div', 'slider-element');

    sinon.stub(configuratorHorizontal, 'getCurrentValueAxisToOnStart').callsFake( function () { return 30; });
    const targetOffsetLeft = configuratorHorizontal.getCurrentValueAxisToOnStart(target);
    expect(targetOffsetLeft).toBe(30);
    sinon.restore();
});
test('set startX to OnStart', () => {
    //@ts-ignore
    const eventThumb: MouseEvent = MouseEvent;
    const currentXorY: number = 20;

    sinon.stub(configuratorHorizontal, 'getStartValueAxisToOnStart').callsFake( function () { return 50; });
    const setStartXorYtoOnStart = configuratorHorizontal.getStartValueAxisToOnStart(eventThumb, currentXorY);
    expect(setStartXorYtoOnStart).toBe(50);
    sinon.restore();
});
test('set MaxX to OnStart', () => {
    const elementSliderLine: HTMLElement = configuratorHorizontal.createElementScale();

    sinon.stub(configuratorHorizontal, 'getMaxValueAxisToOnStart').callsFake( function () { return 150; });
    const setMaxXorYtoOnStart = configuratorHorizontal.getMaxValueAxisToOnStart(elementSliderLine);
    expect(setMaxXorYtoOnStart).toBe(150);
    sinon.restore();
});
test('set currentX to OnMove', () => {
    //@ts-ignore
    const eventThumb: MouseEvent = MouseEvent;
    const startXorY: number = 20;

    sinon.stub(configuratorHorizontal, 'getCurrentValueAxisToOnMove').callsFake( function () { return 50; });
    const setCurrentXorYtoOnMove = configuratorHorizontal.getCurrentValueAxisToOnMove(eventThumb, startXorY);
    expect(setCurrentXorYtoOnMove).toBe(50);
    sinon.restore();
});
test('set indent for target', () => {
    const target: HTMLElement = createElement('div', 'slider-element');
    const currentXorY: number = 20;

    configuratorHorizontal.setIndentForTarget(target, currentXorY);
    expect(target.style.left).toBe('20px');
})
test('get element Offset', () => {
    const element: HTMLElement = createElement('div', 'slider-element');

    sinon.stub(configuratorHorizontal, 'getElementOffset').callsFake( function () { return 120; });
    const elementOffset: number = configuratorHorizontal.getElementOffset(element);
    expect(elementOffset).toBe(120);
    sinon.restore();
});
test('get target Offset', () => {
    const target: HTMLElement = createElement('div', 'slider-element');

    sinon.stub(configuratorHorizontal, 'getTargetWidth').callsFake( function () { return 60; });
    const targetOffset: number = configuratorHorizontal.getTargetWidth(target);
    expect(targetOffset).toBe(60);
    sinon.restore();
});
test('set indent for target to OnStop', () =>{
    const target: HTMLElement = createElement('div', 'slider-element');
    const coefficientPoint: number = 2;
    const currentValue: number = 25;
    const shiftToMinValue: number = 10;

    configuratorHorizontal.setIndentForTargetToOnStop(target, coefficientPoint, currentValue, shiftToMinValue);
    expect(target.style.left).toBe('40px');
});
test('update LineSpan', () => {
    const elementSliderLineSpan: HTMLElement = configuratorHorizontal.createElementActivRange();
    const elements: HTMLElement[] = [];
    const elementCount: number = 4;
    for(let i = 0; i < elementCount; i++) {
        const element: HTMLElement = createElement('div', 'slider-element');
        elements.push(element);
    }
    let calculateElementOffsetleft = sinon.stub(configuratorHorizontal, 'getElementOffset');
    calculateElementOffsetleft.onCall(0).returns(30);
    calculateElementOffsetleft.onCall(1).returns(95);
    calculateElementOffsetleft.onCall(2).returns(30);
    configuratorHorizontal.updateActiveRange(elementSliderLineSpan, elements);
    expect(elementSliderLineSpan.style.marginLeft).toBe('30px');
    expect(elementSliderLineSpan.style.width).toBe('65px');
})