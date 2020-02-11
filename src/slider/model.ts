import {IModelState} from './iModelState';
import { EventEmitter } from './eventEmitter';

interface IData {
    currentValue: number
    index: number
}
export class Model {
     public state: IModelState
     private emitter: EventEmitter

    constructor (eventEmitter: EventEmitter) {
        this.state = {
            min: 0,
            max: 100,
            touchsValues: [20, 32, 44, 60],
            orientation: 'horizontal',
            amount: 4,
            step: 4,
            tooltip: true,
        };

        this.emitter = eventEmitter;
        this.notifyStateChanged();

        this.emitter.subscribe('model:state-changed', (state: IModelState) => {
            this.checkMinValueInArrayTouchsValues(state);
            this.checkMaxValueInArrayTouchsValues(state);
            this.checkTouchsValues(state);
            this.checkTouchsValuesForOverlap();
        });

        this.emitter.subscribe('view:amountTouches-changed', (touchsValues: number[]) => {
            this.overwriteCurrentTouchsValues(touchsValues);
        });

        this.emitter.subscribe('view:touchsValues-changed', (data: IData) => {
            this.setCurrentTouchsValues(data.currentValue, data.index);
        });
    }
    private notifyStateChanged(): void {
        this.emitter.emit('model:state-changed', this.state);
    }
    private checkMinValueInArrayTouchsValues(state: IModelState): void {
        if (state.min > this.state.touchsValues[0]) {
            this.state.touchsValues[0] = state.min;
            let touchsValuesLength = this.state.touchsValues.length - 1;

            new Array(touchsValuesLength)
                .fill(1)
                .forEach((_element: number, i: number) => {
                    this.state.touchsValues[i] = this.state.touchsValues[i - 1] + state.step;
                })
            this.notifyStateChanged();
        }
    }
    private checkMaxValueInArrayTouchsValues(state: IModelState): void {
        if (state.max < this.state.touchsValues[this.state.touchsValues.length - 1]) {
            this.state.touchsValues[this.state.touchsValues.length - 1] = state.max;
            const touchsValuesLength = this.state.touchsValues.length - 1;

            new Array(touchsValuesLength)
                .fill(1)
                .forEach((_element: number, i: number) => {
                    this.state.touchsValues[touchsValuesLength - i] = (this.state.touchsValues[(touchsValuesLength - i) + 1]) - state.step;
                })
            this.notifyStateChanged();
        } 
    }
    private checkTouchsValues(state: IModelState): void {
        let currentTouchValues: number[] = [];
        state.touchsValues.forEach((element: number, i: number) => {
            const newValue: number = element;
            const remainderOfTheDivision: number = newValue % state.step;
            const newCurrentValue: number = newValue - remainderOfTheDivision;

            if (this.state.touchsValues[i] != newCurrentValue || newCurrentValue + state.step) {
                if (state.touchsValues[i - 1] === newCurrentValue) {
                    currentTouchValues[i] = newCurrentValue + state.step;
                } else {
                    currentTouchValues[i] = newCurrentValue;
                } 
            }
        });
        if (currentTouchValues[0] < state.min) {
            currentTouchValues[0] = currentTouchValues[0] + state.step;
        }
        if (this.state.touchsValues != currentTouchValues) {
            this.state.touchsValues.forEach((_element: number, i: number) => {
                if (this.state.touchsValues[i] != currentTouchValues[i]) {
                    this.state.touchsValues = currentTouchValues;
                    this.notifyStateChanged();
                }
            });
        }
    }
    checkTouchsValuesForOverlap() {
        this.state.touchsValues.forEach((element: number, i: number) => {
            if (element <= this.state.touchsValues[i - 1]) {
                this.state.touchsValues[i] = this.state.touchsValues[i - 1] + this.state.step;
                this.notifyStateChanged();
            }
            if (element >= this.state.touchsValues[i + 1]) {
                this.state.touchsValues[i] = this.state.touchsValues[i + 1] - this.state.step;
                this.notifyStateChanged();
            }
        });
    }
    //установить новое значение min//
    public setNewValueMin(min: number): void {
        if (this.state.min === min) {
            return;
        }
        this.state.min = min;
        this.notifyStateChanged();
    }
    //установить новое значение max//
    public setNewValueMax(max: number): void {
        if (this.state.max === max) {
            return;
        }
        this.state.max = max;
        this.notifyStateChanged();
    }
    //установить новое количество ползунков//
    public setNewValueAmount(amount: number) {
        if (this.state.amount === amount) {
            return;
        }
        if (amount <= 0) {
            this.state.amount = 1;
        } else if (amount >= 10) {
            this.state.amount = 10;
        } else {
        this.state.amount = amount;
        }
        this.notifyStateChanged();
    }
    // установить новое значение для состояния ползунка//
    public setNewValueTouchsValues(touchValue: number, index: number) {
        if (this.state.touchsValues[index] === touchValue) {
            return;
        }
        this.state.touchsValues[index] = touchValue;
        this.notifyStateChanged();
    }
    // установить новое значение для шага перемещения ползунков//
    public setNewValueStep(step: number): void {
        if (this.state.step === step) {
            return;
        }
        if (step <= 0){
            this.state.step = 1;
        } else if (step >= this.state.max) {
            this.state.step = this.state.max;
        } else {
        this.state.step = step;
        }
        this.notifyStateChanged();
    }
    //установить новое значение для поля tultip//
    public setNewValueTooltip(value: boolean): void {
        if(value !==  this.state.tooltip) {
            this.state.tooltip = value;
            this.notifyStateChanged();
        }
    }
    //установить новое значение для поля orientation//
    public setNewValueOrientation(value: string): void {
        if(value === 'horizontal') {
            this.state.orientation = 'horizontal';
        } else if(value === 'vertical') {
            this.state.orientation = 'vertical';
        }
        this.notifyStateChanged();
    }
    private overwriteCurrentTouchsValues(touchsValues: number[]): void {
        this.state.touchsValues = touchsValues;
        this.notifyStateChanged();
    }
    private setCurrentTouchsValues(value: number, index: number): void {
        this.state.touchsValues[index] = value;
        this.notifyStateChanged();
    }
}