import {configuratorHorizontal} from '../../slider/view/configurators/configuratorHorizontal';
import { EventEmitter } from '../../slider/eventEmitter';
import {IModelState} from '../../slider/interfaces/iModelState';
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
    });
    test('Проверка рассчета значения места бегунка на шкале', () => {
        sliders.state.coefficientPoint = 3.2;
        sliders.state.currentXorY = 273;
        sliders.state.shiftToMinValue = 0;
        sliders.calculateValueOfPlaceOnScale(state, 3);
        expect(sliders.state.currentValue).toBe(86);
    });
    test('Проверка установки ближайшего ползунка на место клика по шкале слайдера', () => {
        var sinon = require('sinon');

        const configurator = configuratorHorizontal;
        const activeRange: HTMLElement = configurator.createSliderLineSpan();
        const scale: HTMLElement = configurator.createSliderLine();

        let event = new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
            clientX: 100,
            clientY: 100
          });
        
        sinon.stub(configuratorHorizontal, 'calculateCoefficientPoint').callsFake( function () { return 2; });
        sinon.stub(configuratorHorizontal, 'getOffsetFromClick').callsFake( function () { return 100; });
        sinon.stub(configuratorHorizontal, 'calculateCurrentClickLocation').callsFake( function () { return 130; });

        scale.dispatchEvent(event);
        let currentValues = sliders.setSliderTouchToNewPosition.apply(sliders, [event, state, configurator]);
        expect(currentValues[0]).toBe(30);
        expect(currentValues[1]).toBe(1);

        activeRange.dispatchEvent(event);
        currentValues = sliders.setSliderTouchToNewPosition.apply(sliders, [event, state, configurator]);
        expect(currentValues[0]).toBe(40);
        expect(currentValues[1]).toBe(2);

        sinon.reset();

    });
    test('Тест вызова onStart', () => {
        var sinon = require('sinon');

        sliders.configurator = configuratorHorizontal;
        const activeRange: HTMLElement = sliders.configurator.createSliderLineSpan();
        const scale: HTMLElement = sliders.configurator.createSliderLine();
        const i: number = 0;
        const setCurrentTooltipValue = () => {
            return
        };
        let event = new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
            clientX: 100,
            clientY: 100
          });

        sinon.stub(configuratorHorizontal, 'setCurrentXorYtoOnStart').callsFake( function () { return 90; });
        sinon.stub(configuratorHorizontal, 'setStartXorYtoOnStart').callsFake( function () { return 50; });
        sinon.stub(configuratorHorizontal, 'setMaxXorYtoOnStart').callsFake( function () { return 300; });

        sliders.onStart(state, event, i, scale, activeRange, setCurrentTooltipValue);
        expect(sliders.state.currentValue).toBe(state.touchsValues[i]);

        sinon.reset();
    });
    test('Проверка onMove для первого ползунка', () => {
        var sinon = require('sinon');

        sliders.configurator = configuratorHorizontal;
        const activeRange: HTMLElement = sliders.configurator.createSliderLineSpan();
        let elements: HTMLElement[] = sliders.state.sliders;
        
        const setCurrentTooltipValue = () => {
            return
        };
        let event = new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
            clientX: 100,
            clientY: 100
        });
        
        const setCurrentXorYtoOnMove = sinon.stub(configuratorHorizontal, 'setCurrentXorYtoOnMove');
        setCurrentXorYtoOnMove.onCall(0).returns(290);
        setCurrentXorYtoOnMove.onCall(1).returns(290);
        setCurrentXorYtoOnMove.onCall(2).returns(10);
        const elementOffset = sinon.stub(configuratorHorizontal, 'elementOffset').callsFake(function () { return 290; });
        const targetOffset = sinon.stub(configuratorHorizontal, 'targetOffset').callsFake(function () { return 24; });
        const setIndentForTarget = sinon.stub(configuratorHorizontal, 'setIndentForTarget').callsFake(function () { return });
        const updateLineSpan = sinon.stub(configuratorHorizontal, 'updateLineSpan').callsFake(function () { return });

        const i: number = 0;
        const target: HTMLElement = elements[i];

        //Если ползунок на шкале один
        sliders.state.maxXorY = 280;
        sliders.state.sliders.length = 1;

        sliders.onMove(state, event, i, target, activeRange, setCurrentTooltipValue);
        expect(sliders.state.currentXorY).toBe(sliders.state.maxXorY);
        sliders.state.maxXorY = 350;

        //Проверка первого ползунка, если ползунков на шкале много
        sliders.state.sliders.length = 4;

        sliders.onMove(state, event, i, target, activeRange, setCurrentTooltipValue);
        expect(sliders.state.currentXorY).toBe(266);
    
        //Если значение первого ползунка становиться меньше минимально возможного значения
        state.min = 20;

        sliders.onMove(state, event, i, target, activeRange, setCurrentTooltipValue);
        expect(sliders.state.currentXorY).toBe(state.min);

        //сбросить заглушки
        setCurrentXorYtoOnMove.restore();
        elementOffset.restore();
        targetOffset.restore();
        setIndentForTarget.restore();
        updateLineSpan.restore();
    });
    test('Проверка onMove для любого ползунка кроме первого и последнего', () => {
        var sinon = require('sinon');

        sliders.configurator = configuratorHorizontal;
        const activeRange: HTMLElement = sliders.configurator.createSliderLineSpan();
        let elements: HTMLElement[] = sliders.state.sliders;
        
        const setCurrentTooltipValue = () => {
            return
        };
        let event = new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
            clientX: 100,
            clientY: 100
        });

        const setCurrentXorYtoOnMove = sinon.stub(configuratorHorizontal, 'setCurrentXorYtoOnMove');
        setCurrentXorYtoOnMove.onCall(0).returns(290);
        setCurrentXorYtoOnMove.onCall(1).returns(250);

        const elementOffset = sinon.stub(configuratorHorizontal, 'elementOffset').callsFake(function () { return 290; });
        elementOffset.onCall(0).returns(290);
        elementOffset.onCall(1).returns(250);
        elementOffset.onCall(2).returns(350);
        elementOffset.onCall(3).returns(250);

        const targetOffset = sinon.stub(configuratorHorizontal, 'targetOffset').callsFake(function () { return 24; });
        const setIndentForTarget = sinon.stub(configuratorHorizontal, 'setIndentForTarget').callsFake(function () { return });
        const updateLineSpan = sinon.stub(configuratorHorizontal, 'updateLineSpan').callsFake(function () { return });

        const i: number = 1;
        const target: HTMLElement = elements[i];

        //Если значение любого кроме первого и последнего ползунка превышает значение следующего за ним ползунка
        sliders.onMove(state, event, i, target, activeRange, setCurrentTooltipValue);
        expect(sliders.state.currentXorY).toBe(266);

        //Если значение любого кроме первого и последнего ползунка меньше значения предыдущего ползунка
        sliders.onMove(state, event, i, target, activeRange, setCurrentTooltipValue);
        expect(sliders.state.currentXorY).toBe(274);

        //сбросить заглушки
        setCurrentXorYtoOnMove.restore();
        elementOffset.restore();
        targetOffset.restore();
        setIndentForTarget.restore();
        updateLineSpan.restore();
    });
    test('Проверка onMove для последнего ползунка', () => {
        var sinon = require('sinon');

        sliders.configurator = configuratorHorizontal;
        const activeRange: HTMLElement = sliders.configurator.createSliderLineSpan();
        let elements: HTMLElement[] = sliders.state.sliders;
        
        const setCurrentTooltipValue = () => {
            return
        };
        let event = new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
            clientX: 100,
            clientY: 100
        });

        const i: number = 3;
        const target: HTMLElement = elements[i];

        const setCurrentXorYtoOnMove = sinon.stub(configuratorHorizontal, 'setCurrentXorYtoOnMove');
        setCurrentXorYtoOnMove.onCall(0).returns(290);
        setCurrentXorYtoOnMove.onCall(1).returns(350);

        const elementOffset = sinon.stub(configuratorHorizontal, 'elementOffset').callsFake(function () { return 290; });
        const targetOffset = sinon.stub(configuratorHorizontal, 'targetOffset').callsFake(function () { return 24; });
        const setIndentForTarget = sinon.stub(configuratorHorizontal, 'setIndentForTarget').callsFake(function () { return });
        const updateLineSpan = sinon.stub(configuratorHorizontal, 'updateLineSpan').callsFake(function () { return });

        //Если значение ползунка меньше значения предыдущего ползунка
        sliders.onMove(state, event, i, target, activeRange, setCurrentTooltipValue);
        expect(sliders.state.currentXorY).toBe(314);

        sliders.state.maxXorY = 280;
        //Если значение ползунка больше максимально допустимого значения предыдущего ползунка
        sliders.onMove(state, event, i, target, activeRange, setCurrentTooltipValue);
        expect(sliders.state.currentXorY).toBe(sliders.state.maxXorY);

        //сбросить заглушки
        setCurrentXorYtoOnMove.restore();
        elementOffset.restore();
        targetOffset.restore();
        setIndentForTarget.restore();
        updateLineSpan.restore();
    });
    test('Проверка onStop', () => {
        var sinon = require('sinon');

        sliders.configurator = configuratorHorizontal;
        const activeRange: HTMLElement = sliders.configurator.createSliderLineSpan();
        let elements: HTMLElement[] = sliders.state.sliders;
        
        const setCurrentTooltipValue = () => {
            return
        };
        let event = new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
            clientX: 100,
            clientY: 100
        });
        const i: number = 1;
        const target: HTMLElement = elements[i];

        sinon.stub(configuratorHorizontal, 'setIndentForTargetToOnStop').callsFake(function () { return; });

        const handleMove = (event: MouseEvent) => sliders.onMove(state, event, i, target, activeRange, setCurrentTooltipValue);
        const handleStop = (event: MouseEvent) => sliders.onStop(handleMove, handleStop, event, i, target, state, setCurrentTooltipValue);

        sliders.onStop(handleMove, handleStop, event, i, target, state, setCurrentTooltipValue);
        expect(sliders.state.currentValue).toBe(null);
        expect(sliders.state.currentSliderIndex).toBe(null);
    })
});