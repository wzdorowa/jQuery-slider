import {configuratorHorizontal} from './ configuratorHorizontal.js';
import {configuratorVertical} from './configuratorVertical.js';

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
        this.startXorY = 0,
        this.maxXorY = 0,
        this.currentXorY = 0,
        this.currentValue,
        this.modelState = {},
        this.currentTouchIndex = null,
        this.configurator = null,
        this.currentOrientation = null,

        this.emitter = eventEmitter,

        this.emitter.subscribe('model:state-changed', (state) => {
            this.modelState = state;
            console.log('this.currentOrientation', this.currentOrientation);
            if (this.modelState.orientation === 'horizontal') {
                console.log('я в условии horizontal');
                this.configurator = configuratorHorizontal;
            }
            if (this.modelState.orientation === 'vertical') {
                console.log('я в условии vertical');
                this.configurator = configuratorVertical;
            }
            if (this.currentOrientation != this.modelState.orientation) {
                this.currentOrientation = this.modelState.orientation;
                console.log('я в условии currentOrientation');
                this.setWidthSliderContainer();
                console.log('this.configurator', this.configurator);
                if(this.isCreatedSlider) {
                    this.changeOrientation(); 
                    this.setValueSliderTouch(this.modelState);
                    this.setTooltipsValues(this.modelState);
                }
            }
            if(!this.isCreatedSlider) {
                this.createSlider();
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
        }),
        this.getCoefficientPoint = this.getCoefficientPoint.bind(this);
    }
    setWidthSliderContainer() {
        this.configurator.setWidthHeightSliderContainer(this.slider);
    }
    /* функция CreateElement создает необходимый элемент с заданным классом */
    createElement(teg, className) {
        const element = document.createElement(teg);
        element.className = className;
        return element;
    }
    /* функция CreateSlider создает основную html-структуру слайдера */
    createSlider() {
        for(let i = 1; i <= this.modelState.amount; i++) {
            const sliderTouch = this.createElement('div', 'slider-touch');
            const sliderSpan = this.createElement('span', 'slider-span');
            const sliderTooltip = this.createElement('div', 'slider-tooltip');
            const sliderTooltipText = this.configurator.createSliderTooltipText(this.createElement);

            sliderTouch.append(sliderSpan);
            sliderTouch.append(sliderTooltip);
            sliderTooltip.append(sliderTooltipText);
            this.slider.append(sliderTouch);
            this.sliderTouches.push(sliderTouch);
            this.elementsSliderTooltipText.push(sliderTooltipText);
        }
        const sliderLine = this.configurator.createSliderLine(this.createElement);
        const sliderLineSpan = this.createElement('div', 'slider-line-span');
        
        this.slider.append(sliderLine);
        sliderLine.append(sliderLineSpan);

        this.elementSliderLineSpan = sliderLineSpan;
        this.elementSliderLine = sliderLine;
    }
    changeAmountTouchs() {
        if (this.sliderTouches.length < this.modelState.amount) {
            const missingAmount = this.modelState.amount - this.sliderTouches.length;
            for (let i = 1; i <= missingAmount; i++) {
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

                this.setValueToNewTouch();
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
    changeOrientation() {
        const sliderTooltip = Array.from($(this.slider).find('.slider-tooltip'));
        this.elementsSliderTooltipText = [];
        const tooltipText = Array.from($(this.slider).find('.slider-tooltip-text'));
        for(let i = 0; i < tooltipText.length; i++) {
            tooltipText[i].remove();
        }
        for(let i = 0; i < sliderTooltip.length; i++) {
            const sliderTooltipText = this.configurator.createSliderTooltipText(this.createElement);
            sliderTooltip[i].append(sliderTooltipText);
            this.elementsSliderTooltipText.push(sliderTooltipText);
        }
        const sliderLineToDelete = $(this.slider).find('.slider-line');
        sliderLineToDelete.remove();

        const sliderLine = this.configurator.createSliderLine(this.createElement);
        const sliderLineSpan = this.configurator.createSliderLineSpan(this.createElement);

        this.slider.append(sliderLine);
        sliderLine.append(sliderLineSpan);

        this.elementSliderLine = sliderLine;
        this.elementSliderLineSpan = sliderLineSpan;
    }
    /* устанавливает значение для добавленного ползунка */
    setValueToNewTouch() {
        let allTouches = Array.from($(this.slider).find('.slider-touch'));
        const indexNewTouch = allTouches.length - 1;

        this.modelState.touchsValues[indexNewTouch] = (this.modelState.touchsValues[indexNewTouch -1] + (this.modelState.step * 2));
        this.emitter.emit('view:amountTouches-changed', this.modelState.touchsValues);
    }
    getCoefficientPoint() {
        return this.coefficientPoint = this.configurator.calculateCoefficientPoint(this.elementSliderLine, this.modelState.max, this.modelState.min);
    }
    /* функция setValuesSliderTouch устанавливает полученное по-умолчанию значение
     для каждой из кнопок-ползунков */
    setValueSliderTouch() {
        let elements = this.sliderTouches;
        this.configurator.calculateValueSliderTouch(elements, this.getCoefficientPoint, this.modelState, this.elementSliderLineSpan);
    }
    setNewValueSliderTouch() {
        let elements = this.sliderTouches;
        this.coefficientPoint = this.getCoefficientPoint();
        this.shiftToMinValue = Math.ceil(this.coefficientPoint * this.modelState.min);

        this.configurator.calculateNewValueSliderTouch(elements, this.currentTouchIndex, this.coefficientPoint, this.modelState, this.shiftToMinValue, this.elementSliderLineSpan);
    }
    /* функция setTooltipsValues устанавливает значения по-умолчанию ползунков
     в соответствующие им тултипы  */
    setTooltipsValues() {
        for(let i = 0; i < this.modelState.touchsValues.length; i++) {
            console.log('this.elementsSliderTooltipText', [i], this.elementsSliderTooltipText[i]);
            this.elementsSliderTooltipText[i].innerHTML = this.modelState.touchsValues[i];
        }
    }
    listenSliderTouchesEvents(modelState) {
        let elements = this.sliderTouches;
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
        
        this.currentXorY = this.configurator.setCurrentXorYtoOnStart(target);
        this.startXorY = this.configurator.setStartXorYtoOnStart(eventTouch, this.currentXorY);
        
        this.maxXorY = this.configurator.setMaxXorYtoOnStart(this.elementSliderLine);

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
    
        this.currentXorY = this.configurator.setCurrentXorYtoOnMove(eventTouch, this.startXorY);

        if (i === 0) {
            if(this.currentXorY > (elements[i + 1].offsetLeft - target.offsetWidth)) {
                this.currentXorY = (elements[i + 1].offsetLeft - target.offsetWidth);
            }
            if (this.currentXorY < 0) {
                this.currentXorY = 0;
            }
            this.configurator.setIndentForTarget(target, this.currentXorY);
        }
        if (i > 0 && i < elements.length - 1) {
            if(this.currentXorY > (elements[i + 1].offsetLeft - target.offsetWidth)) {
                this.currentXorY = (elements[i + 1].offsetLeft - target.offsetWidth);
            } 
            if (this.currentXorY < (elements[i - 1].offsetLeft + target.offsetWidth)) {
                this.currentXorY = (elements[i - 1].offsetLeft + target.offsetWidth);
            }
            this.configurator.setIndentForTarget(target, this.currentXorY);
        }
        if (i === elements.length - 1) {
            if (this.currentXorY < (elements[i - 1].offsetLeft + target.offsetWidth)) {
                this.currentXorY = (elements[i - 1].offsetLeft + target.offsetWidth);
            } 
            if(this.currentXorY > this.maxXorY) {
                this.currentXorY = this.maxXorY;
            }
            this.configurator.setIndentForTarget(target, this.currentXorY);
        }
        
        // update line span
        this.configurator.updateLineSpan(this.elementSliderLineSpan, elements);
        
        // write new value
        this.currentValue = this.calculateValue(this.modelState, event, i, target);

        const halfStep = Math.floor((this.currentValue + (modelState.step / 2)) * this.coefficientPoint) - this.shiftToMinValue;

        if (this.currentXorY > halfStep) {
            this.currentValue = this.currentValue + modelState.step;
        }
        if (this.modelState.touchsValues[i] != this.currentValue) {
            this.emitter.emit('view:touchsValues-changed', {currentValue: this.currentValue, index: i});
        }

        this.setCurrentTooltipValue(this.modelState, event, i);
      }
      onStop(handleMove, handleStop, modelState, event, i, target) {
        this.setCurrentTooltipValue(this.modelState, event, i);
        this.configurator.setIndentForTargetToOnStop(target, this.coefficientPoint, this.currentValue, this.shiftToMinValue);

        document.removeEventListener('mousemove', handleMove);
        document.removeEventListener('touchmove', handleMove);
        document.removeEventListener('mouseup', handleStop);
        document.removeEventListener('touchend', handleStop);

        this.currentTouchIndex = null;
      }
      /* метод calculateValue рассчитывает текущее значение ползунка. 
    нужно высчитать из this.currentXorY текущеее значение ползунка которое
    необходимо будет передать в state.state модели через eventEmitter.
    при изменении this.currentXorY вызвать calculateValue из которой вернуть
    текущее преобразованное значение ползунка в emitter.emit, а в модели в 
    subscribe вызвать обработчик, который это значение запишет в state.state
    */
    calculateValue(modelState, event, i, target) {
        let currentValueX = Math.floor(this.currentXorY / this.coefficientPoint) + modelState.min;
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