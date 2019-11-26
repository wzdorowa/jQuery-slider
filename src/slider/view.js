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
        this.x = 0;

        this.emitter = eventEmitter,

        this.emitter.subscribe('model:state-changed', (state) => {
            if(!this.isCreatedSlider) {
                this.createSlider(state.amount);
                this.isCreatedSlider = true;
            }
            //this.reset();
            this.setValueSliderTouch(state.min, state.max, state.state);
            this.setTooltipsValues(state.state);
            this.eventDispatcher(state.step, state.min, state.max);
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
    /* функция calculateValue рассчитывает текущее значение ползунка */
    calculateValue(step, min, max) {
        const normolizeFact = this.setNormolizeFact();
        let initialValue = this.elementSliderLineSpan.offsetWidth - normolizeFact;
        console.log("initialValue:" + initialValue);

        let newValue = (this.elementSliderLineSpan.offsetWidth - normolizeFact) / initialValue;
        let minValue = this.elementSliderLineSpan.offsetLeft / initialValue;
        console.log("minValue:" + minValue);
        let maxValue = minValue + newValue;
        console.log("maxValue:" + maxValue);

        minValue = minValue * (max - min) + min;
        console.log("minValue:" + minValue);
        maxValue = maxValue * (max - min) + min;
        console.log("maxValue:" + maxValue);

        if (step > 0) {
            let multi = Math.floor((minValue / step));
            minValue = step * multi;
            console.log("minValue:" + minValue);
      
            multi = Math.floor((maxValue / step));
            maxValue = step * multi;
            console.log("maxValue:" + maxValue);
        }
    }
    eventDispatcher() {
        let elements = this.sliderTouches;
        // link events
        for(let i = 0; i < elements.length; i++) {
            elements[i].addEventListener('mousedown', event => this.onStart(event, i));
            elements[i].addEventListener('touchstart', event => this.onStart(event, i));
        }
    }
    onStart(event, i) {
        // Prevent default dragging of selected content
        event.preventDefault();
        let elements = this.sliderTouches;

        let target = elements[i];
        console.log(target);

        let eventTouch = event;
        
        this.x = target.offsetLeft;
        console.log("this.x:" + this.x);
        this.startX = eventTouch.pageX - this.x;
        console.log("eventTouch.pageX:" + eventTouch.pageX);
        console.log("startX:" + this.startX);

        document.addEventListener('mousemove', event => this.onMove(event, i));
        document.addEventListener('touchmove', event => this.onMove(event, i));
    }
    onMove(event, i, step, min, max) {
        console.log(i);
        let elements = this.sliderTouches;
        let eventTouch = event;
        console.log(eventTouch);
        this.maxX = this.startX + this.slider.offsetWidth;
        console.log("sliderWidth:" + this.slider.offsetWidth);
        console.log("maxX:" + this.maxX);
    
        this.x = eventTouch.pageX - this.startX;
        console.log("this.x(из onMove)" + this.x);
        if (i === 0) {
            if(this.x > (elements[i +1].offsetLeft - this.target.offsetWidth + 10)) {
                this.x = (elements[i + 1].offsetLeft - this.target.offsetWidth + 10);
            }
            if (this.x < this.startX) {
                this.x = this.startX;
            }
            this.target.style.left = this.x + 'px';
        }
        if (i > 0 && i < elements.length[i - 1]) {
            if(this.x > (elements[i +1].offsetLeft - this.target.offsetWidth + 10)) {
                this.x = (elements[i + 1].offsetLeft - this.target.offsetWidth + 10);
            } 
            if (this.x < (elements[i - 1].offsetLeft - this.target.offsetWidth + 10)) {
                this.x = (elements[i - 1].offsetLeft - this.target.offsetWidth + 10);
            }
            this.target.style.left = this.x + 'px';
        }
        if (i = elements.length[i - 1]) {
            if (this.x < (elements[i - 1].offsetLeft - this.target.offsetWidth + 10)) {
                this.x = (elements[i - 1].offsetLeft - this.target.offsetWidth + 10);
            } 
            if(this.x > maxX) {
                this.x = maxX;
            }
            this.target.style.left = this.x + 'px';
        }
        
        // update line span
        this.elementSliderLineSpan.style.marginLeft = elements[0].offsetLeft + 'px';
        this.elementSliderLineSpan.style.width = (elements[elements.length -1].offsetLeft - elements[0].offsetLeft) + 'px';
        
        // write new value
        this.calculateValue(step, min, max);

        document.addEventListener('mouseup', event => this.onStop(event, i));
        document.addEventListener('touchend', event => this.onStop(event, i));
      }
      onStop(event, i, step, min, max) {
        document.removeEventListener('mousemove', event => this.onMove(event, i));
        document.removeEventListener('mouseup', event => this.onStop(event, i));
        document.removeEventListener('touchmove', event => this.onMove(event, i));
        document.removeEventListener('touchend', event => this.onStop(event, i));
        
        this.target = null;
    
        // write new value
        this.calculateValue(step, min, max);
      }
}