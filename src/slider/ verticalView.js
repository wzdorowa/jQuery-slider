import {Controller} from './controller.js';

export class verticalView {
    constructor(element, eventEmitter) {
        console.log('vertical view created', this, element),
        this.slider = element,
        this.sliderTouches = [],
        this.elementSliderLine,
        this.elementSliderLineSpan,
        this.elementsSliderTooltipText =[],
        this.isCreatedSlider = false,
        this.coefficientPoint = null,
        this.startY = 0,
        this.maxY = 0,
        this.currentY = 0,
        this.currentValue,
        this.modelState = {},
        this.currentTouchIndex = null,

        this.emitter = eventEmitter,

        this.emitter.subscribe('model:state-changed', (state) => {
            this.modelState = state;
            if(!this.isCreatedSlider) {
                this.setWidthSliderContainer();
                this.createSlider(this.modelState);
                this.isCreatedSlider = true;
                this.setValueSliderTouch(this.modelState);

                this.listenSliderTouchesEvents(this.modelState);
            }
            if(this.sliderTouches.length != this.modelState.amount) {
                this.changeAmountTouchs(this.modelState);
                this.listenSliderTouchesEvents(this.modelState);
            }
            if (this.modelState.tooltip === false) {
                this.hideTooltip();
            }
            if (this.modelState.tooltip === true) {
                this.showTooltip();
            }
            this.setNewValueSliderTouch(this.modelState);
            this.setTooltipsValues(this.modelState);
        })
    }
    setWidthSliderContainer() {
        this.slider.classList.add('width-vertical-slider-container');
    }
    /* функция CreateElement создает необходимый элемент с заданным классом */
    createElement(teg, className) {
        const element = document.createElement(teg);
        element.className = className;
        return element;
    }
    /* устанавливает значение для добавленного ползунка */
    setValueToNewTouch(modelState) {
        let allTouches = Array.from($(this.slider).find('.slider-touch'));
        const indexNewTouch = allTouches.length - 1;

        this.modelState.touchsValues[indexNewTouch] = (this.modelState.touchsValues[indexNewTouch -1] + (this.modelState.step * 2));
        this.emitter.emit('view:amountTouches-changed', this.modelState.touchsValues);
    }
    /* функция CreateSlider создает основную html-структуру слайдера */
    createSlider(modelState) {
        for(let i = 1; i <= this.modelState.amount; i++) {
            const sliderTouch = this.createElement('div', 'slider-touch');
            const sliderSpan = this.createElement('span', 'slider-span');
            const sliderTooltip = this.createElement('div', 'slider-tooltip');
            const sliderTooltipText = this.createElement('span', 'slider-tooltip-text-for-verticalView');

            sliderTouch.append(sliderSpan);
            sliderTouch.append(sliderTooltip);
            sliderTooltip.append(sliderTooltipText);
            this.slider.append(sliderTouch);
            this.sliderTouches.push(sliderTouch);
            this.elementsSliderTooltipText.push(sliderTooltipText);
        }
        const sliderLine = this.createElement('div', 'slider-line-for-verticalView');
        const sliderLineSpan = this.createElement('span', 'slider-line-span');
        
        this.slider.append(sliderLine);
        sliderLine.append(sliderLineSpan);

        this.elementSliderLineSpan = sliderLineSpan;
        this.elementSliderLine = sliderLine;
    }
    changeAmountTouchs(modelState) {
        if (this.sliderTouches.length < this.modelState.amount) {
            const missingAmount = this.modelState.amount - this.sliderTouches.length;
            for (let i = 1; i <= missingAmount; i++) {
                const sliderTouch = this.createElement('div', 'slider-touch');
                const sliderSpan = this.createElement('span', 'slider-span');
                const sliderTooltip = this.createElement('div', 'slider-tooltip');
                const sliderTooltipText = this.createElement('span', 'slider-tooltip-text-for-verticalView');

                sliderTouch.append(sliderSpan);
                sliderTouch.append(sliderTooltip);
                sliderTooltip.append(sliderTooltipText);
                this.slider.append(sliderTouch);
                this.sliderTouches.push(sliderTouch);
                this.elementsSliderTooltipText.push(sliderTooltipText);

                this.setValueToNewTouch(modelState);
            }
        }
        if (this.sliderTouches.length > this.modelState.amount) {
            const excessAmount =  this.sliderTouches.length - this.modelState.amount;
            let allTouches = Array.from($(this.slider).find('.slider-touch'));

            for (let i = 1; i <= excessAmount; i++) {
                allTouches[allTouches.length - i].remove();
                this.sliderTouches.splice(-1, 1);
                this.elementsSliderTooltipText.splice(-1, 1);
                this.modelState.touchsValues.splice(-1, 1);
            }
            this.emitter.emit('view:amountTouches-changed', this.modelState.touchsValues);
        }
    }
    /* функция setValuesSliderTouch устанавливает полученное по-умолчанию значение
     для каждой из кнопок-ползунков */
    setValueSliderTouch(modelState) {
        let elements = this.sliderTouches;
        this.coefficientPoint = (this.elementSliderLine.offsetHeight / (this.modelState.max - this.modelState.min));

        for(let i = 0; i < elements.length; i++) {
            elements[i].style.top = (Math.ceil(this.coefficientPoint * this.modelState.touchsValues[i])) + 'px';
        }
        this.elementSliderLineSpan.style.marginTop = elements[0].offsetTop + 'px';
        this.elementSliderLineSpan.style.height = (elements[elements.length - 1].offsetTop - elements[0].offsetTop) + 'px';
    }
    setNewValueSliderTouch(modelState) {
        let elements = this.sliderTouches;
        this.coefficientPoint = (this.elementSliderLine.offsetHeight / (this.modelState.max - this.modelState.min));
        this.shiftToMinValue = Math.ceil(this.coefficientPoint * this.modelState.min);

        for(let i = 0; i < elements.length && i != this.currentTouchIndex; i++) {
            elements[i].style.top = (Math.ceil(this.coefficientPoint * this.modelState.touchsValues[i]) - this.shiftToMinValue) + 'px';
        }
        this.elementSliderLineSpan.style.marginTop = elements[0].offsetTop + 'px';
        this.elementSliderLineSpan.style.height = (elements[elements.length - 1].offsetTop - elements[0].offsetTop) + 'px';
    }
    /* функция setTooltipsValues устанавливает значения по-умолчанию ползунков
     в соответствующие им тултипы  */
    setTooltipsValues(modelState) {
        for(let i = 0; i < this.modelState.touchsValues.length; i++) {
            this.elementsSliderTooltipText[i].innerHTML = this.modelState.touchsValues[i];
        }
    }
    listenSliderTouchesEvents(modelState) {
        let elements = this.sliderTouches;
        // link events
        for(let i = 0; i < elements.length; i++) {
            elements[i].addEventListener('mousedown', event => this.onStart(this.modelState, event, i));
            elements[i].addEventListener('touchstart', event => this.onStart(this.modelState, event, i));
        }
    }
    onStart(modelState, event, i) {
        this.currentTouchIndex = i;
        event.preventDefault();
        let elements = this.sliderTouches;

        let target = elements[i];

        let eventTouch = event;
        
        this.currentY = target.offsetTop;
        this.startY = eventTouch.pageY - this.currentY;
        
        this.maxY = this.elementSliderLine.offsetHeight;

        const handleMove = event => this.onMove(this.modelState, event, i, target);
        document.addEventListener('mousemove', handleMove);
        document.addEventListener('touchmove', handleMove);

        const handleStop = event => this.onStop(handleMove, handleStop, this.modelState, event, i, target);
        document.addEventListener('mouseup', handleStop);
        document.addEventListener('touchend', handleStop);
    }
    onMove(modelState, event, i, target) {
        let elements = this.sliderTouches;
        let eventTouch = event;
    
        this.currentY = eventTouch.pageY - this.startY;

        if (i === 0) {
            if(this.currentY > (elements[i + 1].offsetTop - target.offsetHeight)) {
                this.currentY = (elements[i + 1].offsetTop - target.offsetHeight);
            }
            if (this.currentY < 0) {
                this.currentY = 0;
            }
            target.style.top = this.currentY + 'px';
        }
        if (i > 0 && i < elements.length - 1) {
            if(this.currentY > (elements[i + 1].offsetTop - target.offsetHeight)) {
                this.currentY = (elements[i + 1].offsetTop - target.offsetHeight);
            } 
            if (this.currentY < (elements[i - 1].offsetTop + target.offsetHeight)) {
                this.currentY = (elements[i - 1].offsetTop + target.offsetHeight);
            }
            target.style.top = this.currentY + 'px';
        }
        if (i === elements.length - 1) {
            if (this.currentY < (elements[i - 1].offsetTop + target.offsetHeight)) {
                this.currentY = (elements[i - 1].offsetTop + target.offsetHeight);
            } 
            if(this.currentY > this.maxY) {
                this.currentY = this.maxY;
            }
            target.style.top = this.currentY + 'px';
        }
        
        // update line span
        this.elementSliderLineSpan.style.marginTop = elements[0].offsetTop + 'px';
        this.elementSliderLineSpan.style.height = (elements[elements.length -1].offsetTop - elements[0].offsetTop) + 'px';
        
        // write new value
        this.currentValue = this.calculateValue(this.modelState, event, i, target);

        const halfStep = Math.floor((this.currentValue + (modelState.step / 2)) * this.coefficientPoint) - this.shiftToMinValue;

        if (this.currentY > halfStep) {
            this.currentValue = this.currentValue + modelState.step;
        }
        if (this.modelState.touchsValues[i] != this.currentValue) {
            this.emitter.emit('view:touchsValues-changed', {currentValue: this.currentValue, index: i});
        }

        this.setCurrentTooltipValue(this.modelState, event, i);
      }
      onStop(handleMove, handleStop, modelState, event, i, target) {
        this.setCurrentTooltipValue(this.modelState, event, i);
        target.style.top = Math.ceil(this.coefficientPoint * this.currentValue) - this.shiftToMinValue  + 'px';

        document.removeEventListener('mousemove', handleMove);
        document.removeEventListener('touchmove', handleMove);
        document.removeEventListener('mouseup', handleStop);
        document.removeEventListener('touchend', handleStop);

        this.currentTouchIndex = null;
      }
      /* метод calculateValue рассчитывает текущее значение ползунка. 
    нужно высчитать из this.currentY текущеее значение ползунка которое
    необходимо будет передать в state.state модели через eventEmitter.
    при изменении this.currentY вызвать calculateValue из которой вернуть
    текущее преобразованное значение ползунка в emitter.emit, а в модели в 
    subscribe вызвать обработчик, который это значение запишет в state.state
    */
    calculateValue(modelState, event, i, target) {
        let currentValueX = Math.floor(this.currentY / this.coefficientPoint) + modelState.min;
        let multi = Math.floor(currentValueX / modelState.step);
        currentValueX = modelState.step * multi;

        return currentValueX;
    }
    /* метод setCurrentTooltipValue устанавливает текущее значение в тултип ползунка */
    setCurrentTooltipValue(modelState, event, i) {
        this.elementsSliderTooltipText[i].innerHTML = modelState.touchsValues[i];
    }
    /* метод hideTooltip скрывает туллтипы ползунков */
    hideTooltip() {
        const allTooltips = Array.from($(this.slider).find('.slider-tooltip'));
        for(let i = 0; i < allTooltips.length; i++) {
            allTooltips[i].classList.add('slider-tooltip-hide');
        }
    }
    /* метод showTooltip показывает тултипы ползунков */
    showTooltip() {
        const allTooltips = Array.from($(this.slider).find('.slider-tooltip'));
        for(let i = 0; i < allTooltips.length; i++) {
            allTooltips[i].classList.remove('slider-tooltip-hide');
        }
    }
}