import {configuratorHorizontal} from '../slider/configuratorHorizontal';
import {createElement} from '../slider/functions/createElement';
import { IModelState } from '../slider/iModelState';
//import puppeteer from 'puppeteer';

var sinon = require('sinon');

describe('Start tests', () => {
    // //@ts-ignore
    // let browser;
    // //@ts-ignore
    // let page: any;

    // beforeEach(async () => {
    //     browser = await puppeteer.launch({ headless: false});
    //     page = await browser.newPage();
    // });
    // afterEach(async () => {
    //     //@ts-ignore
    //     await browser.close();
    // });
    // test('Calculate point coefficient', async () => {
    //     await page.goto('http://localhost:1234');
    //     await page.waitFor(1000);
        
    //     const elementSliderLine = await page.$('.slider-line');
    //     //@ts-ignore
    //     const elementSliderLineOffsetWidth = await page.$eval('.slider-line', e => e.offsetWidth);
    //     elementSliderLine.width = elementSliderLineOffsetWidth; 
        
    // })
});
test('Сhange the class from vertical to horizontal', () => {
    const slider: HTMLElement = createElement('span', 'height-vertical-slider-container');
    configuratorHorizontal.setWidthHeightSliderContainer(slider);
    expect(slider.tagName).toBe('SPAN');
    expect(slider.className).not.toBe('height-vertical-slider-container');
    expect(slider.className).toBe('width-horizontal-slider-container');
});
test('Create element with class "slider-tooltip-text"', () => {
    const createElementTooltip = configuratorHorizontal.createSliderTooltipText();
    expect(createElementTooltip.tagName).toBe('SPAN');
    expect(createElementTooltip.className).toBe('slider-tooltip-text');
});
test('Create element with class "slider-line"', () => {
    const createSliderLine = configuratorHorizontal.createSliderLine();
    expect(createSliderLine.tagName).toBe('DIV');
    expect(createSliderLine.className).toBe('slider-line');
});
test('Create element with class "slider-line-span"', () => {
    const createSliderLineSpan = configuratorHorizontal.createSliderLineSpan();
    expect(createSliderLineSpan.tagName).toBe('SPAN');
    expect(createSliderLineSpan.className).toBe('slider-line-span');
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
    const createSliderLine = configuratorHorizontal.createSliderLine();
    createSliderLine.style.width = 200 + 'px';
    const calculateCoefficientPoint = configuratorHorizontal.calculateCoefficientPoint(createSliderLine, 100, 0);
    expect(calculateCoefficientPoint).toBe(2);
});
test('Find element with class "slider-line-span" for delete', () => {
    const lineVerticalView: HTMLElement = createElement('span', 'slider-line-for-verticalView');
    const parentLineVerticalView: HTMLElement = createElement('div', 'parent-slider-line-for-verticalView');
    parentLineVerticalView.append(lineVerticalView);
    const sliderLineToDelete: JQuery<HTMLElement> = configuratorHorizontal.sliderLineToDelete(parentLineVerticalView);
    expect(sliderLineToDelete[0].className).toBe('slider-line-for-verticalView');
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
    const elementSliderLine: HTMLElement = configuratorHorizontal.createSliderLine();
    const elementSliderLineSpan: HTMLElement = configuratorHorizontal.createSliderLineSpan();
    
    sinon.stub(configuratorHorizontal, 'calculateCoefficientPoint').callsFake( function () { return 2; });
    let calculateElementOffsetleft = sinon.stub(configuratorHorizontal, 'calculateElementOffsetLeftOrTop');
    calculateElementOffsetleft.onCall(0).returns(40);
    calculateElementOffsetleft.onCall(1).returns(90);
    calculateElementOffsetleft.onCall(2).returns(40);
    configuratorHorizontal.calculateValueSliderTouch(elements, modelState, elementSliderLineSpan, elementSliderLine);
    expect(elements[0].style.left).toBe('40px');
    expect(elements[1].style.left).toBe('50px');
    expect(elements[2].style.left).toBe('60px');
    expect(elements[3].style.left).toBe('70px');
    expect(elementSliderLineSpan.style.marginLeft).toBe('40px');
    expect(elementSliderLineSpan.style.width).toBe('50px');
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

    const elementSliderLineSpan: HTMLElement = configuratorHorizontal.createSliderLineSpan();

    let calculateElementOffsetleft = sinon.stub(configuratorHorizontal, 'calculateElementOffsetLeftOrTop');
    calculateElementOffsetleft.onCall(0).returns(40);
    calculateElementOffsetleft.onCall(1).returns(90);
    calculateElementOffsetleft.onCall(2).returns(40);

    configuratorHorizontal.calculateNewValueSliderTouch(elements, currentTouchIndex, coefficientPoint, modelState, shiftToMinValue, elementSliderLineSpan);
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

    sinon.stub(configuratorHorizontal, 'setCurrentXorYtoOnStart').callsFake( function () { return 30; });
    const targetOffsetLeft = configuratorHorizontal.setCurrentXorYtoOnStart(target);
    expect(targetOffsetLeft).toBe(30);
    sinon.restore();
});
test('set startX to OnStart', () => {
    //@ts-ignore
    const eventTouch: MouseEvent = MouseEvent;
    const currentXorY: number = 20;

    sinon.stub(configuratorHorizontal, 'setStartXorYtoOnStart').callsFake( function () { return 50; });
    const setStartXorYtoOnStart = configuratorHorizontal.setStartXorYtoOnStart(eventTouch, currentXorY);
    expect(setStartXorYtoOnStart).toBe(50);
    sinon.restore();
});
test('set MaxX to OnStart', () => {
    const elementSliderLine: HTMLElement = configuratorHorizontal.createSliderLine();

    sinon.stub(configuratorHorizontal, 'setMaxXorYtoOnStart').callsFake( function () { return 150; });
    const setMaxXorYtoOnStart = configuratorHorizontal.setMaxXorYtoOnStart(elementSliderLine);
    expect(setMaxXorYtoOnStart).toBe(150);
    sinon.restore();
});
test('set currentX to OnMove', () => {
    //@ts-ignore
    const eventTouch: MouseEvent = MouseEvent;
    const startXorY: number = 20;

    sinon.stub(configuratorHorizontal, 'setCurrentXorYtoOnMove').callsFake( function () { return 50; });
    const setCurrentXorYtoOnMove = configuratorHorizontal.setCurrentXorYtoOnMove(eventTouch, startXorY);
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

    sinon.stub(configuratorHorizontal, 'elementOffset').callsFake( function () { return 120; });
    const elementOffset: number = configuratorHorizontal.elementOffset(element);
    expect(elementOffset).toBe(120);
    sinon.restore();
});
test('get target Offset', () => {
    const target: HTMLElement = createElement('div', 'slider-element');

    sinon.stub(configuratorHorizontal, 'targetOffset').callsFake( function () { return 60; });
    const targetOffset: number = configuratorHorizontal.targetOffset(target);
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
    const elementSliderLineSpan: HTMLElement = configuratorHorizontal.createSliderLineSpan();
    const elements: HTMLElement[] = [];
    const elementCount: number = 4;
    for(let i = 0; i < elementCount; i++) {
        const element: HTMLElement = createElement('div', 'slider-element');
        elements.push(element);
    }
    let calculateElementOffsetleft = sinon.stub(configuratorHorizontal, 'calculateElementOffsetLeftOrTop');
    calculateElementOffsetleft.onCall(0).returns(30);
    calculateElementOffsetleft.onCall(1).returns(95);
    calculateElementOffsetleft.onCall(2).returns(30);
    configuratorHorizontal.updateLineSpan(elementSliderLineSpan, elements);
    expect(elementSliderLineSpan.style.marginLeft).toBe('30px');
    expect(elementSliderLineSpan.style.width).toBe('65px');
})