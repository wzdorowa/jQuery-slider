import {configuratorHorizontal} from '../slider/configuratorHorizontal';
import {createElement} from '../slider/functions/createElement';
import { IModelState } from '../slider/iModelState';
//import puppeteer from 'puppeteer';

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
})
test('Find element with class "slider-line-span" for delete', () => {
    const lineVerticalView: HTMLElement = createElement('span', 'slider-line-for-verticalView');
    const parentLineVerticalView: HTMLElement = createElement('div', 'parent-slider-line-for-verticalView');
    parentLineVerticalView.append(lineVerticalView);
    const sliderLineToDelete: JQuery<HTMLElement> = configuratorHorizontal.sliderLineToDelete(parentLineVerticalView);
    expect(sliderLineToDelete[0].className).toBe('slider-line-for-verticalView');
});
test('', () => {
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
    const elementSliderLine = configuratorHorizontal.createSliderLine();
    elementSliderLine.style.width = 200 + 'px';

    const elementSliderLineSpan: HTMLElement = configuratorHorizontal.createSliderLineSpan();
    
    configuratorHorizontal.calculateValueSliderTouch(elements, modelState, elementSliderLineSpan, elementSliderLine);
    expect(elements[0].style.left).toBe('40px');
    expect(elements[1].style.left).toBe('50px');
    expect(elements[2].style.left).toBe('60px');
    expect(elements[3].style.left).toBe('70px');
})