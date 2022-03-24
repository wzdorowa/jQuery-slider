import EventEmitter from '../EventEmitter';
import { IThumbData } from '../interfaces/IThumbData';

interface StateValue {
  values: number[];
}

const eventEmitter = new EventEmitter();

const stateValue: StateValue = {
  values: [0, 0],
};
const stateData: IThumbData = {
  value: 20,
  index: 0,
};
const assignValues = (state: IThumbData): void => {
  stateValue.values[state.index] = state.value;
};

test('testing subscription method', () => {
  eventEmitter.makeSubscribe(
    'eventEmitter-verification',
    (state: IThumbData) => {
      assignValues(state);
    },
  );
  expect(eventEmitter.handlersByEvent['eventEmitter-verification'].length).toBe(
    1,
  );
});
test('testing emit method', () => {
  eventEmitter.emit('eventEmitter-verification', stateData);
  expect(stateValue.values[0]).toBe(20);

  stateData.value = 40;
  stateData.index = 1;
  eventEmitter.emit('eventEmitter-verification', stateData);
  expect(stateValue.values[1]).toBe(40);
});
