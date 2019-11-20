import {Controller} from './controller.js';

export class View {
    constructor(element, eventEmitter) {
        console.log('view created', this, element),
        this.slider = element,
        this.sliderTouches = [],
        this.elementSliderLineSpan,
        this.elementsSliderTooltipText =[],
        this.isCreatedSlider = false,

        this.emitter = eventEmitter,

        this.emitter.subscribe('model:state-changed', (state) => {
            if(!this.isCreatedSlider) {
                this.createSlider(state.amount);
                this.isCreatedSlider = true;
            }
            //this.reset();
            this.setValueSliderTouch(state.min, state.max, state.state);
            this.setTooltipsValues(state.state);
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
    calculateValue(step, min, max) {
        const normolizeFact = this.setNormolizeFact();
        let initialValue = this.elementSliderLineSpan.offsetWidth - normolizeFact;
        let elements = this.sliderTouches;

        let newValue = (this.elementSliderLineSpan.offsetWidth - normolizeFact) / initialValue;
        let minValue = this.elementSliderLineSpan.offsetLeft / initialValue;
        let maxValue = minValue + newValue;

        minValue = minValue * (max - min) + min;
        maxValue = maxValue * (max - min) + min;

        if (step > 0) {
            let multi = Math.floor((minValue / step));
            minValue = step * multi;
      
            multi = Math.floor((maxValue / step));
            maxValue = step * multi;
        }
        // link events
        for(let i = 0; i < elements.length; i++) {
            elements[i].addEventListener('mousedown', onStart);
            elements[i].addEventListener('touchstart', onStart);
        }
    }
}