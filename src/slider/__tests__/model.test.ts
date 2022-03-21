import Model from '../Model/Model';
import defaultState from '../Model/defaultState';
import { IModelState } from '../interfaces/iModelState';
import EventEmitter from '../EventEmitter';

let state: IModelState = {
  min: 0,
  max: 100,
  thumbsValues: [20, 32, 44, 60],
  orientation: 'horizontal',
  step: 2,
  hasTooltips: true,
  hasScaleValues: true,
};

describe('Model testing', () => {
  const eventEmitter = new EventEmitter();
  const model: Model = new Model(eventEmitter);

  test('update state', () => {
    state.min = -5;
    state.step = 0;
    state.thumbsValues = [];
    state.orientation = 'vert';

    model.updateState(state);
    expect(model.state.min).toBe(0);
    expect(model.state.step).toBe(1);
    expect(model.state.thumbsValues.length).toBe(1);
    expect(model.state.orientation).toBe('horizontal');

    state.min = 10.5;
    state.max = 10.8;

    model.updateState(state);
    expect(model.state.min).toBe(10);
    expect(model.state.max).toBe(12);
  });

  test('set new value ThumbsValues', () => {
    state = defaultState;
    model.updateState(state);

    model.setNewThumbValue(44, 2);
    expect(model.state.thumbsValues[2]).toBe(44);

    model.setNewThumbValue(46, 1);
    expect(model.state.thumbsValues[1]).toBe(46);
  });

  test('request thumb value change', () => {
    state = defaultState;
    model.updateState(state);

    model.requestThumbValueChange(45.3, 2);
    expect(model.state.thumbsValues[2]).toBe(46);
  });
});
