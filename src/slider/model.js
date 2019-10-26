class Model {
    constructor () {
        this.initialConfig {
            min = 0;
            max =  100;
            state = [10, 50];
            horizontal = true;
            vertical = false;
            amount = 2;
            step = 1;
            tultip = true;
        };
        this.currentConfig {};
    }
    setMinValue(value) {
        this.currentConfig.min = value;
    }
    setMaxValue(value) {
        this.currentConfig.max = value;
    }
    setStateValue(arr) {
        this.currentConfig.state[0] = arr[0];
        this.currentConfig.state[1] = arr[1];
        // и т.д. (написать нормальную реализацию через цикл)
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
        this.currentConfig.step = value;
    }
    setTulipValue(value) {
        if(value === 'true') {
            this.currentConfig.tultip = true;
        } else if(value === 'false') {
            this.currentConfig.tultip = false;
        }
    }
}