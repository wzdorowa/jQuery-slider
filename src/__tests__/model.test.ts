import {Model} from '../slider/model';
import {IModelState} from '../slider/iModelState';
import { EventEmitter } from '../slider/eventEmitter';

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
        state.min = 25;
        model.setNewValueMin(state.min);
        expect(model.state.min).toBe(state.min);
    });
    test('Set new value Max', () => {
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

        state.amount = 5;
        model.setNewValueAmount(state.amount);
        expect(model.state.amount).toBe(state.amount);
    });
    test('Set new value TouchsValues', () => {
        state.touchsValues[1] = 36;
        model.setNewValueTouchsValues(state.touchsValues[1], 1);
        expect(model.state.touchsValues[1]).toBe(state.touchsValues[1]);

        state.touchsValues[3] = 72;
        model.setNewValueTouchsValues(state.touchsValues[3], 3);
        expect(model.state.touchsValues[3]).toBe(state.touchsValues[3]);
    });
    test('Set new value Step', () => {
        state.step = 0;
        model.setNewValueStep(state.step);
        expect(model.state.step).toBe(1);

        state.step = 4;
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
    })
})
