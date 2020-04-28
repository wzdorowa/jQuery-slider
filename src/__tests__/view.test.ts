import {View} from '../slider/view';
import { EventEmitter } from '../slider/eventEmitter';
import {IModelState} from '../slider/iModelState';
import puppeteer from 'puppeteer';

//var sinon = require('sinon');

let state: IModelState = {
    min: 0,
    max: 100,
    touchsValues: [20,30,40,50],
    orientation: 'horizontal',
    amount: 4,
    step: 2,
    tooltip: true,
};
describe('Модульные тесты', () => {

    const element = window.document.createElement('div');
    element.className = 'js-slider-test';
    window.document.body.appendChild(element);
    
    const eventEmitter = new EventEmitter();
    let emitter = eventEmitter;
    
    //@ts-ignore
    const view = new View(element, eventEmitter);
    
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
});
describe('Интеграционные тесты для горизонтального вида', () => {
    //@ts-ignore
    let browser: any;
    //@ts-ignore
    let page: any;

    beforeEach(async () => {
        const element: HTMLDivElement | null = window.document.querySelector('.js-slider-test');
        if(element !== null || element !== undefined) {
            element?.remove();
        }; 
        browser = await puppeteer.launch({ headless: false});
        page = await browser.newPage();
    });
    afterEach(async () => {
        await browser.close();
    });
    test('Checking the location of the sliders on the slider', async () => {
        await page.goto('http://localhost:1234');
        await page.waitFor(500);

        //Функция для нахождения коэффициента единичного значения слайдера в пикселях
        const getCoefficientPoint = (sliderLineWidth: number, max: number, min: number) => {
           return sliderLineWidth / (max - min);
        };
        //Функция для нахождения значения минимально возможной дистанции между ползунками
        const getDistanceTouches = (touchWidth: number, coefficientPoint: number) => {
            return Math.ceil(touchWidth / coefficientPoint);
        };
        const getCurrentValue = (offsetLeft: number, startSlider: number, coefficientPoint: number) => {
            return Math.floor((offsetLeft - startSlider) / coefficientPoint);
        };
        const getPlaceRelativeToPreviousTouch = (currentValue: number, distanceTouches: number, coefficientPoint: number, startSlider: number) => {
            return Math.ceil((currentValue + distanceTouches) * coefficientPoint + startSlider);
        };
        const getPlaceRelativeToNextTouch = (currentValue: number, distanceTouches: number, coefficientPoint: number, startSlider: number) => {
            return Math.ceil((currentValue - distanceTouches) * coefficientPoint + startSlider);
        };
        const calculateValue = (offsetLeft: number, startSlider: number) => {
            let currentValueX: number = Math.floor((offsetLeft - startSlider) / coefficientPoint) + state.min;
            let multi: number = Math.floor(currentValueX / state.step);
            currentValueX = state.step * multi;
            return currentValueX;
        }
        // Найти координаты линии слайдера
        const sliderLine: HTMLDivElement = await page.$('.slider-line');
        const rectSliderLine = await page.evaluate((sliderLine: HTMLDivElement) => {
            const {top, left, bottom, right} = sliderLine.getBoundingClientRect();
            return {top, left, bottom, right};
        }, sliderLine);
        const sliderLineWidth: number = rectSliderLine.right - rectSliderLine.left;
        
        //Найти первый ползунок и его ширину
        const touchElements: HTMLDivElement[] = await page.$$('.slider-touch');
        const firstElement: HTMLDivElement = touchElements[0];
        let rectFirstElement = await page.evaluate((element: HTMLDivElement) => {
            const {top, left, bottom, right} = element.getBoundingClientRect();
            return {top, left, bottom, right};
        }, firstElement);
        const elementWidth: number = rectFirstElement.right - rectFirstElement.left;
        
        //Найти координаты второго ползунка
        const secondElement: HTMLDivElement = touchElements[1];
        let rectSecondElement = await page.evaluate((element: HTMLDivElement) => {
            const {top, left, bottom, right} = element.getBoundingClientRect();
            return {top, left, bottom, right};
        }, secondElement);

        //Точки начала и конца линии слайдера
        const startPointSlider = rectSliderLine.left - (elementWidth/2);
        //@ts-ignore
        const endPointSlider = rectSliderLine.right + (elementWidth/2);

        //Определить значения и коэффициенты перед проверкой работы первого ползунка
        const coefficientPoint = getCoefficientPoint(sliderLineWidth, state.max, state.min);
        const distanceTouches = getDistanceTouches(elementWidth, coefficientPoint);
        let currentValueToNextTouch = getCurrentValue(rectSecondElement.left, startPointSlider, coefficientPoint);
        //место относительно следующего ползунка на слайдере
        let placeRelativeToNextTouch = getPlaceRelativeToNextTouch(currentValueToNextTouch, distanceTouches, coefficientPoint, startPointSlider)
        
        // Проверить корректность работы первого ползунка
        await page.mouse.move(514, 54);
        await page.mouse.down();
        await page.waitFor(200);
        await page.mouse.move(450,  54, { steps: 2});
        await page.waitFor(200);
        await page.mouse.up();

        rectFirstElement = await page.evaluate((element: HTMLDivElement) => {
            const {top, left, bottom, right} = element.getBoundingClientRect();
            return {top, left, bottom, right};
          }, firstElement);
        expect(rectFirstElement.left).toBe(startPointSlider);
        
        await page.mouse.move(448, 54);
        await page.mouse.down();
        await page.waitFor(200);
        await page.mouse.move(700,  54, { steps: 2});
        await page.waitFor(200);
        await  page.mouse.up();

        rectFirstElement = await page.evaluate((element: HTMLDivElement) => {
            const {top, left, bottom, right} = element.getBoundingClientRect();
            return {top, left, bottom, right};
          }, firstElement);
        expect(rectFirstElement.left).toBe(placeRelativeToNextTouch);

        // Проверить корректность работы одного из промежуточных ползунков, например, третьего
          //Найти координаты третьего ползунка
        const thirdElement: HTMLDivElement = touchElements[2];
        let rectThirdElement = await page.evaluate((element: HTMLDivElement) => {
            const {top, left, bottom, right} = element.getBoundingClientRect();
            return {top, left, bottom, right};
        }, thirdElement);

        // Найти координаты последнего ползунка
        const lastElement: HTMLDivElement = touchElements[touchElements.length - 1];
        let rectLastElement = await page.evaluate((element: HTMLDivElement) => {
            const {top, left, bottom, right} = element.getBoundingClientRect();
            return {top, left, bottom, right};
        }, lastElement);

        let currentValueToPreviousTouch = getCurrentValue(rectSecondElement.left, startPointSlider, coefficientPoint);
        let placeRelativeToPreviousTouch = getPlaceRelativeToPreviousTouch(currentValueToPreviousTouch, distanceTouches, coefficientPoint, startPointSlider);
        currentValueToNextTouch = getCurrentValue(rectLastElement.left, startPointSlider, coefficientPoint);
        placeRelativeToNextTouch = getPlaceRelativeToNextTouch(currentValueToNextTouch, distanceTouches, coefficientPoint, startPointSlider)

        await page.mouse.move(592, 54);
        await page.mouse.down();
        await page.waitFor(200);
        await page.mouse.move(670,  54, { steps: 2});
        await page.waitFor(200);
        await page.mouse.up();

        rectThirdElement = await page.evaluate((element: HTMLDivElement) => {
            const {top, left, bottom, right} = element.getBoundingClientRect();
            return {top, left, bottom, right};
        }, thirdElement);

        expect(rectThirdElement.left).toBe(placeRelativeToNextTouch);

        await page.mouse.move(618, 54);
        await page.mouse.down();
        await page.waitFor(200);
        await page.mouse.move(530,  54, { steps: 2});
        await page.waitFor(200);
        await page.mouse.up();

        rectThirdElement = await page.evaluate((element: HTMLDivElement) => {
            const {top, left, bottom, right} = element.getBoundingClientRect();
            return {top, left, bottom, right};
        }, thirdElement);

        expect(rectThirdElement.left).toBe(placeRelativeToPreviousTouch);

        // Проверить корректность работы последнего ползунка
        currentValueToPreviousTouch = getCurrentValue(rectThirdElement.left, startPointSlider, coefficientPoint);
        placeRelativeToPreviousTouch = getPlaceRelativeToPreviousTouch(currentValueToPreviousTouch, distanceTouches, coefficientPoint, startPointSlider);

        await page.mouse.move(644, 54);
        await page.mouse.down();
        await page.waitFor(200);
        await page.mouse.move(550,  54, { steps: 2});
        await page.waitFor(200);
        await page.mouse.up();
        
        rectLastElement = await page.evaluate((element: HTMLDivElement) => {
            const {top, left, bottom, right} = element.getBoundingClientRect();
            return {top, left, bottom, right};
        }, lastElement);

        expect(rectLastElement.left).toBe(placeRelativeToPreviousTouch);

        await page.mouse.move(605, 54);
        await page.mouse.down();
        await page.waitFor(200);
        await page.mouse.move(800,  54, { steps: 2});
        await page.waitFor(200);
        await page.mouse.up();

        rectLastElement = await page.evaluate((element: HTMLDivElement) => {
            const {top, left, bottom, right} = element.getBoundingClientRect();
            return {top, left, bottom, right};
        }, lastElement);
        
        expect(rectLastElement.right).toBe(endPointSlider);
        // Проверить корректность изменений значений в тултипах

        await page.mouse.move(527, 54);
        await page.mouse.down();
        await page.waitFor(200);
        await page.mouse.move(490,  54, { steps: 2});
        await page.waitFor(200);
        await page.mouse.up();

        rectFirstElement = await page.evaluate((element: HTMLDivElement) => {
            const {top, left, bottom, right} = element.getBoundingClientRect();
            return {top, left, bottom, right};
        }, firstElement);

        let currentValueTooltip = String(calculateValue(rectFirstElement.left, startPointSlider));
        let tooltipsText = await page.$$('.slider-tooltip-text');
        let tooltipText = tooltipsText[0];
        //@ts-ignore
        let innerHTMLTooltip = await page.evaluateHandle(element => element.innerHTML, tooltipText);

        expect(await innerHTMLTooltip.jsonValue()).toBe(currentValueTooltip);

        await page.mouse.move(774, 54);
        await page.mouse.down();
        await page.waitFor(200);
        await page.mouse.move(700,  54, { steps: 2});
        await page.waitFor(200);
        await page.mouse.up();

        rectLastElement = await page.evaluate((element: HTMLDivElement) => {
            const {top, left, bottom, right} = element.getBoundingClientRect();
            return {top, left, bottom, right};
        }, lastElement);

        currentValueTooltip = String(calculateValue(rectLastElement.left, startPointSlider));
        tooltipsText = await page.$$('.slider-tooltip-text');
        tooltipText = tooltipsText[tooltipsText.length - 1];
        //@ts-ignore
        innerHTMLTooltip = await page.evaluateHandle(element => element.innerHTML, tooltipText);

        expect(await innerHTMLTooltip.jsonValue()).toBe(currentValueTooltip);
        //Здесь тесты для вертикальной вью
    });
});
describe('Интеграционные тесты для вертикального вида', () => {
    //@ts-ignore
    let browser: any;
    //@ts-ignore
    let page: any;

    beforeEach(async () => {
        const element: HTMLDivElement | null = window.document.querySelector('.js-slider-test');
        if(element !== null || element !== undefined) {
            element?.remove();
        }; 
        browser = await puppeteer.launch({ headless: false});
        page = await browser.newPage();
    });
    afterEach(async () => {
        await browser.close();
    });
    test('Checking the location of the sliders on the slider', async () => {
        await page.goto('http://localhost:1234');
        await page.waitFor(500);

        //Функция для нахождения коэффициента единичного значения слайдера в пикселях
        const getCoefficientPoint = (sliderLineLength: number, max: number, min: number) => {
           return sliderLineLength / (max - min);
        };
        //Функция для нахождения значения минимально возможной дистанции между ползунками
        const getDistanceTouches = (touchHeight: number, coefficientPoint: number) => {
            return Math.ceil(touchHeight / coefficientPoint);
        };
        const getCurrentValue = (offsetHeight: number, startSlider: number, coefficientPoint: number) => {
            return Math.floor((offsetHeight - startSlider) / coefficientPoint);
        };
        const getPlaceRelativeToPreviousTouch = (currentValue: number, distanceTouches: number, coefficientPoint: number, startSlider: number) => {
            return Math.ceil((currentValue + distanceTouches) * coefficientPoint + startSlider);
        };
        const getPlaceRelativeToNextTouch = (currentValue: number, distanceTouches: number, coefficientPoint: number, startSlider: number) => {
            return Math.ceil((currentValue - distanceTouches) * coefficientPoint + startSlider);
        };
        const calculateValue = (offsetHeight: number, startSlider: number) => {
            let currentValueX: number = Math.floor((offsetHeight - startSlider) / coefficientPoint) + state.min;
            let multi: number = Math.floor(currentValueX / state.step);
            currentValueX = state.step * multi;
            return currentValueX;
        };

        //Переключиться на вертикальный вид
        await page.mouse.click(213.5, 69);
        await page.waitFor(300);

        // Найти координаты линии слайдера
        const sliderLine: HTMLDivElement = await page.$('.slider-line-for-verticalView');
        const rectSliderLine = await page.evaluate((sliderLine: HTMLDivElement) => {
            const {top, left, bottom, right} = sliderLine.getBoundingClientRect();
            return {top, left, bottom, right};
        }, sliderLine);
        const sliderLineLength: number = rectSliderLine.bottom - rectSliderLine.top;
        
        //Найти первый ползунок и его ширину
        const touchElements: HTMLDivElement[] = await page.$$('.slider-touch');
        const firstElement: HTMLDivElement = touchElements[0];
        let rectFirstElement = await page.evaluate((element: HTMLDivElement) => {
            const {top, left, bottom, right} = element.getBoundingClientRect();
            return {top, left, bottom, right};
        }, firstElement);
        const elementHeight: number = rectFirstElement.bottom - rectFirstElement.top;
        
        //Найти координаты второго ползунка
        const secondElement: HTMLDivElement = touchElements[1];
        let rectSecondElement = await page.evaluate((element: HTMLDivElement) => {
            const {top, left, bottom, right} = element.getBoundingClientRect();
            return {top, left, bottom, right};
        }, secondElement);

        //Точки начала и конца линии слайдера
        const startPointSlider = rectSliderLine.top - (elementHeight/2);
        const endPointSlider = rectSliderLine.bottom - (elementHeight/2);

        //Определить значения и коэффициенты перед проверкой работы первого ползунка
        const coefficientPoint = getCoefficientPoint(sliderLineLength, state.max, state.min);
        const distanceTouches = getDistanceTouches(elementHeight, coefficientPoint);
        let currentValueToNextTouch = getCurrentValue(rectSecondElement.top, startPointSlider, coefficientPoint);
        //место относительно следующего ползунка на слайдере
        let placeRelativeToNextTouch = getPlaceRelativeToNextTouch(currentValueToNextTouch, distanceTouches, coefficientPoint, startPointSlider);

        // // Проверить корректность работы первого ползунка
        await page.mouse.move(448, 120);
        await page.mouse.down();
        await page.waitFor(200);
        await page.mouse.move(448,  30, { steps: 1});
        await page.waitFor(200);
        await page.mouse.up();

        rectFirstElement = await page.evaluate((element: HTMLDivElement) => {
            const {top, left, bottom, right} = element.getBoundingClientRect();
            return {top, left, bottom, right};
          }, firstElement);
        expect(rectFirstElement.top).toBe(startPointSlider);
        
        await page.mouse.move(448, 54);
        await page.mouse.down();
        await page.waitFor(200);
        await page.mouse.move(448,  170, { steps: 1});
        await page.waitFor(200);
        await  page.mouse.up();

        rectFirstElement = await page.evaluate((element: HTMLDivElement) => {
            const {top, left, bottom, right} = element.getBoundingClientRect();
            return {top, left, bottom, right};
          }, firstElement);
        expect(rectFirstElement.top).toBe(placeRelativeToNextTouch);

        // Проверить корректность работы одного из промежуточных ползунков, например, третьего
        //Найти координаты третьего ползунка
        const thirdElement: HTMLDivElement = touchElements[2];
        let rectThirdElement = await page.evaluate((element: HTMLDivElement) => {
            const {top, left, bottom, right} = element.getBoundingClientRect();
            return {top, left, bottom, right};
        }, thirdElement);

        // Найти координаты последнего ползунка
        const lastElement: HTMLDivElement = touchElements[touchElements.length - 1];
        let rectLastElement = await page.evaluate((element: HTMLDivElement) => {
            const {top, left, bottom, right} = element.getBoundingClientRect();
            return {top, left, bottom, right};
        }, lastElement);

        let currentValueToPreviousTouch = getCurrentValue(rectSecondElement.top, startPointSlider, coefficientPoint);
        let placeRelativeToPreviousTouch = getPlaceRelativeToPreviousTouch(currentValueToPreviousTouch, distanceTouches, coefficientPoint, startPointSlider);
        currentValueToNextTouch = getCurrentValue(rectLastElement.top, startPointSlider, coefficientPoint);
        placeRelativeToNextTouch = getPlaceRelativeToNextTouch(currentValueToNextTouch, distanceTouches, coefficientPoint, startPointSlider)

        await page.mouse.move(448, 198);
        await page.mouse.down();
        await page.waitFor(200);
        await page.mouse.move(448,  130, { steps: 1});
        await page.waitFor(200);
        await page.mouse.up();

        rectThirdElement = await page.evaluate((element: HTMLDivElement) => {
            const {top, left, bottom, right} = element.getBoundingClientRect();
            return {top, left, bottom, right};
        }, thirdElement);

        expect(rectThirdElement.top).toBe(placeRelativeToPreviousTouch);

        await page.mouse.move(448, 185);
        await page.mouse.down();
        await page.waitFor(200);
        await page.mouse.move(448,  270, { steps: 1});
        await page.waitFor(200);
        await page.mouse.up();

        rectThirdElement = await page.evaluate((element: HTMLDivElement) => {
            const {top, left, bottom, right} = element.getBoundingClientRect();
            return {top, left, bottom, right};
        }, thirdElement);

        expect(rectThirdElement.top).toBe(placeRelativeToNextTouch);

        // Проверить корректность работы последнего ползунка
        currentValueToPreviousTouch = getCurrentValue(rectThirdElement.top, startPointSlider, coefficientPoint);
        placeRelativeToPreviousTouch = getPlaceRelativeToPreviousTouch(currentValueToPreviousTouch, distanceTouches, coefficientPoint, startPointSlider);

        await page.mouse.move(488, 250);
        await page.mouse.down();
        await page.waitFor(200);
        await page.mouse.move(448,  420, { steps: 1});
        await page.waitFor(200);
        await page.mouse.up();
        
        rectLastElement = await page.evaluate((element: HTMLDivElement) => {
            const {top, left, bottom, right} = element.getBoundingClientRect();
            return {top, left, bottom, right};
        }, lastElement);

        expect(rectLastElement.top).toBe(endPointSlider);

        await page.mouse.move(448, 380);
        await page.mouse.down();
        await page.waitFor(200);
        await page.mouse.move(448,  200, { steps: 1});
        await page.waitFor(200);
        await page.mouse.up();

        rectLastElement = await page.evaluate((element: HTMLDivElement) => {
            const {top, left, bottom, right} = element.getBoundingClientRect();
            return {top, left, bottom, right};
        }, lastElement);
        
        expect(rectLastElement.top).toBe(placeRelativeToPreviousTouch);
    //     // Проверить корректность изменений значений в тултипах

        await page.mouse.move(448, 133);
        await page.mouse.down();
        await page.waitFor(200);
        await page.mouse.move(448,  100, { steps: 1});
        await page.waitFor(200);
        await page.mouse.up();

        rectFirstElement = await page.evaluate((element: HTMLDivElement) => {
            const {top, left, bottom, right} = element.getBoundingClientRect();
            return {top, left, bottom, right};
        }, firstElement);

        let currentValueTooltip = String(calculateValue(rectFirstElement.top, startPointSlider));
        let tooltipsText = await page.$$('.slider-tooltip-text-for-verticalView');
        let tooltipText = tooltipsText[0];
        //@ts-ignore
        let innerHTMLTooltip = await page.evaluateHandle(element => element.innerHTML, tooltipText);

        expect(await innerHTMLTooltip.jsonValue()).toBe(currentValueTooltip);

        await page.mouse.move(448, 250);
        await page.mouse.down();
        await page.waitFor(200);
        await page.mouse.move(448,  310, { steps: 1});
        await page.waitFor(200);
        await page.mouse.up();

        rectLastElement = await page.evaluate((element: HTMLDivElement) => {
            const {top, left, bottom, right} = element.getBoundingClientRect();
            return {top, left, bottom, right};
        }, lastElement);

        currentValueTooltip = String(calculateValue(rectLastElement.top, startPointSlider));
        tooltipsText = await page.$$('.slider-tooltip-text-for-verticalView');
        tooltipText = tooltipsText[tooltipsText.length - 1];
        //@ts-ignore
        innerHTMLTooltip = await page.evaluateHandle(element => element.innerHTML, tooltipText);

        expect(await innerHTMLTooltip.jsonValue()).toBe(currentValueTooltip);
    });
});
