import {Controller} from './controller.js';

export class Model {
    constructor (eventEmitter) {
        this.initialConfig = {
            min: 0,
            max: 100,
            state: [10, 20, 40, 70],
            horizontal: true,
            vertical: false,
            amount: 4,
            step: 1,
            tultip: true,
        };
        this.currentConfig = {};

        this.emitter = eventEmitter;
        this.emitter.emit('model:state-changed', this.initialConfig)
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