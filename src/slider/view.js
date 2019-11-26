import {Controller} from './controller.js';

export class View {
    constructor(element, eventEmitter) {
        console.log('view created', this, element),
        this.slider = element,
        this.sliderTouches = [],
        this.elementSliderLineSpan,
        this.elementsSliderTooltipText =[],
        this.isCreatedSlider = false,
        this.startX = 0;
        this.maxX = 0;
        this.currentX = 0;

        this.emitter = eventEmitter,

        this.emitter.subscribe('model:state-changed', (state) => {
            if(!this.isCreatedSlider) {
                this.createSlider(state.amount);
                this.isCreatedSlider = true;
            }
            //this.reset();
            this.setValueSliderTouch(state.min, state.max, state.state);
            this.setTooltipsValues(state.state);
            this.eventDispatcher(state.state, state.min, state.max);
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
    }
    setNormolizeFact() {
        const sliderTouch = $(".slider-touch");
        const normolizeFact = sliderTouch[0].clientWidth;
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
    /* функция setValuesSliderTouch устанавливает полученное значение
     для каждой из кнопок-ползунков */
    setValueSliderTouch(min, max, arrState) {
        const normolizeFact = this.setNormolizeFact();
        let elements = this.sliderTouches;
        for(let i = 0; i < elements.length; i++) {
            let ratio = ((arrState[i] - min)/(max - min));
            elements[i].style.left = Math.ceil(ratio * (this.slider.offsetWidth - (elements[i].offsetWidth + normolizeFact))) + 'px';
            console.log("ширина элемента:" + elements[i].style.left);
        }
        this.elementSliderLineSpan.style.marginLeft = elements[0].offsetLeft + 'px';
        this.elementSliderLineSpan.style.width = (elements[elements.length - 1].offsetLeft - elements[0].offsetLeft) + 'px';
    }
    /* функция setTooltipsValues устанавливает значения ползунков
     в соответствующие им тултипы  */
    setTooltipsValues(arrState) {
        for(let i = 0; i < arrState.length; i++) {
            this.elementsSliderTooltipText[i].innerHTML = arrState[i];
        }
    }
    /* функция calculateValue рассчитывает текущее значение ползунка. 
    нужно высчитать из this.currentX текущеее значение ползунка которое
    необходимо будет передать в state.state модели через eventEmitter.
    при изменении this.currentX вызвать calculateValue из которой вернуть
    текущее преобразованное значение ползунка в emitter.emit, а в модели в 
    subscribe вызвать обработчик, который это значение запишет в state.state
    */
    calculateValue(i, state, min, max) {
        const normolizeFact = this.setNormolizeFact();
        let elements = this.sliderTouches;

        let currentState = state;
        let ratio = (this.currentX * (this.slider.offsetWidth - (elements[i].offsetWidth + normolizeFact)));
        let currentValueX = ratio * (max - min);
        currentState[i] = currentValueX;
        return currentState; 

    }
    eventDispatcher(state, min, max) {
        let elements = this.sliderTouches;
        // link events
        for(let i = 0; i < elements.length; i++) {
            elements[i].addEventListener('mousedown', event => this.onStart(state, min, max,event, i));
            elements[i].addEventListener('touchstart', event => this.onStart(state, min, max, event, i));
        }
    }
    onStart(state, min, max, event, i) {
        // Prevent default dragging of selected content
        event.preventDefault();
        let elements = this.sliderTouches;

        let target = elements[i];
        console.log(target);

        let eventTouch = event;
        
        this.currentX = target.offsetLeft;
        console.log("this.x:" + this.currentX);
        this.startX = eventTouch.pageX - this.currentX;
        console.log("eventTouch.pageX:" + eventTouch.pageX);
        console.log("startX:" + this.startX);
        this.maxX = this.startX + this.slider.offsetWidth;
        console.log("sliderWidth:" + this.slider.offsetWidth);
        console.log("maxX:" + this.maxX);

        document.addEventListener('mousemove', event => this.onMove(state, min, max, event, i));
        document.addEventListener('touchmove', event => this.onMove(state, min, max, event, i));
    }
    onMove(state, min, max, event, i) {
        console.log(i);
        let elements = this.sliderTouches;
        let eventTouch = event;
        console.log(eventTouch);
    
        this.currentX = eventTouch.pageX - this.startX;
        console.log("this.currentX(из onMove)" + this.currentX);
        if (i === 0) {
            if(this.currentX > (elements[i +1].offsetLeft - this.target.offsetWidth + 10)) {
                this.currentX = (elements[i + 1].offsetLeft - this.target.offsetWidth + 10);
            }
            if (this.currentX < this.startX) {
                this.currentX = this.startX;
            }
            this.target.style.left = this.currentX + 'px';
        }
        if (i > 0 && i < elements.length[i - 1]) {
            if(this.currentX > (elements[i +1].offsetLeft - this.target.offsetWidth + 10)) {
                this.currentX = (elements[i + 1].offsetLeft - this.target.offsetWidth + 10);
            } 
            if (this.currentX < (elements[i - 1].offsetLeft - this.target.offsetWidth + 10)) {
                this.currentX = (elements[i - 1].offsetLeft - this.target.offsetWidth + 10);
            }
            this.target.style.left = this.currentX + 'px';
        }
        if (i = elements.length[i - 1]) {
            if (this.currentX < (elements[i - 1].offsetLeft - this.target.offsetWidth + 10)) {
                this.currentX = (elements[i - 1].offsetLeft - this.target.offsetWidth + 10);
            } 
            if(this.currentX > maxX) {
                this.currentX = maxX;
            }
            this.target.style.left = this.currentX + 'px';
        }
        
        // update line span
        this.elementSliderLineSpan.style.marginLeft = elements[0].offsetLeft + 'px';
        this.elementSliderLineSpan.style.width = (elements[elements.length -1].offsetLeft - elements[0].offsetLeft) + 'px';
        
        // write new value
        this.calculateValue(state, min, max, event, i);

        document.addEventListener('mouseup', event => this.onStop(state, min, max, event, i));
        document.addEventListener('touchend', event => this.onStop(state, min, max, event, i));
      }
      onStop(state, min, max, event, i) {
        document.removeEventListener('mousemove', event => this.onMove(state, min, max, event, i));
        document.removeEventListener('mouseup', event => this.onStop(state, min, max, event, i));
        document.removeEventListener('touchmove', event => this.onMove(state, min, max, event, i));
        document.removeEventListener('touchend', event => this.onStop(state, min, max, event, i));
        
        this.target = null;
    
        // write new value
        //this.calculateValue(step, min, max);
      }
}