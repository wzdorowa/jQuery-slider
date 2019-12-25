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
        this.emitter.emit('model:state-changed', this.state);
    }
    checkMinValueInArrayTouchsValues(state) {
        console.log('вызвана: checkMinValueInArrayTouchsValues: 1 ' + state)
        if (state.min > this.state.touchsValues[0]) {
            this.state.touchsValues[0] = state.min;
            this.notifyStateChanged();
        }
    }
    checkMaxValueInArrayTouchsValues(state) {
        if (state.max < this.state.touchsValues[this.state.touchsValues.length - 1]) {
            this.state.touchsValues[this.state.touchsValues.length - 1] = state.max;
            this.notifyStateChanged();
        }
        // console.log('state.max:' + state.max);
        // console.log(this.state.touchsValues[this.state.touchsValues.length - 2]);
        // if (this.state.touchsValues[this.state.touchsValues.length - 1] <= this.state.touchsValues[this.state.touchsValues.length - 2]) {
        //     this.state.touchsValues[this.state.touchsValues.length - 1] = this.state.touchsValues[this.state.touchsValues.length - 2] + this.state.step;
        //     console.log(this.state.touchsValues[this.state.touchsValues.length - 1]);
        //     this.notifyStateChanged();
        // }  
    }
    checkTouchsValues(state) {
        console.log('вызван метод checkTouchsValues');
        console.log('state.touchsValues : ' + state.touchsValues);

        for(let i = 0; i < state.touchsValues.length - 1; i++) {
            const newValue = state.touchsValues[i] - state.min;
            const remainderOfTheDivision = newValue % state.step;
            const newCurrentValue = newValue - remainderOfTheDivision;

            console.log('newValue :'  + i + ' :' + newValue);
            console.log('remainderOfTheDivision : ' + remainderOfTheDivision);
            console.log('newCurrentValue : ' + newCurrentValue);
            if (this.state.touchsValues[i] != newCurrentValue || newCurrentValue + state.step) {
                if (state.touchsValues[i - 1] === newCurrentValue) {
                    this.state.touchsValues[i] = newCurrentValue + state.step;
                    this.notifyStateChanged();
                } else {
                    this.state.touchsValues[i] = newCurrentValue;
                    this.notifyStateChanged();
                } 
            }
            console.log('в цикле метода checkTouchsValues');
            // if (state.touchsValues[i] > state.touchsValues[i + 1]) {
            //     this.state.touchsValues[i] = state.touchsValues[i + 1] - this.state.step;
            //     this.notifyStateChanged();
            // }
            // if (state.touchsValues[i] < state.touchsValues[i - 1]) {
            //     this.state.touchsValues[i] = state.touchsValues[i - 1] + this.state.step;
            //     this.notifyStateChanged();
            // }
        }
    }
    //установить новое значение min//
    setNewValueMin(min) {
        this.state.min = min;
        this.notifyStateChanged();
    }
    //установить новое значение max//
    setNewValueMax(max) {
        this.state.max = max;
        this.notifyStateChanged();
    }
    //установить новое количество ползунков//
    setNewValueAmount(amount) {
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
        this.state.touchsValues[index] = touchValue;
        this.notifyStateChanged();
    }
    // установить новое значение для шага перемещения ползунков//
    setNewValueStep(step) {
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
        if(value === 'horizontal') {
            this.state.orientation = 'horizontal';
        } else if(value === 'vertical') {
            this.state.orientation = 'vertical';
        }
        this.notifyStateChanged();
    }

    overwriteCurrentTouchsValues(touchsValues) {
        this.state.touchsValues = touchsValues;
        this.notifyStateChanged();
    }
    setCurrentTouchsValues(value, index) {
        this.state.touchsValues[index] = value;
        this.notifyStateChanged();
    }
}