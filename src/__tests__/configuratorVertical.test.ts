import {configuratorVertical} from '../slider/view/configurators/configuratorVertical';
import {createElement} from '../slider/functions/createElement';
import { IModelState } from '../slider/interfaces/iModelState';
//import puppeteer from 'puppeteer';

var sinon = require('sinon');

test('Create element with class "slider-tooltip-text-for-verticalView"', () => {
    const createElementTooltip = configuratorVertical.createSliderTooltipText();
    expect(createElementTooltip.tagName).toBe('SPAN');
    expect(createElementTooltip.className).toBe('slider-tooltip-text-for-verticalView');
});
test('Create element with class "slider-line-for-verticalView"', () => {
    const createSliderLine = configuratorVertical.createSliderLine();
    expect(createSliderLine.tagName).toBe('DIV');
    expect(createSliderLine.className).toBe('slider-line-for-verticalView');
});
test('Create element with class "slider-line-span"', () => {
    const createSliderLineSpan = configuratorVertical.createSliderLineSpan();
    expect(createSliderLineSpan.tagName).toBe('SPAN');
    expect(createSliderLineSpan.className).toBe('slider-line-span-for-verticalView');
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
    const createSliderLine = configuratorVertical.createSliderLine();
    createSliderLine.style.height = 200 + 'px';
    const calculateCoefficientPoint = configuratorVertical.calculateCoefficientPoint(createSliderLine, 100, 0);
    expect(calculateCoefficientPoint).toBe(2);
});
test('Find element with class "slider-line" for delete', () => {
    const lineVerticalView: HTMLElement = createElement('span', 'slider-line');
    const parentLineVerticalView: HTMLElement = createElement('div', 'parent-slider-line');
    parentLineVerticalView.append(lineVerticalView);
    const sliderLineToDelete: JQuery<HTMLElement> = configuratorVertical.sliderLineToDelete(parentLineVerticalView);
    expect(sliderLineToDelete[0].className).toBe('slider-line');
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
    const elementSliderLine: HTMLElement = configuratorVertical.createSliderLine();
    const elementSliderLineSpan: HTMLElement = configuratorVertical.createSliderLineSpan();
    
    sinon.stub(configuratorVertical, 'calculateCoefficientPoint').callsFake( function () { return 2; });
    let calculateElementOffsetTop = sinon.stub(configuratorVertical, 'calculateElementOffsetLeftOrTop');
    calculateElementOffsetTop.onCall(0).returns(40);
    calculateElementOffsetTop.onCall(1).returns(90);
    calculateElementOffsetTop.onCall(2).returns(40);
    configuratorVertical.calculateValueSliderTouch(elements, modelState, elementSliderLineSpan, elementSliderLine);
    expect(elements[0].style.top).toBe('40px');
    expect(elements[1].style.top).toBe('50px');
    expect(elements[2].style.top).toBe('60px');
    expect(elements[3].style.top).toBe('70px');
    expect(elementSliderLineSpan.style.marginTop).toBe('40px');
    expect(elementSliderLineSpan.style.height).toBe('50px');
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

    const elementSliderLineSpan: HTMLElement = configuratorVertical.createSliderLineSpan();

    let calculateElementOffsetleft = sinon.stub(configuratorVertical, 'calculateElementOffsetLeftOrTop');
    calculateElementOffsetleft.onCall(0).returns(40);
    calculateElementOffsetleft.onCall(1).returns(90);
    calculateElementOffsetleft.onCall(2).returns(40);

    configuratorVertical.calculateNewValueSliderTouch(elements, currentTouchIndex, coefficientPoint, modelState, shiftToMinValue, elementSliderLineSpan);
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

    sinon.stub(configuratorVertical, 'setCurrentXorYtoOnStart').callsFake( function () { return 30; });
    const targetOffsetLeft = configuratorVertical.setCurrentXorYtoOnStart(target);
    expect(targetOffsetLeft).toBe(30);
    sinon.restore();
});
test('set startY to OnStart', () => {
    //@ts-ignore
    const eventTouch: MouseEvent = MouseEvent;
    const currentXorY: number = 20;

    sinon.stub(configuratorVertical, 'setStartXorYtoOnStart').callsFake( function () { return 50; });
    const setStartXorYtoOnStart = configuratorVertical.setStartXorYtoOnStart(eventTouch, currentXorY);
    expect(setStartXorYtoOnStart).toBe(50);
    sinon.restore();
});
test('set MaxY to OnStart', () => {
    const elementSliderLine: HTMLElement = configuratorVertical.createSliderLine();

    sinon.stub(configuratorVertical, 'setMaxXorYtoOnStart').callsFake( function () { return 150; });
    const setMaxXorYtoOnStart = configuratorVertical.setMaxXorYtoOnStart(elementSliderLine);
    expect(setMaxXorYtoOnStart).toBe(150);
    sinon.restore();
});
test('set currentY to OnMove', () => {
    //@ts-ignore
    const eventTouch: MouseEvent = MouseEvent;
    const startXorY: number = 20;

    sinon.stub(configuratorVertical, 'setCurrentXorYtoOnMove').callsFake( function () { return 50; });
    const setCurrentXorYtoOnMove = configuratorVertical.setCurrentXorYtoOnMove(eventTouch, startXorY);
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

    sinon.stub(configuratorVertical, 'elementOffset').callsFake( function () { return 120; });
    const elementOffset: number = configuratorVertical.elementOffset(element);
    expect(elementOffset).toBe(120);
    sinon.restore();
});
test('get target Offset', () => {
    const target: HTMLElement = createElement('div', 'slider-element');

    sinon.stub(configuratorVertical, 'targetOffset').callsFake( function () { return 60; });
    const targetOffset: number = configuratorVertical.targetOffset(target);
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
    const elementSliderLineSpan: HTMLElement = configuratorVertical.createSliderLineSpan();
    const elements: HTMLElement[] = [];
    const elementCount: number = 4;
    for(let i = 0; i < elementCount; i++) {
        const element: HTMLElement = createElement('div', 'slider-element');
        elements.push(element);
    }
    let calculateElementOffsetTop = sinon.stub(configuratorVertical, 'calculateElementOffsetLeftOrTop');
    calculateElementOffsetTop.onCall(0).returns(30);
    calculateElementOffsetTop.onCall(1).returns(95);
    calculateElementOffsetTop.onCall(2).returns(30);
    configuratorVertical.updateLineSpan(elementSliderLineSpan, elements);
    expect(elementSliderLineSpan.style.marginTop).toBe('30px');
    expect(elementSliderLineSpan.style.height).toBe('65px');
})