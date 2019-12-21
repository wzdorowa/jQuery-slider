import {Controller} from './controller.js';

export class Model {
    constructor (eventEmitter) {
        this.state = {
            min: 20,
            max: 50,
            touchsValues: [20, 25, 40, 50],
            orientation: 'horizontal',
            amount: 4,
            step: 4,
            tooltip: true,
        };

        this.emitter = eventEmitter;
        this.notifyStateChanged();

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