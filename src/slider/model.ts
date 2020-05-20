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
            step: 2,
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
            this.notifyStateChanged();
        };
    }
    private checkMaxValueInArrayTouchsValues(state: IModelState): void {
        if (state.max < this.state.touchsValues[this.state.touchsValues.length - 1]) {
            this.state.touchsValues[this.state.touchsValues.length - 1] = state.max;
            this.notifyStateChanged();
        };
    }
    //Высчитать значения ползунков в зависимости от размера шага
    private checkTouchsValues(state: IModelState): void {
        state.touchsValues.forEach((element: number, i: number) => {
            const newValue: number = element;
            const remainderOfTheDivision: number = newValue % state.step;
            const newCurrentValue: number = newValue - remainderOfTheDivision;
            let maxPossibleValue: number = (state.max - (state.max % state.step)) - (((state.touchsValues.length - 1) - i) * state.step);
            let minPossibleValue: number = (state.min - (state.min % state.step)) + (i * state.step);

            if(minPossibleValue < state.min) {
                minPossibleValue = minPossibleValue + state.step;
            };

            if (newCurrentValue > maxPossibleValue) {
                this.state.touchsValues[i] = maxPossibleValue;
                this.notifyStateChanged(); 
            } else if (newCurrentValue < minPossibleValue) {
                this.state.touchsValues[i] = minPossibleValue;
                this.notifyStateChanged(); 
            } else if (this.state.touchsValues[i] !== newCurrentValue){
                this.state.touchsValues[i] = newCurrentValue;
                this.notifyStateChanged(); 
            }

            if (newCurrentValue < state.min) {
                this.state.touchsValues[i] = minPossibleValue;
                this.notifyStateChanged(); 
            };
            if (newCurrentValue > state.max) {
                this.state.touchsValues[i] = maxPossibleValue;
                this.notifyStateChanged(); 
            }
        });
    }
    //Проверить перекрытие ползунков друг другом
    private checkTouchsValuesForOverlap() {
        this.state.touchsValues.forEach((element: number, i: number) => {
            const maxPossibleValue: number = this.state.max - (((this.state.touchsValues.length - 1) - i) * this.state.step);
            const minPossibleValue: number = this.state.min + (i * this.state.step);

            if (i !== 0 && element <= this.state.touchsValues[i - 1]) {
                this.state.touchsValues[i - 1] = this.state.touchsValues[i] - this.state.step;
                if(this.state.touchsValues[i - 1] < minPossibleValue - this.state.step) {
                    this.state.touchsValues[i - 1] = minPossibleValue - this.state.step;
                    this.state.touchsValues[i] = minPossibleValue;
                }
                this.notifyStateChanged();
            }
            if (i !== this.state.touchsValues[this.state.touchsValues.length -1] && element >= this.state.touchsValues[i + 1]) {
                this.state.touchsValues[i + 1] = this.state.touchsValues[i] + this.state.step;
                if(this.state.touchsValues[i + 1] > maxPossibleValue + this.state.step) {
                    this.state.touchsValues[i + 1] = maxPossibleValue + this.state.step;
                    this.state.touchsValues[i] = maxPossibleValue;
                }
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
        } else if (step >= this.state.max / this.state.touchsValues.length - 1) {
            this.state.step = this.state.max / this.state.touchsValues.length - 1;
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