import Model from '../Model';
import { IModelState } from '../interfaces/iModelState';
import EventEmitter from '../EventEmitter';

const state: IModelState = {
  min: 0,
  max: 100,
  thumbsValues: [20, 40, 60, 80],
  orientation: 'horizontal',
  thumbsCount: 4,
  step: 2,
  isTooltip: true,
  isScaleOfValues: true,
};
describe('Model testing', () => {
  const eventEmitter = new EventEmitter();
  const model: Model = new Model(eventEmitter);
  eventEmitter.emit('model:state-changed', state);

  test('Set new value Min', () => {
    state.min = 10;
    model.setNewValueMin(state.min);
    expect(model.state.min).toBe(state.min);
    model.setNewValueMin(state.min);
  });
  test('Set new value Max', () => {
    state.max = 80;
    model.setNewValueMax(state.max);
    expect(model.state.max).toBe(state.max);
    model.setNewValueMax(state.max);
  });
  test('Set new value count', () => {
    state.thumbsCount = 0;
    model.setNewValueCount(state.thumbsCount);
    expect(model.state.thumbsCount).toBe(1);

    state.thumbsCount = 15;
    model.setNewValueCount(state.thumbsCount);
    expect(model.state.thumbsCount).toBe(15);

    state.thumbsCount = 4;
    model.setNewValueCount(state.thumbsCount);
    expect(model.state.thumbsCount).toBe(state.thumbsCount);

    state.thumbsCount = 4;
    model.setNewValueCount(state.thumbsCount);
    expect(model.state.thumbsCount).toBe(state.thumbsCount);
  });
  test('Set new value ThumbsValues', () => {
    state.thumbsValues[1] = 36;
    model.setNewThumbValue(state.thumbsValues[1], 1);
    expect(model.state.thumbsValues[1]).toBe(state.thumbsValues[1]);

    state.thumbsValues[3] = 80;
    model.setNewThumbValue(state.thumbsValues[3], 3);
    expect(model.state.thumbsValues[3]).toBe(state.thumbsValues[3]);
  });
  test('Set new value Step', () => {
    state.step = 0;
    model.setNewValueStep(state.step);
    expect(model.state.step).toBe(1);

    state.step = 2;
    model.setNewValueStep(state.step);
    expect(model.state.step).toBe(state.step);
    model.setNewValueStep(state.step);
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
  test('set a new value for the thumb state', () => {
    model.setNewThumbValue(50, 3);
    expect(model.state.thumbsValues[3]).toBe(50);
    model.setNewThumbValue(50, 3);
  });
  test('check normolize state', () => {
    model.setNewValueMin(26);

    expect(model.state.min).toBe(26);
    expect(model.state.thumbsValues[0]).toBe(26);

    model.setNewValueMax(80);
    model.setNewThumbValue(86, 3);
    expect(model.state.thumbsValues[3]).toBe(80);
  });
  test('check maximum count of thumbs', () => {
    model.setNewValueStep(5);
    model.setNewValueCount(15);

    expect(model.state.thumbsCount).toBe(10);
  });
});
