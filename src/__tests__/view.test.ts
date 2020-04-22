import {View} from '../slider/view';
import { EventEmitter } from '../slider/eventEmitter';
import {IModelState} from '../slider/iModelState';
//import puppeteer from 'puppeteer';

//var sinon = require('sinon');

debugger;
const element = window.document.createElement('div');
element.className = 'js-slider-test';
window.document.body.appendChild(element);

const eventEmitter = new EventEmitter();
let emitter = eventEmitter;

//@ts-ignore
const view = new View(element, eventEmitter);

let state: IModelState = {
    min: 0,
    max: 100,
    touchsValues: [20,30,40,50],
    orientation: 'horizontal',
    amount: 4,
    step: 2,
    tooltip: true,
}
test('Check creating basic HTML slider structure', () => {
    emitter.emit('model:state-changed', state);
    //Проверка корректного создания элементов
    const touchElements = window.document.querySelectorAll('.slider-touch');
    const sliderSpans = window.document.querySelectorAll('.slider-span');
    const tooltips = window.document.querySelectorAll('.slider-tooltip');
    const tooltipsText = window.document.querySelectorAll('.slider-tooltip-text');
    const sliderLine = window.document.querySelector('.slider-line');
    const sliderLineSpan = window.document.querySelector('.slider-line-span');

    expect(touchElements.length).toBe(state.amount);
    expect(sliderSpans.length).toBe(state.amount);
    expect(tooltips.length).toBe(state.amount);
    expect(tooltipsText.length).toBe(state.amount);
    expect(sliderLine?.className).toBe('slider-line');
    expect(sliderLineSpan?.className).toBe('slider-line-span');
});
test('Check for parents for created items', () => {
    //Проверить наличие родителей у созданных элементов
    const parentTouchElements = window.document.querySelectorAll('.slider-touch')[0].parentNode;
    const parentSliderSpans = window.document.querySelectorAll('.slider-span')[0].parentNode;
    const parentTooltips = window.document.querySelectorAll('.slider-tooltip')[0].parentNode;
    const parentTooltipsText = window.document.querySelectorAll('.slider-tooltip-text')[0].parentNode;
    const parentSliderLine = window.document.querySelector('.slider-line')?.parentNode;
    const parentSliderLineSpan = window.document.querySelector('.slider-line-span')?.parentNode;

    //@ts-ignore
    expect(parentTouchElements.className).toContain('js-slider-test');
    //@ts-ignore
    expect(parentSliderSpans.className).toBe('slider-touch');
    //@ts-ignore
    expect(parentTooltips.className).toBe('slider-touch');
    //@ts-ignore
    expect(parentTooltipsText.className).toBe('slider-tooltip');
    //@ts-ignore
    expect(parentSliderLine.className).toContain('js-slider-test');
    //@ts-ignore
    expect(parentSliderLineSpan.className).toBe('slider-line');
});
test('Check class replacement for some elements when changing orientation', () => {
    //Проверить замену классов у некоторых элементов при смене ориентации
    state.orientation = 'vertical';
    emitter.emit('model:state-changed', state);

    const tooltipsText = window.document.querySelectorAll('.slider-tooltip-text-for-verticalView');
    const sliderLine = window.document.querySelector('.slider-line-for-verticalView');
    const sliderLineSpan = window.document.querySelector('.slider-line-span-for-verticalView');

    expect(tooltipsText.length).toBe(state.amount);
    expect(tooltipsText[0].className).toBe('slider-tooltip-text-for-verticalView');
    expect(tooltipsText[0].className).not.toBe('slider-tooltip-text');

    expect(sliderLine?.className).toBe('slider-line-for-verticalView');
    expect(sliderLine?.className).not.toBe('slider-line');

    expect(sliderLineSpan?.className).toBe('slider-line-span-for-verticalView');
    expect(sliderLineSpan?.className).not.toBe('slider-line-span');

    state.orientation = 'horizontal';
    emitter.emit('model:state-changed', state);
});
test('Check Add Sliders', () => {
    //Проверить изменение количества созданных элементов при изменении количества ползунков
    state.amount = 5;
    emitter.emit('model:state-changed', state);

    const touchElements = window.document.querySelectorAll('.slider-touch');
    const sliderSpans = window.document.querySelectorAll('.slider-span');
    const tooltips = window.document.querySelectorAll('.slider-tooltip');
    const tooltipsText = window.document.querySelectorAll('.slider-tooltip-text');

    expect(touchElements.length).toBe(state.amount);
    expect(sliderSpans.length).toBe(state.amount);
    expect(tooltips.length).toBe(state.amount);
    expect(tooltipsText.length).toBe(state.amount);

    //Проверить значение добавленного ползунка
    expect(state.touchsValues.length).toBe(5);
    expect(state.touchsValues[4]).toBe(52);
});
test('Check for sliders removal', () => {
    //Проверить удаление ползунков
    state.amount = 3;
    emitter.emit('model:state-changed', state);

    const touchElements = window.document.querySelectorAll('.slider-touch');
    const sliderSpans = window.document.querySelectorAll('.slider-span');
    const tooltips = window.document.querySelectorAll('.slider-tooltip');
    const tooltipsText = window.document.querySelectorAll('.slider-tooltip-text');

    expect(touchElements.length).toBe(state.amount);
    expect(sliderSpans.length).toBe(state.amount);
    expect(tooltips.length).toBe(state.amount);
    expect(tooltipsText.length).toBe(state.amount);
    expect(state.touchsValues.length).toBe(3);
});
test('Check for tooltips when changing state', () => {
    //Проверить наличие тултипов при изменении стейта
    state.tooltip = false;
    emitter.emit('model:state-changed', state);

    let tooltips = window.document.querySelectorAll('.slider-tooltip');
    //@ts-ignore
    expect(tooltips[0].className).toContain('slider-tooltip-hide');

    state.tooltip = true;
    emitter.emit('model:state-changed', state);

    tooltips = window.document.querySelectorAll('.slider-tooltip');
    //@ts-ignore
    expect(tooltips[0].className).not.toContain('slider-tooltip-hide');
});
test('Check tooltip values', () => {
    //Проверить наличие значений в тултипах
    const tooltipsText = window.document.querySelectorAll('.slider-tooltip-text');

    expect(tooltipsText[0].innerHTML).toContain('20');
    expect(tooltipsText[1].innerHTML).toContain('30');
    expect(tooltipsText[2].innerHTML).toContain('40');
});
// describe('', () => {
//     //@ts-ignore
//     let browser: any;
//     //@ts-ignore
//     let page: any;

//     beforeEach(async () => {
//         browser = await puppeteer.launch({ headless: false});
//         page = await browser.newPage();
//     });
//     afterEach(async () => {
        
//         await browser.close();
//     });
//     test('Checking the location of the sliders on the slider', async () => {
//         await page.goto('http://localhost:1234');
//         await page.waitFor(1000);

//         // Checking the location of the sliders on the slider
//         const touchElements = await page.querySelectorAll('.slider-touch');
//         console.log('touchElements', touchElements.length);
        
//         //@ts-ignore
//         const elementMarginLeft = await page.$$eval('.slider-touch', divs => divs);
//         console.log('elementMarginLeft', elementMarginLeft[0].offsetLeft);
//        // expect(elementMarginLeft).toBe('30px');
//         // elementSliderLine.width = elementSliderLineOffsetWidth; 
        
//     })
//})
