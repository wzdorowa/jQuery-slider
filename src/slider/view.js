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
        this.ratio = null,
        this.startX = 0;
        this.maxX = 0;
        this.currentX = 0;

        this.emitter = eventEmitter,

        this.emitter.subscribe('model:state-changed', (state) => {
            console.log("я тут"); 
            if(!this.isCreatedSlider) {
                this.createSlider(state.amount);
                this.setValueSliderTouch(state.min, state.max, state.sliderTouchsStates);
                this.listenSliderTouchesEvents(state.sliderTouchsStates, state.min, state.max);
                this.isCreatedSlider = true;
            }
            //this.reset();
            this.setTooltipsValues(state.sliderTouchsStates);
        })
    }
    /* функция CreateElement создает необходимый элемент с заданным классом */
    createElement(teg, className) {
        const element = document.createElement(teg);
        element.className = className;
        return element;
    }
    /* функция CreateSlider создает основную html-структуру слайдера */
    createSlider(amount) {
        for(let i = 1; i <= amount; i++) {
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
    setNormolizeFact() {
        const sliderTouch = $(".slider-touch");
        const normolizeFact = sliderTouch[0].clientWidth;
        console.log("normolizeFact:" + normolizeFact);
        return normolizeFact;
    }
    /* функция reset устанавливает/сбрасывает настройки расположения ползунков 
    на начальные настройки по умолчанию.*/
    reset() {
        const normolizeFact = this.setNormolizeFact();
        const sliderLineSpan = $(this.slider).find(".slider-line-span");
        let elements = this.sliderTouches;

        for(let i = 1; i < elements.length; i++) {
            elements[i].style.left = (normolizeFact * i) + 'px';
        }
        elements[elements.length - 1].style.left = (this.slider.offsetWidth - normolizeFact) + 'px';

        sliderLineSpan[0].style.marginLeft = '0px';
        sliderLineSpan[0].style.width = (this.slider.offsetWidth - normolizeFact) + 'px';
    }
    /* функция setValuesSliderTouch устанавливает полученное по-умолчанию значение
     для каждой из кнопок-ползунков */
    setValueSliderTouch(min, max, arrStates) {
        let elements = this.sliderTouches;
        for(let i = 0; i < elements.length; i++) {
            this.ratio = (this.elementSliderLine.offsetWidth / (max - min));
            elements[i].style.left = Math.ceil(this.ratio * arrStates[i]) + 'px';
        }
        this.elementSliderLineSpan.style.marginLeft = elements[0].offsetLeft + 'px';
        this.elementSliderLineSpan.style.width = (elements[elements.length - 1].offsetLeft - elements[0].offsetLeft) + 'px';
    }
    /* функция setTooltipsValues устанавливает значения по-умолчанию ползунков
     в соответствующие им тултипы  */
    setTooltipsValues(arrStates) {
        for(let i = 0; i < arrStates.length; i++) {
            this.elementsSliderTooltipText[i].innerHTML = arrStates[i];
            console.log('arrStates[i]:' + arrStates[i]);
        }
    }
    listenSliderTouchesEvents(arrStates, min, max) {
        let elements = this.sliderTouches;
        // link events
        for(let i = 0; i < elements.length; i++) {
            elements[i].addEventListener('mousedown', event => this.onStart(arrStates, min, max, event, i));
            elements[i].addEventListener('touchstart', event => this.onStart(arrStates, min, max, event, i));
        }
    }
    onStart(arrStates, min, max, event, i) {
        event.preventDefault();
        let elements = this.sliderTouches;

        let target = elements[i];

        let eventTouch = event;
        
        this.currentX = target.offsetLeft;
        this.startX = eventTouch.pageX - this.currentX;
        this.maxX = this.elementSliderLine.offsetWidth;

        const handleMove = event => this.onMove(arrStates, min, max, event, i, target);
        document.addEventListener('mousemove', handleMove);
        document.addEventListener('touchmove', handleMove);

        const handleStop = event => this.onStop(handleMove, handleStop);
        document.addEventListener('mouseup', handleStop);
        document.addEventListener('touchend', handleStop);
    }
    onMove(arrStates, min, max, event, i, target) {
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
        const currentValue = this.calculateValue(arrStates, min, max, event, i, target);
        const data = {
            currentValue: currentValue,
            index: i
        };
        this.emitter.emit('view:sliderTouchsStates-changed', data);

        this.setCurrentTooltipValue(arrStates, min, max, event, i);
      }
      onStop(handleMove, handleStop) {
        document.removeEventListener('mousemove', handleMove);
        document.removeEventListener('touchmove', handleMove);
        document.removeEventListener('mouseup', handleStop);
        document.removeEventListener('touchend', handleStop);
      }
      /* функция calculateValue рассчитывает текущее значение ползунка. 
    нужно высчитать из this.currentX текущеее значение ползунка которое
    необходимо будет передать в state.state модели через eventEmitter.
    при изменении this.currentX вызвать calculateValue из которой вернуть
    текущее преобразованное значение ползунка в emitter.emit, а в модели в 
    subscribe вызвать обработчик, который это значение запишет в state.state
    */
    calculateValue(arrStates, min, max, event, i) {
        let currentValueX = Math.floor(this.currentX / this.ratio);

        return currentValueX;
    }
    setCurrentTooltipValue(arrStates, min, max, event, i) {
        this.elementsSliderTooltipText[i].innerHTML = arrStates[i];
        console.log('arrStates[i]:' + arrStates[i]);
    }
}