import {Model} from '../slider/model';
import {IModelState} from '../slider/interfaces/iModelState';
import { EventEmitter } from '../slider/eventEmitter';

interface IData {
    currentValue: number
    index: number
}

let state: IModelState = {
    min: 0,
    max: 100,
    touchsValues: [20,40,60,80],
    orientation: 'horizontal',
    amount: 4,
    step: 2,
    tooltip: true,
};
describe('Model testing', () => {
    const eventEmitter = new EventEmitter();
    const model: Model = new Model(eventEmitter);
    eventEmitter.emit('model:state-changed', state);

    test('Set new value Min', () => {
        state.min = 10;
        model.setNewValueMin(state.min);
        expect(model.state.min).toBe(state.min);

        state.min = 10;
        model.setNewValueMin(state.min);
        expect(model.state.min).toBe(state.min);
    });
    test('Set new value Max', () => {
        state.max = 80;
        model.setNewValueMax(state.max);
        expect(model.state.max).toBe(state.max);

        state.max = 80;
        model.setNewValueMax(state.max);
        expect(model.state.max).toBe(state.max);
    });
    test('Set new value amount', () => {
        state.amount = 0;
        model.setNewValueAmount(state.amount);
        expect(model.state.amount).toBe(1);

        state.amount = 15;
        model.setNewValueAmount(state.amount);
        expect(model.state.amount).toBe(10);

        state.amount = 4;
        model.setNewValueAmount(state.amount);
        expect(model.state.amount).toBe(state.amount);

        state.amount = 4;
        model.setNewValueAmount(state.amount);
        expect(model.state.amount).toBe(state.amount);
    });
    test('Set new value TouchsValues', () => {
        state.touchsValues[1] = 36;
        model.setNewValueTouchsValues(state.touchsValues[1], 1);
        expect(model.state.touchsValues[1]).toBe(state.touchsValues[1]);

        state.touchsValues[3] = 80;
        model.setNewValueTouchsValues(state.touchsValues[3], 3);
        expect(model.state.touchsValues[3]).toBe(state.touchsValues[3]);
    });
    test('Set new value Step', () => {
        state.step = 0;
        model.setNewValueStep(state.step);
        expect(model.state.step).toBe(1);

        state.step = 2;
        model.setNewValueStep(state.step);
        expect(model.state.step).toBe(state.step);

        state.step = 2;
        model.setNewValueStep(state.step);
        expect(model.state.step).toBe(state.step);
    })
    test('set new value Tooltip', () => {
        state.tooltip = false;
        model.setNewValueTooltip(state.tooltip);
        expect(model.state.tooltip).toBe(false);

        state.tooltip = true;
        model.setNewValueTooltip(state.tooltip);
        expect(model.state.tooltip).toBe(true);
    });
    test('set new value Orientation', () => {
        state.orientation = 'vertical';
        model.setNewValueOrientation(state.orientation);
        expect(model.state.orientation).toBe('vertical');

        state.orientation = 'horizontal';
        model.setNewValueOrientation(state.orientation);
        expect(model.state.orientation).toBe('horizontal');
    });
    test('check touches values', () => {
        //Проверка значения первого ползунка при установки большего минимального значния
        // чем значение ползунка
        state.min = 25;
        model.setNewValueMin(state.min);
        expect(model.state.min).toBe(state.min);
        expect(model.state.touchsValues[0]).toBe(26);

        //Проверка значения последнего ползунка при установки меньшего максимального значения
        // чем значение ползунка
        state.max = 75;
        model.setNewValueMax(state.max);
        expect(model.state.max).toBe(state.max);
        expect(model.state.touchsValues[model.state.touchsValues.length - 1]).toBe(74);

        //Проверка изменения значений ползунков в зависимости от размера шага
        state.step = 3;
        model.setNewValueStep(state.step);
        expect(model.state.step).toBe(state.step);
        expect(model.state.touchsValues[0]).toBe(27);
        expect(model.state.touchsValues[1]).toBe(36);
        expect(model.state.touchsValues[model.state.touchsValues.length - 1]).toBe(72);

        state.step = 5;
        model.setNewValueStep(state.step);
        expect(model.state.step).toBe(state.step);
        expect(model.state.touchsValues[0]).toBe(25);
        expect(model.state.touchsValues[1]).toBe(35);
        expect(model.state.touchsValues[model.state.touchsValues.length - 1]).toBe(70);

        //проверка значений ползунков на перекрытие друг друга
        state.touchsValues[0] = 38;
        model.setNewValueTouchsValues(state.touchsValues[0], 0);
        expect(model.state.touchsValues[0]).toBe(35);
        expect(model.state.touchsValues[1]).toBe(40);

        state.touchsValues[1] = 67;
        model.setNewValueTouchsValues(state.touchsValues[1], 1);
        expect(model.state.touchsValues[1]).toBe(65);
        expect(model.state.touchsValues[2]).toBe(70);

        state.touchsValues[1] = 30;
        model.setNewValueTouchsValues(state.touchsValues[1], 1);
        expect(model.state.touchsValues[0]).toBe(35);
        expect(model.state.touchsValues[1]).toBe(40);

    });
    test('Проверить подписку на событие "view:amountTouches-changed"', () => {
        eventEmitter.emit('view:amountTouches-changed', state.touchsValues);
        expect(model.state.touchsValues).toBe(state.touchsValues);
    });
    test('Проверить подписку на событие "view:touchsValues-changed"', () => {
        const data: IData = {
            currentValue: 45,
            index: 1
        }
        eventEmitter.emit('view:touchsValues-changed', data);
        expect(model.state.touchsValues[1]).toBe(data.currentValue);
    });
})
