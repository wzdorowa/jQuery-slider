import {IModelState} from '../../slider/iModelState';
import puppeteer from 'puppeteer';

interface IRectNextSlider {
    top: number,
    left: number,
    bottom: number,
    right: number
};
let state: IModelState = {
    min: 0,
    max: 100,
    touchsValues: [20,30,40,50],
    orientation: 'horizontal',
    amount: 4,
    step: 2,
    tooltip: true,
};
describe('Интеграционные тесты для горизонтального вида', () => {
    let browser: any;
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
        await page.waitFor(300);

        //Функция для нахождения коэффициента единичного значения слайдера в пикселях
        const getCoefficientPoint = (sliderLineLength: number, max: number, min: number) => {
            return sliderLineLength / (max - min);
         };
         const getOffsetNextSlider = (rectNextSlider: IRectNextSlider, widthNextSlider: number, startPointSlider: number): number => {
             return Math.ceil(rectNextSlider.left - widthNextSlider - startPointSlider);
         };
         const getOffsetPreviousSlider = (rectPreviousSlider: IRectNextSlider, widthNextSlider: number, startPointSlider: number): number => {
             return Math.ceil(rectPreviousSlider.left + widthNextSlider - startPointSlider);
         };
         /* метод рассчитывает текущее значение ползунка */
         const calculateValue = (modelState: IModelState, currentXorY: number, coefficientPoint: number) => {
             let currentValueX: number = Math.floor(currentXorY / coefficientPoint) + modelState.min;
             let multi: number = Math.floor(currentValueX / modelState.step);
             return currentValueX = modelState.step * multi;
         }
         /* метод рассчитывает значение места бегунка на шкале */
         const calculateValueOfPlaceOnScale = (modelState: IModelState, offsetSlider: number, sliderLineLength: number, max: number, min: number, startPointSlider: number) => {
             let coefficientPoint = getCoefficientPoint(sliderLineLength, max, min);
             let shiftToMinValue = Math.ceil(coefficientPoint * modelState.min);
             let currentValue: number = calculateValue(modelState, offsetSlider, coefficientPoint);
             const halfStep = Math.floor((currentValue + (modelState.step / 2)) * coefficientPoint) - shiftToMinValue;
 
             if (offsetSlider > halfStep) {
                 currentValue = currentValue + modelState.step;
             }
             return Math.ceil((currentValue * coefficientPoint) + startPointSlider);
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
        let offsetNextSlider: number = getOffsetNextSlider(rectSecondElement, elementWidth, startPointSlider);
        let currentValue: number = calculateValueOfPlaceOnScale(state, offsetNextSlider, sliderLineWidth, state.max, state.min, startPointSlider);
        
        // Проверить корректность работы первого ползунка
        await page.mouse.move(rectFirstElement.left, rectFirstElement.top);
        await page.mouse.down();
        await page.waitFor(200);
        await page.mouse.move(rectFirstElement.left - 200,  rectFirstElement.top, { steps: 2});
        await page.waitFor(200);
        await page.mouse.up();

        rectFirstElement = await page.evaluate((element: HTMLDivElement) => {
            const {top, left, bottom, right} = element.getBoundingClientRect();
            return {top, left, bottom, right};
          }, firstElement);
        expect(rectFirstElement.left).toBe(startPointSlider);
        
        await page.mouse.move(rectFirstElement.left, rectFirstElement.top);
        await page.mouse.down();
        await page.waitFor(200);
        await page.mouse.move(rectFirstElement.left + 250,  rectFirstElement.top, { steps: 2});
        await page.waitFor(200);
        await  page.mouse.up();

        rectFirstElement = await page.evaluate((element: HTMLDivElement) => {
            const {top, left, bottom, right} = element.getBoundingClientRect();
            return {top, left, bottom, right};
          }, firstElement);
        expect(rectFirstElement.left).toBe(currentValue);

        //Проверить корректность перемещения ползунка при клике по шкале
        await page.waitFor(200);
        await page.mouse.click(rectSliderLine.left + 30, rectSliderLine.top);
        await page.waitFor(200);

        rectFirstElement = await page.evaluate((element: HTMLDivElement) => {
            const {top, left, bottom, right} = element.getBoundingClientRect();
            return {top, left, bottom, right};
          }, firstElement);

        offsetNextSlider = Math.ceil((rectSliderLine.left + 30) - elementWidth/2 - startPointSlider);
        currentValue = calculateValueOfPlaceOnScale(state, offsetNextSlider, sliderLineWidth, state.max, state.min, startPointSlider);
        expect(rectFirstElement.left).toBe(currentValue);

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

        let offsetPreviousSlider = getOffsetPreviousSlider(rectSecondElement, elementWidth, startPointSlider);
        offsetNextSlider = getOffsetNextSlider(rectLastElement, elementWidth, startPointSlider);
        currentValue = calculateValueOfPlaceOnScale(state, offsetNextSlider, sliderLineWidth, state.max, state.min, startPointSlider);

        await page.mouse.move(rectThirdElement.left, rectThirdElement.top);
        await page.mouse.down();
        await page.waitFor(200);
        await page.mouse.move(rectThirdElement.left + 80,  rectThirdElement.top, { steps: 2});
        await page.waitFor(200);
        await page.mouse.up();

        rectThirdElement = await page.evaluate((element: HTMLDivElement) => {
            const {top, left, bottom, right} = element.getBoundingClientRect();
            return {top, left, bottom, right};
        }, thirdElement);

        expect(rectThirdElement.left).toBe(currentValue);
        currentValue = calculateValueOfPlaceOnScale(state, offsetPreviousSlider, sliderLineWidth, state.max, state.min, startPointSlider);

        await page.mouse.move(rectThirdElement.left, rectThirdElement.top);
        await page.mouse.down();
        await page.waitFor(200);
        await page.mouse.move(rectThirdElement.left - 90,  rectThirdElement.top, { steps: 2});
        await page.waitFor(200);
        await page.mouse.up();

        rectThirdElement = await page.evaluate((element: HTMLDivElement) => {
            const {top, left, bottom, right} = element.getBoundingClientRect();
            return {top, left, bottom, right};
        }, thirdElement);

        expect(rectThirdElement.left).toBe(currentValue);

        // Проверить корректность работы последнего ползунка
        offsetPreviousSlider = getOffsetPreviousSlider(rectThirdElement, elementWidth, startPointSlider);
        currentValue = calculateValueOfPlaceOnScale(state, offsetPreviousSlider, sliderLineWidth, state.max, state.min, startPointSlider);

        await page.mouse.move(rectLastElement.left, rectLastElement.top);
        await page.mouse.down();
        await page.waitFor(200);
        await page.mouse.move(rectLastElement.left - 90,  rectLastElement.top, { steps: 2});
        await page.waitFor(200);
        await page.mouse.up();
        
        rectLastElement = await page.evaluate((element: HTMLDivElement) => {
            const {top, left, bottom, right} = element.getBoundingClientRect();
            return {top, left, bottom, right};
        }, lastElement);

        expect(rectLastElement.left).toBe(currentValue);

        await page.mouse.move(rectLastElement.left, rectLastElement.top);
        await page.mouse.down();
        await page.waitFor(200);
        await page.mouse.move(rectLastElement.left + 195,  rectLastElement.top, { steps: 2});
        await page.waitFor(200);
        await page.mouse.up();

        rectLastElement = await page.evaluate((element: HTMLDivElement) => {
            const {top, left, bottom, right} = element.getBoundingClientRect();
            return {top, left, bottom, right};
        }, lastElement);
        
        expect(rectLastElement.right).toBe(endPointSlider);

        //Проверить корректность перемещения ползунка при клике по шкале
        await page.waitFor(200);
        await page.mouse.click(endPointSlider - 50, rectSliderLine.top);
        await page.waitFor(200);

        rectLastElement = await page.evaluate((element: HTMLDivElement) => {
            const {top, left, bottom, right} = element.getBoundingClientRect();
            return {top, left, bottom, right};
        }, lastElement);

        offsetNextSlider = Math.ceil((endPointSlider - 50) - elementWidth/2 - startPointSlider);
        currentValue = calculateValueOfPlaceOnScale(state, offsetNextSlider, sliderLineWidth, state.max, state.min, startPointSlider);
        expect(rectLastElement.left).toBe(currentValue);
    });
});
describe('Интеграционные тесты для вертикального вида', () => {
    let browser: any;
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
        //@ts-ignore
        await browser.close();
    });
    test('Checking the location of the sliders on the slider', async () => {
        await page.goto('http://localhost:1234');
        await page.waitFor(300);

        const getCoefficientPoint = (sliderLineLength: number, max: number, min: number) => {
           return sliderLineLength / (max - min);
        };
        const getOffsetNextSlider = (rectNextSlider: IRectNextSlider, widthNextSlider: number, startPointSlider: number): number => {
            return Math.ceil(rectNextSlider.top - widthNextSlider - startPointSlider);
        };
        const getOffsetPreviousSlider = (rectPreviousSlider: IRectNextSlider, widthNextSlider: number, startPointSlider: number): number => {
            return Math.ceil(rectPreviousSlider.top + widthNextSlider - startPointSlider);
        };
        /* метод рассчитывает текущее значение ползунка */
        const calculateValue = (modelState: IModelState, currentXorY: number, coefficientPoint: number) => {
            let currentValueX: number = Math.floor(currentXorY / coefficientPoint) + modelState.min;
            let multi: number = Math.floor(currentValueX / modelState.step);
            return currentValueX = modelState.step * multi;
        }
        /* метод рассчитывает значение места бегунка на шкале */
        const calculateValueOfPlaceOnScale = (modelState: IModelState, offsetSlider: number, sliderLineLength: number, max: number, min: number, startPointSlider: number) => {
            let coefficientPoint = getCoefficientPoint(sliderLineLength, max, min);
            let shiftToMinValue = Math.ceil(coefficientPoint * modelState.min);
            let currentValue: number = calculateValue(modelState, offsetSlider, coefficientPoint);
            const halfStep = Math.floor((currentValue + (modelState.step / 2)) * coefficientPoint) - shiftToMinValue;

            if (offsetSlider > halfStep) {
                currentValue = currentValue + modelState.step;
            }
            return Math.ceil((currentValue * coefficientPoint) + startPointSlider);
        }

        //Переключиться на вертикальный вид
        await page.mouse.click(213.5, 69);
        await page.waitFor(500);

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
        let rectSecondElement: IRectNextSlider = await page.evaluate((element: HTMLDivElement): IRectNextSlider => {
            const {top, left, bottom, right} = element.getBoundingClientRect();
            return {top, left, bottom, right};
        }, secondElement);

        //Точки начала и конца линии слайдера
        const startPointSlider = rectSliderLine.top - (elementHeight/2);
        const endPointSlider = rectSliderLine.bottom - (elementHeight/2);

        //Определить значения и коэффициенты перед проверкой работы первого ползунка
        let offsetNextSlider: number = getOffsetNextSlider(rectSecondElement, elementHeight, startPointSlider);
        let currentValue = calculateValueOfPlaceOnScale(state, offsetNextSlider, sliderLineLength, state.max, state.min, startPointSlider);
        
        // Проверить корректность работы первого ползунка
        await page.mouse.move(rectFirstElement.left, rectFirstElement.top);
        await page.mouse.down();
        await page.waitFor(200);
        await page.mouse.move(rectFirstElement.left,  rectFirstElement.top - 190, { steps: 1});
        await page.waitFor(200);
        await page.mouse.up();

        rectFirstElement = await page.evaluate((element: HTMLDivElement) => {
            const {top, left, bottom, right} = element.getBoundingClientRect();
            return {top, left, bottom, right};
          }, firstElement);
        expect(rectFirstElement.top).toBe(startPointSlider);
        
        await page.mouse.move(rectFirstElement.left, rectFirstElement.top);
        await page.mouse.down();
        await page.waitFor(200);
        await page.mouse.move(rectFirstElement.left,  rectFirstElement.top + 140, { steps: 1});
        await page.waitFor(200);
        await  page.mouse.up();

        rectFirstElement = await page.evaluate((element: HTMLDivElement) => {
            const {top, left, bottom, right} = element.getBoundingClientRect();
            return {top, left, bottom, right};
          }, firstElement);
        expect(rectFirstElement.top).toBe(currentValue);

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

        let offsetPreviousSlider = getOffsetPreviousSlider(rectSecondElement, elementHeight, startPointSlider);
        offsetNextSlider = getOffsetNextSlider(rectLastElement, elementHeight, startPointSlider);
        currentValue = calculateValueOfPlaceOnScale(state, offsetPreviousSlider, sliderLineLength, state.max, state.min, startPointSlider);
    
        await page.mouse.move(rectThirdElement.left, rectThirdElement.top);
        await page.mouse.down();
        await page.waitFor(200);
        await page.mouse.move(rectThirdElement.left,  rectThirdElement.top - 70, { steps: 1});
        await page.waitFor(200);
        await page.mouse.up();

        rectThirdElement = await page.evaluate((element: HTMLDivElement) => {
            const {top, left, bottom, right} = element.getBoundingClientRect();
            return {top, left, bottom, right};
        }, thirdElement);

        expect(rectThirdElement.top).toBe(currentValue);
        currentValue = calculateValueOfPlaceOnScale(state, offsetNextSlider, sliderLineLength, state.max, state.min, startPointSlider);

        await page.mouse.move(rectThirdElement.left, rectThirdElement.top);
        await page.mouse.down();
        await page.waitFor(200);
        await page.mouse.move(rectThirdElement.left,  rectThirdElement.top + 85, { steps: 1});
        await page.waitFor(200);
        await page.mouse.up();

        rectThirdElement = await page.evaluate((element: HTMLDivElement) => {
            const {top, left, bottom, right} = element.getBoundingClientRect();
            return {top, left, bottom, right};
        }, thirdElement);

        expect(rectThirdElement.top).toBe(currentValue);

        // Проверить корректность работы последнего ползунка
        offsetPreviousSlider = getOffsetPreviousSlider(rectThirdElement, elementHeight, startPointSlider);
        currentValue = calculateValueOfPlaceOnScale(state, offsetPreviousSlider, sliderLineLength, state.max, state.min, startPointSlider);

        await page.mouse.move(rectLastElement.left, rectLastElement.top);
        await page.mouse.down();
        await page.waitFor(200);
        await page.mouse.move(rectLastElement.left,  rectLastElement.top + 190, { steps: 1});
        await page.waitFor(200);
        await page.mouse.up();
        
        rectLastElement = await page.evaluate((element: HTMLDivElement) => {
            const {top, left, bottom, right} = element.getBoundingClientRect();
            return {top, left, bottom, right};
        }, lastElement);

        expect(rectLastElement.top).toBe(endPointSlider);

        await page.mouse.move(rectLastElement.left, rectLastElement.top);
        await page.mouse.down();
        await page.waitFor(200);
        await page.mouse.move(rectLastElement.left,  rectLastElement.top - 200, { steps: 1});
        await page.waitFor(200);
        await page.mouse.up();

        rectLastElement = await page.evaluate((element: HTMLDivElement) => {
            const {top, left, bottom, right} = element.getBoundingClientRect();
            return {top, left, bottom, right};
        }, lastElement);
        
        expect(rectLastElement.top).toBe(currentValue);
     });
});