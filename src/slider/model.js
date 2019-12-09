import {Controller} from './controller.js';

export class Model {
    constructor (eventEmitter) {
        this.state = {
            min: 0,
            max: 100,
            sliderTouchsStates: [0, 20, 40, 100],
            horizontal: true,
            vertical: false,
            amount: 4,
            step: 4,
            tooltip: true,
        };
        this.currentConfig = {};

        this.emitter = eventEmitter;
        this.emitter.emit('model:state-changed', this.state);

        this.emitter.subscribe('view:sliderTouchsStates-changed', (data) => {
            this.setCurrentSliderTouchsStatesValues(data.currentValue, data.index);
        });
    }
    setValuesFromTheNewConfig(newConfig) {
        this.state.min = newConfig.min;
        this.state.max = newConfig.max;

        //установить новое количество ползунков//
        if (newConfig.amount <= 0) {
            this.state.amount = 1;
        } else if (newConfig.amount >= 10) {
            this.state.amount = 10;
        } else {
        this.cstate.amount = newConfig.amount;
        }

        //установить новые значения для ползунков//
        for (let i = 0; i < newConfig.sliderTouchsStates.length; i++) {
            this.state.sliderTouchsStates[i] = newConfig.sliderTouchsStates[i];

            if (this.state.sliderTouchsStates[i] > this.state.sliderTouchsStates[i + 1]) {
                this.state.sliderTouchsStates[i] = this.state.sliderTouchsStates[i + 1];
            }
            if (this.state.sliderTouchsStates[i] < this.state.sliderTouchsStates[i - 1]) {
                this.state.sliderTouchsStates[i] = this.state.sliderTouchsStates[i - 1];
            }
        }

        // установить новое значение для шага перемещения ползунков//
        if (newConfig.step <= 0){
            this.state.step = 1;
        } else if (newConfig.step >= this.state.max) {
            this.state.step = this.state.max;
        } else {
        this.state.step = newConfig.step;
        }

        //установить новое значение для поля tultip//
        if(newConfig.tooltip === 'true') {
            this.state.tooltip = true;
        } else if(newConfig.tooltip === 'false') {
            this.state.tultip = false;
        }
        
        //установить новое значение для поля orientation//
        if(newConfig.orientation === 'horizontal') {
            this.state.orientation = 'horizontal';
        } else if(newConfig.orientation === 'vertical') {
            this.state.orientation = 'vertical';
        }
    }
    setCurrentSliderTouchsStatesValues(value, index) {
        this.state.sliderTouchsStates[index] = value;
    }
}