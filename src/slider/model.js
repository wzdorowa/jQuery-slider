import {Controller} from './controller.js';

export class Model {
    constructor (eventEmitter) {
        this.state = {
            min: 0,
            max: 100,
            sliderTouchsStates: [0, 20, 40, 100],
            orientation: 'horizontal',
            amount: 4,
            step: 4,
            tooltip: true,
        };

        this.emitter = eventEmitter;
        this.emitter.emit('model:state-changed', this.state);

        this.emitter.subscribe('view:sliderTouchsStates-changed', (data) => {
            this.setCurrentSliderTouchsStatesValues(data.currentValue, data.index);
        });
    }
    //установить новое значение min//
    setNewValueMin(min) {
        this.state.min = min;
    }
    //установить новое значение max//
    setNewValueMax(max) {
        this.state.max = max;
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
    }
    // установить новое значение для состояния ползунка//
    setNewValueSliderTouchsStates(touchValue, index) {
        this.state.sliderTouchsStates[index] = touchValue;
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
    }
    //установить новое значение для поля tultip//
    setNewValueStepTooltip(value) {
        if(value === 'true') {
            this.state.tooltip = true;
        } else if(value === 'false') {
            this.state.tultip = false;
        }
    }
    //установить новое значение для поля orientation//
    setNewValueStepOrientation(value) {
        if(value === 'horizontal') {
            this.state.orientation = 'horizontal';
        } else if(value === 'vertical') {
            this.state.orientation = 'vertical';
        }
    }
    setCurrentSliderTouchsStatesValues(value, index) {
        this.state.sliderTouchsStates[index] = value;
    }
}