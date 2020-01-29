interface StateObject {
    min: number
    max: number,
    touchsValues: number[],
    orientation: string,
    amount: number,
    step: number,
    tooltip: boolean,
}
interface DataObject {
    currentValue: number
    index: number
}
export class Model {
    state: StateObject
    emitter: any

    constructor (eventEmitter: any) {
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

        this.emitter.subscribe('model:state-changed', (state: StateObject) => {
            this.checkMinValueInArrayTouchsValues(state);
            this.checkMaxValueInArrayTouchsValues(state);
            this.checkTouchsValues(state);
        });

        this.emitter.subscribe('view:amountTouches-changed', (touchsValues: number[]) => {
            this.overwriteCurrentTouchsValues(touchsValues);
        });

        this.emitter.subscribe('view:touchsValues-changed', (data: DataObject) => {
            this.setCurrentTouchsValues(data.currentValue, data.index);
        });
    }
    notifyStateChanged(): void {
        this.emitter.emit('model:state-changed', this.state);
    }
    checkMinValueInArrayTouchsValues(state: StateObject): void {
        if (state.min > this.state.touchsValues[0]) {
            this.state.touchsValues[0] = state.min;
            for (let i = 1; i <= (this.state.touchsValues.length - 1); i++) {
                this.state.touchsValues[i] = this.state.touchsValues[i - 1] + state.step;
            }
            this.notifyStateChanged();
        }
    }
    checkMaxValueInArrayTouchsValues(state: StateObject): void {
        if (state.max < this.state.touchsValues[this.state.touchsValues.length - 1]) {
            this.state.touchsValues[this.state.touchsValues.length - 1] = state.max;
            const touchsValuesLength = this.state.touchsValues.length - 1;
            for (let i = 1; i <= touchsValuesLength; i++) {
                this.state.touchsValues[touchsValuesLength - i] = (this.state.touchsValues[(touchsValuesLength - i) + 1]) - state.step;
            }
            this.notifyStateChanged();
        } 
    }
    checkTouchsValues(state: StateObject): void {
        let currentTouchValues: number[] = [];
        for(let i = 0; i < state.touchsValues.length; i++) {
            const newValue: number = state.touchsValues[i];
            const remainderOfTheDivision: number = newValue % state.step;
            const newCurrentValue: number = newValue - remainderOfTheDivision;

            if (this.state.touchsValues[i] != newCurrentValue || newCurrentValue + state.step) {
                if (state.touchsValues[i - 1] === newCurrentValue) {
                    currentTouchValues[i] = newCurrentValue + state.step;
                } else {
                    currentTouchValues[i] = newCurrentValue;
                } 
            }
        }
        if (currentTouchValues[0] < state.min) {
            currentTouchValues[0] = currentTouchValues[0] + state.step;
        }
        if (this.state.touchsValues != currentTouchValues) {
            for (let i = 0; i < this.state.touchsValues.length; i++) {
                if (this.state.touchsValues[i] != currentTouchValues[i]) {
                    this.state.touchsValues = currentTouchValues;
                    this.notifyStateChanged();
                }
            }
        }
    }
    //установить новое значение min//
    setNewValueMin(min: number): void {
        if (this.state.min === min) {
            return;
        }
        this.state.min = min;
        this.notifyStateChanged();
    }
    //установить новое значение max//
    setNewValueMax(max: number): void {
        if (this.state.max === max) {
            return;
        }
        this.state.max = max;
        this.notifyStateChanged();
    }
    //установить новое количество ползунков//
    setNewValueAmount(amount: number) {
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
    setNewValueTouchsValues(touchValue: number, index: number): number {
        if (this.state.touchsValues[index] === touchValue) {
            return;
        }
        this.state.touchsValues[index] = touchValue;
        this.notifyStateChanged();
    }
    // установить новое значение для шага перемещения ползунков//
    setNewValueStep(step: number): void {
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
    setNewValueTooltip(value: boolean): void {
        if(value === true) {
            this.state.tooltip = value;
        }
        if(value === false) {
            this.state.tooltip = value;
        }
        this.notifyStateChanged();
    }
    //установить новое значение для поля orientation//
    setNewValueOrientation(value: string): void {
        if(value === 'horizontal') {
            this.state.orientation = 'horizontal';
        } else if(value === 'vertical') {
            this.state.orientation = 'vertical';
        }
        this.notifyStateChanged();
    }

    overwriteCurrentTouchsValues(touchsValues: number[]): void {
        this.state.touchsValues = touchsValues;
        this.notifyStateChanged();
    }
    setCurrentTouchsValues(value: number, index: number): void {
        this.state.touchsValues[index] = value;
        this.notifyStateChanged();
    }
}