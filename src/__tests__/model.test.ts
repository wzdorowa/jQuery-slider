import Model from '../slider/model';
import { IModelState } from '../slider/interfaces/iModelState';
import EventEmitter from '../slider/eventEmitter';

const state: IModelState = {
  min: 0,
  max: 100,
  thumbsValues: [20, 40, 60, 80],
  orientation: 'horizontal',
  amount: 4,
  step: 2,
  isTooltip: true,
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
  test('Set new value ThumbsValues', () => {
    state.thumbsValues[1] = 36;
    model.setNewValueThumbsValues(state.thumbsValues[1], 1);
    expect(model.state.thumbsValues[1]).toBe(state.thumbsValues[1]);

    state.thumbsValues[3] = 80;
    model.setNewValueThumbsValues(state.thumbsValues[3], 3);
    expect(model.state.thumbsValues[3]).toBe(state.thumbsValues[3]);
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
  });
  test('set new value Tooltip', () => {
    state.isTooltip = false;
    model.setNewValueTooltip(state.isTooltip);
    expect(model.state.isTooltip).toBe(false);

    state.isTooltip = true;
    model.setNewValueTooltip(state.isTooltip);
    expect(model.state.isTooltip).toBe(true);
  });
  test('set new value Orientation', () => {
    state.orientation = 'vertical';
    model.setNewValueOrientation(state.orientation);
    expect(model.state.orientation).toBe('vertical');

    state.orientation = 'horizontal';
    model.setNewValueOrientation(state.orientation);
    expect(model.state.orientation).toBe('horizontal');
  });
  test('check thumbs values', () => {
    // Checking the value of the first thumb when setting a
    // larger minimum value than the value of the thumb
    state.min = 25;
    model.setNewValueMin(state.min);
    expect(model.state.min).toBe(state.min);
    expect(model.state.thumbsValues[0]).toBe(26);

    // Checking the value of the last thumb when setting a
    // lower maximum value than the value of the thumb
    state.max = 75;
    model.setNewValueMax(state.max);
    expect(model.state.max).toBe(state.max);
    expect(model.state.thumbsValues[model.state.thumbsValues.length - 1]).toBe(74);

    // Check that thumbs change when you change the step size
    state.step = 3;
    model.setNewValueStep(state.step);
    expect(model.state.step).toBe(state.step);
    expect(model.state.thumbsValues[0]).toBe(27);
    expect(model.state.thumbsValues[1]).toBe(36);
    expect(model.state.thumbsValues[model.state.thumbsValues.length - 1]).toBe(72);

    state.step = 5;
    model.setNewValueStep(state.step);
    expect(model.state.step).toBe(state.step);
    expect(model.state.thumbsValues[0]).toBe(25);
    expect(model.state.thumbsValues[1]).toBe(35);
    expect(model.state.thumbsValues[model.state.thumbsValues.length - 1]).toBe(70);

    // check for overlapping adjacent thumbs
    state.thumbsValues[0] = 38;
    model.setNewValueThumbsValues(state.thumbsValues[0], 0);
    expect(model.state.thumbsValues[0]).toBe(35);
    expect(model.state.thumbsValues[1]).toBe(40);

    state.thumbsValues[1] = 67;
    model.setNewValueThumbsValues(state.thumbsValues[1], 1);
    expect(model.state.thumbsValues[1]).toBe(65);
    expect(model.state.thumbsValues[2]).toBe(70);

    state.thumbsValues[1] = 30;
    model.setNewValueThumbsValues(state.thumbsValues[1], 1);
    expect(model.state.thumbsValues[0]).toBe(35);
    expect(model.state.thumbsValues[1]).toBe(40);
  });
});
