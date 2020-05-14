import { EventEmitter } from '../../slider/eventEmitter';
import {IModelState} from '../../slider/iModelState';
import { View } from '../../slider/view/view';
import {Sliders} from '../../slider/view/sliders';

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
    const sliders = new Sliders(element, eventEmitter);
    
    test('Проверка корректного создания элементов', () => {
        emitter.emit('model:state-changed', state);

        const touchElements = window.document.querySelectorAll('.slider-touch');
        const sliderSpans = window.document.querySelectorAll('.slider-span');
    
        expect(touchElements.length).toBe(state.amount);
        expect(sliderSpans.length).toBe(state.amount);
    });
    test('Проверить наличие родителей у созданных элементов', () => {
        const parentTouchElements = window.document.querySelectorAll('.slider-touch')[0].parentNode;
        const parentSliderSpans = window.document.querySelectorAll('.slider-span')[0].parentNode;
    
        //@ts-ignore
        expect(parentTouchElements.className).toContain('js-slider-test');
        //@ts-ignore
        expect(parentSliderSpans.className).toBe('slider-touch');
    });
    test('Проверить изменение количества созданных элементов при изменении количества бегунков в большую сторону', () => {
        state.amount = 5;
        emitter.emit('model:state-changed', state);
    
        const touchElements = window.document.querySelectorAll('.slider-touch');
        const sliderSpans = window.document.querySelectorAll('.slider-span');
    
        expect(touchElements.length).toBe(state.amount);
        expect(sliderSpans.length).toBe(state.amount);
    
        //Проверить значение добавленного ползунка
        expect(state.touchsValues.length).toBe(5);
        expect(state.touchsValues[4]).toBe(52);
    });
    test('Проверить удаление ползунков', () => {
        state.amount = 3;
        emitter.emit('model:state-changed', state);
    
        const touchElements = window.document.querySelectorAll('.slider-touch');
        const sliderSpans = window.document.querySelectorAll('.slider-span');
    
        expect(touchElements.length).toBe(state.amount);
        expect(sliderSpans.length).toBe(state.amount);
        expect(state.touchsValues.length).toBe(3);
    });
    test('Проверить корректность рассчета текущего значения ползунка', () => {
        sliders.state.coefficientPoint = 3.5;
        let currentValue: number = sliders.calculateValue(state, 345);
        expect(currentValue).toBe(98);
    })
});