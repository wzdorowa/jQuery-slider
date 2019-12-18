import {Controller} from './controller.js';

export class View {
    constructor(element, eventEmitter) {
        console.log('view created', this, element),
        this.slider = element,
        this.sliderTouches = [],
        this.elementSliderLine,
        this.elementSliderLineSpan,
        this.elementsSliderTooltipText =[],
        this.isCreatedSlider = false,
        this.coefficientPoint = null,
        this.startX = 0,
        this.maxX = 0,
        this.currentX = 0,
        this.currentValue,
        this.modelState = {},

        this.emitter = eventEmitter,

        this.emitter.subscribe('model:state-changed', (state) => {
            this.modelState = state;
            if(!this.isCreatedSlider) {
                this.createSlider(this.modelState);
                this.setValueSliderTouch(this.modelState);
                this.setTooltipsValues(this.modelState);
                this.listenSliderTouchesEvents(this.modelState);
                this.isCreatedSlider = true;
            }
        })
    }
    /* функция CreateElement создает необходимый элемент с заданным классом */
    createElement(teg, className) {
        const element = document.createElement(teg);
        element.className = className;
        return element;
    }
    /* функция CreateSlider создает основную html-структуру слайдера */
    createSlider(modelState) {
        for(let i = 1; i <= this.modelState.amount; i++) {
            const sliderTouch = this.createElement('div', 'slider-touch');
            const sliderSpan = this.createElement('span', 'slider-span');
            const sliderTooltip = this.createElement('div', 'slider-tooltip');
            const sliderTooltipText = this.createElement('span', 'slider-tooltip-text');

            sliderTouch.append(sliderSpan);
            sliderTouch.append(sliderTooltip);
            sliderTooltip.append(sliderTooltipText);
            this.slider.append(sliderTouch);
            this.sliderTouches.push(sliderTouch);
            this.elementsSliderTooltipText.push(sliderTooltipText);
        }
        const sliderLine = this.createElement('div', 'slider-line');
        const sliderLineSpan = this.createElement('span', 'slider-line-span');
        
        this.slider.append(sliderLine);
        sliderLine.append(sliderLineSpan);

        this.elementSliderLineSpan = sliderLineSpan;
        this.elementSliderLine = sliderLine;
    }
    /* функция setValuesSliderTouch устанавливает полученное по-умолчанию значение
     для каждой из кнопок-ползунков */
    setValueSliderTouch(modelState) {
        let elements = this.sliderTouches;
        this.coefficientPoint = (this.elementSliderLine.offsetWidth / (this.modelState.max - this.modelState.min));

        for(let i = 0; i < elements.length; i++) {
            elements[i].style.left = Math.ceil(this.coefficientPoint * this.modelState.touchsValues[i]) + 'px';
        }
        this.elementSliderLineSpan.style.marginLeft = elements[0].offsetLeft + 'px';
        this.elementSliderLineSpan.style.width = (elements[elements.length - 1].offsetLeft - elements[0].offsetLeft) + 'px';
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
        event.preventDefault();
        let elements = this.sliderTouches;

        let target = elements[i];

        let eventTouch = event;
        
        this.currentX = target.offsetLeft;
        this.startX = eventTouch.pageX - this.currentX;
        this.maxX = this.elementSliderLine.offsetWidth;

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
    
        this.currentX = eventTouch.pageX - this.startX;

        if (i === 0) {
            if(this.currentX > (elements[i + 1].offsetLeft - target.offsetWidth)) {
                this.currentX = (elements[i + 1].offsetLeft - target.offsetWidth);
            }
            if (this.currentX < 0) {
                this.currentX = 0;
            }
            target.style.left = this.currentX + 'px';
        }
        if (i > 0 && i < elements.length - 1) {
            if(this.currentX > (elements[i + 1].offsetLeft - target.offsetWidth)) {
                this.currentX = (elements[i + 1].offsetLeft - target.offsetWidth);
            } 
            if (this.currentX < (elements[i - 1].offsetLeft + target.offsetWidth)) {
                this.currentX = (elements[i - 1].offsetLeft + target.offsetWidth);
            }
            target.style.left = this.currentX + 'px';
        }
        if (i === elements.length - 1) {
            if (this.currentX < (elements[i - 1].offsetLeft + target.offsetWidth)) {
                this.currentX = (elements[i - 1].offsetLeft + target.offsetWidth);
            } 
            if(this.currentX > this.maxX) {
                this.currentX = this.maxX;
            }
            target.style.left = this.currentX + 'px';
        }
        
        // update line span
        this.elementSliderLineSpan.style.marginLeft = elements[0].offsetLeft + 'px';
        this.elementSliderLineSpan.style.width = (elements[elements.length -1].offsetLeft - elements[0].offsetLeft) + 'px';
        
        // write new value
        this.currentValue = this.calculateValue(this.modelState, event, i, target);

        const halfStep = Math.floor((this.currentValue + (modelState.step / 2)) * this.coefficientPoint);

        if (this.currentX > halfStep) {
            this.currentValue = this.currentValue + modelState.step;
        }

        this.emitter.emit('view:touchsValues-changed', {currentValue: this.currentValue, index: i});

        this.setCurrentTooltipValue(this.modelState, event, i);
      }
      onStop(handleMove, handleStop, modelState, event, i, target) {
        this.setCurrentTooltipValue(this.modelState, event, i);
        target.style.left = Math.ceil(this.coefficientPoint * this.currentValue) + 'px';

        document.removeEventListener('mousemove', handleMove);
        document.removeEventListener('touchmove', handleMove);
        document.removeEventListener('mouseup', handleStop);
        document.removeEventListener('touchend', handleStop);
      }
      /* метод calculateValue рассчитывает текущее значение ползунка. 
    нужно высчитать из this.currentX текущеее значение ползунка которое
    необходимо будет передать в state.state модели через eventEmitter.
    при изменении this.currentX вызвать calculateValue из которой вернуть
    текущее преобразованное значение ползунка в emitter.emit, а в модели в 
    subscribe вызвать обработчик, который это значение запишет в state.state
    */
    calculateValue(modelState, event, i, target) {
        let currentValueX = Math.floor(this.currentX / this.coefficientPoint);
        let multi = Math.floor(currentValueX / modelState.step);
        currentValueX = modelState.step * multi;

        return currentValueX;
    }
    /* метод setCurrentTooltipValue устанавливает текущее значение в тултип ползунка */
    setCurrentTooltipValue(modelState, event, i) {
        this.elementsSliderTooltipText[i].innerHTML = modelState.touchsValues[i];
    }
}