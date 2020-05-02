import { EventEmitter } from '../slider/eventEmitter';
interface StateValue {
    valueTwo: number | null,
    valueThree: number | null
}
const eventEmitter = new EventEmitter();

const assignValueTwo = (state: StateValue): void =>  {
    state.valueTwo = 2;
};
const assignValueThree = (state: StateValue): void => {
    state.valueThree = 3;
};
let stateValue: StateValue = {
    valueTwo: null,
    valueThree: null
};
test('testing subscription method', () => {
    eventEmitter.subscribe('eventEmitter-verification', (state: StateValue) => {
        assignValueTwo(state);
        assignValueThree(state);
    });
    expect(eventEmitter.handlersByEvent['eventEmitter-verification'].length).toBe(1);
});
test('testing emit method', () => {
    eventEmitter.emit('eventEmitter-verification', stateValue);
    expect(stateValue.valueTwo).toBe(2);
    expect(stateValue.valueThree).toBe(3);
})