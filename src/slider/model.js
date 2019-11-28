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
            step: 1,
            tooltip: true,
        };
        this.currentConfig = {};

        this.emitter = eventEmitter;
        this.emitter.emit('model:state-changed', this.state);

        this.emitter.subscribe('view:sliderTouchsStates-changed', (data) => {
            this.setCurrentSliderTouchsStatesValues(data.currentValue, data.index);
        });
    }
    setCurrentSliderTouchsStatesValues(value, index) {
        this.state.sliderTouchsStates[index] = value;
    }
    setMinValue(value) {
        this.currentConfig.min = value;
    }
    setMaxValue(value) {
        this.currentConfig.max = value;
    }
    setStateValue(arr) {
        for (let i = 0; i < arr.length; i++) {
            this.currentConfig.state[i] = arr[i];
        }
        for (let i = 0; i < arr.length; i++) {
            if (this.currentConfig.state[i] > this.currentConfig.state[i + 1]) {
                this.currentConfig.state[i] = this.currentConfig.state[i + 1];
            }
            if (this.currentConfig.state[i] < this.currentConfig.state[i - 1]) {
                this.currentConfig.state[i] = this.currentConfig.state[i - 1];
            }
        }
    }
    // написать нормальные значения для сравнения в условных конструкциях
    setOrientationValue(value) {
        if(value === horizontal) {
            this.currentConfig.horizontal = true;
            this.currentConfig.vertical = false;
        } else if(value === vertical) {
            this.currentConfig.horizontal = false;
            this.currentConfig.vertical = true;
        }
    }
    setAmountValue(value) {
        if (value <= 0) {
            this.currentConfig.amount = 1;
        } else if (value >= 10) {
            this.currentConfig.amount = 10;
        } else {
        this.currentConfig.amount = value;
        }
    }
    setStepValue(value) {
        if (value <= 0){
            this.currentConfig.step = 1;
        } else if (value >= this.currentConfig.max) {
            this.currentConfig.step = this.currentConfig.max;
        } else {
        this.currentConfig.step = value;
        }
    }
    setTulipValue(value) {
        if(value === 'true') {
            this.currentConfig.tultip = true;
        } else if(value === 'false') {
            this.currentConfig.tultip = false;
        }
    }
}