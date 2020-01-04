import {Controller} from './controller.js';

export class Model {
    constructor (eventEmitter) {
        this.state = {
            min: 0,
            max: 100,
            touchsValues: [20, 35, 45, 60],
            orientation: 'horizontal',
            amount: 4,
            step: 4,
            tooltip: true,
        };

        this.emitter = eventEmitter;
        this.notifyStateChanged();

        this.emitter.subscribe('model:state-changed', (state) => {
            this.checkMinValueInArrayTouchsValues(state);
            this.checkMaxValueInArrayTouchsValues(state);
            this.checkTouchsValues(state);
        });

        this.emitter.subscribe('view:amountTouches-changed', (touchsValues) => {
            this.overwriteCurrentTouchsValues(touchsValues);
        });

        this.emitter.subscribe('view:touchsValues-changed', (data) => {
            this.setCurrentTouchsValues(data.currentValue, data.index);
        });
    }
    notifyStateChanged() {
        console.log('вызван метод: notifyStateChanged');
        this.emitter.emit('model:state-changed', this.state);
    }
    checkMinValueInArrayTouchsValues(state) {
        console.log('вызван метод: checkMinValueInArrayTouchsValues' + state.min)
        if (state.min > this.state.touchsValues[0]) {
            this.state.touchsValues[0] = state.min;
            if (this.state.touchsValues[0] >= this.state.touchsValues[1]) {
                this.state.touchsValues[1] = this.state.touchsValues[0] + state.step;
            }
            this.notifyStateChanged();
        }
    }
    checkMaxValueInArrayTouchsValues(state) {
        console.log('вызван метод: checkMaxValueInArrayTouchsValues' + state.max);
        if (state.max < this.state.touchsValues[this.state.touchsValues.length - 1]) {
            this.state.touchsValues[this.state.touchsValues.length - 1] = state.max;
            if (this.state.touchsValues[this.state.touchsValues.length - 1] <= this.state.touchsValues[this.state.touchsValues.length - 2]) {
                this.state.touchsValues[this.state.touchsValues.length - 2] = (this.state.touchsValues[this.state.touchsValues.length - 1]) - state.step;
            }
            this.notifyStateChanged();
        } 
    }
    checkTouchsValues(state) {
        console.log('вызван метод checkTouchsValues');
        let currentTouchValues = [];
        for(let i = 0; i < state.touchsValues.length; i++) {
            const newValue = state.touchsValues[i];
            const remainderOfTheDivision = newValue % state.step;
            const newCurrentValue = newValue - remainderOfTheDivision;

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
    setNewValueMin(min) {
        console.log('вызван метод setNewValueMin');
        this.state.min = min;
        this.notifyStateChanged();
    }
    //установить новое значение max//
    setNewValueMax(max) {
        console.log('вызван метод setNewValueMax');
        this.state.max = max;
        this.notifyStateChanged();
    }
    //установить новое количество ползунков//
    setNewValueAmount(amount) {
        console.log('вызван метод setNewValueAmount');
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
    setNewValueTouchsValues(touchValue, index) {
        console.log('вызван метод setNewValueTouchsValues');
        this.state.touchsValues[index] = touchValue;
        this.notifyStateChanged();
    }
    // установить новое значение для шага перемещения ползунков//
    setNewValueStep(step) {
        console.log('вызван метод setNewValueStep');
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
    setNewValueTooltip(value) {
        console.log('вызван метод setNewValueTooltip');
        if(value === true) {
            this.state.tooltip = value;
        }
        if(value === false) {
            this.state.tooltip = value;
        }
        this.notifyStateChanged();
    }
    //установить новое значение для поля orientation//
    setNewValueOrientation(value) {
        console.log('вызван метод setNewValueOrientation');
        if(value === 'horizontal') {
            this.state.orientation = 'horizontal';
        } else if(value === 'vertical') {
            this.state.orientation = 'vertical';
        }
        this.notifyStateChanged();
    }

    overwriteCurrentTouchsValues(touchsValues) {
        console.log('вызван метод overwriteCurrentTouchsValues');
        this.state.touchsValues = touchsValues;
        this.notifyStateChanged();
    }
    setCurrentTouchsValues(value, index) {
        console.log('вызван метод setCurrentTouchsValues');
        this.state.touchsValues[index] = value;
        this.notifyStateChanged();
    }
}