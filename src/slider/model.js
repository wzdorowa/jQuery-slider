export class Model {
    constructor (eventEmitter) {
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
        if (state.min > this.state.touchsValues[0]) {
            this.state.touchsValues[0] = state.min;
            for (let i = 1; i <= (this.state.touchsValues.length - 1); i++) {
                this.state.touchsValues[i] = this.state.touchsValues[i - 1] + state.step;
            }
            this.notifyStateChanged();
        }
    }
    checkMaxValueInArrayTouchsValues(state) {
        if (state.max < this.state.touchsValues[this.state.touchsValues.length - 1]) {
            this.state.touchsValues[this.state.touchsValues.length - 1] = state.max;
            const touchsValuesLength = this.state.touchsValues.length - 1;
            for (let i = 1; i <= touchsValuesLength; i++) {
                this.state.touchsValues[touchsValuesLength - i] = (this.state.touchsValues[(touchsValuesLength - i) + 1]) - state.step;
            }
            this.notifyStateChanged();
        } 
    }
    checkTouchsValues(state) {
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