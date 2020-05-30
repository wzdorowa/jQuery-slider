import { EventEmitter } from '../slider/eventEmitter';
interface StateValue {
    values: number[]
}
interface IData {
    currentValue: number
    index: number
}
const eventEmitter = new EventEmitter();

const stateValue: StateValue = {
    values: [0, 0]
};
const stateData: IData = {
    currentValue: 20,
    index: 0
}
const assignValues = (state: IData): void =>  {
    stateValue.values[state.index] = state.currentValue;
};

test('testing subscription method', () => {
    eventEmitter.subscribe('eventEmitter-verification', (state: IData) => {
        assignValues(state);
    });
    expect(eventEmitter.handlersByEvent['eventEmitter-verification'].length).toBe(1);
});
test('testing emit method', () => {
    eventEmitter.emit('eventEmitter-verification', stateData);
    expect(stateValue.values[0]).toBe(20);

    stateData.currentValue = 40;
    stateData.index = 1;
    eventEmitter.emit('eventEmitter-verification', stateData);
    expect(stateValue.values[1]).toBe(40);
})