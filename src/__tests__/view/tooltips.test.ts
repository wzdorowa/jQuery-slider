//import {Scale} from '../../slider/view/scale';
//import {Sliders} from '../../slider/view/sliders';
//import { Tooltips } from '../../slider/view/tooltips';
import { EventEmitter } from '../../slider/eventEmitter';
import {IModelState} from '../../slider/iModelState';
//import {configuratorHorizontal} from '../../slider/configuratorHorizontal';
import { View } from '../../slider/view/view';
//import {configuratorVertical} from '../../slider/configuratorVertical';


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
    //@ts-ignore
    const view = new View(element, eventEmitter);
    // const tooltips = new Tooltips(element, eventEmitter);
    // const sliders = new Sliders(element, eventEmitter);
    //const scale = new Scale(element);

    test('Проверка корректности создания тултипов', () => {
        // sliders.createSliders(state.amount);
        // tooltips.createTooltips(state.amount, sliders.state.sliders, configuratorHorizontal);
        eventEmitter.emit('model:state-changed', state);

        const tooltipsElements = window.document.querySelectorAll('.slider-tooltip');
        const textInTooltipsElements = window.document.querySelectorAll('.slider-tooltip-text');
        const slidersElements = window.document.querySelectorAll('.slider-touch');

        expect(tooltipsElements.length).toBe(state.amount);
        tooltipsElements.forEach((element) => {
            expect(element.className).toBe('slider-tooltip');
        });
        expect(textInTooltipsElements.length).toBe(state.amount);
        textInTooltipsElements.forEach((element) => {
            expect(element.className).toBe('slider-tooltip-text');
        });
        tooltipsElements.forEach((element, i: number) => {
            expect(element.childNodes).toContain(textInTooltipsElements[i]);
        });
        slidersElements.forEach((element, i: number) => {
            expect(element.childNodes).toContain(tooltipsElements[i]);
        });
    });
    test('Проверка установки значений ползунков по-умолчанию в соответствующие им тултипы ', () => {
        const textInTooltipsElements = window.document.querySelectorAll('.slider-tooltip-text');
        state.touchsValues.forEach((element: number, i: number) => {
            expect(String(element)).toBe(textInTooltipsElements[i].innerHTML);
        });
    });
    test('Проверка изменения количества отрисованных тултипов при изменении количества ползунков', () => {
        state.amount = 6;
        eventEmitter.emit('model:state-changed', state);

        let tooltipsElements = window.document.querySelectorAll('.slider-tooltip');
        //let textInTooltipsElements = window.document.querySelectorAll('.slider-tooltip-text');
        //let slidersElements = window.document.querySelectorAll('.slider-touch');

        expect(tooltipsElements.length).toBe(state.amount);
        // expect(textInTooltipsElements.length).toBe(state.amount);
        // tooltipsElements.forEach((element, i: number) => {
        //     expect(element.childNodes).toContain(textInTooltipsElements[i]);
        // });
        // slidersElements.forEach((element, i: number) => {
        //     expect(String(element.childNodes[1])).toBe(String(tooltipsElements[i]));
        // });

        // state.amount = 4;
        // eventEmitter.emit('model:state-changed', state);

        // tooltipsElements = window.document.querySelectorAll('.slider-tooltip');
        // textInTooltipsElements = window.document.querySelectorAll('.slider-tooltip-text');
        // slidersElements = window.document.querySelectorAll('.slider-touch');

        // expect(tooltipsElements.length).toBe(state.amount);
        // expect(textInTooltipsElements.length).toBe(state.amount);
        // tooltipsElements.forEach((element, i: number) => {
        //     expect(element.childNodes).toContain(textInTooltipsElements[i]);
        // });
        // slidersElements.forEach((element, i: number) => {
        //     expect(element.childNodes).toContain(tooltipsElements[i]);
        // });
    });
})