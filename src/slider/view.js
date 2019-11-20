import {Controller} from './controller.js';

export class View {
    // дописать this туда куда нужно в конструкторе
    constructor(element, eventEmitter) {
        console.log('view created', this, element),
        this.slider = element,
        this.sliderTouches = [],
        this.elementSliderLineSpan,

        this.emitter = eventEmitter,

        this.emitter.subscribe('model:state-changed', (initialConfig) => {
            this.createSlider(initialConfig.amount);
            //this.reset();
            this.setValueSliderTouch(initialConfig.min, initialConfig.max, initialConfig.state);
            })
    }

    /* каким-то образом получить данные о количестве ползунков слайдера 
    из модели amount = currentConfig.amount*/
    createElement(teg, className) {
        const element = document.createElement(teg);
        element.className = className;
        return element;
    }
    createSlider(amount) {
        for(let i = 1; i <= amount; i++) {
            const sliderTouch = this.createElement('div', 'slider-touch');
            const sliderSpan = this.createElement('span', 'slider-span');
            const sliderTooltip = this.createElement('div', 'slider-tooltip');
            const sliderTooltipText = this.createElement('span', 'slider-tooltip-text');
            sliderTooltipText.innerHTML = 0;

            sliderTouch.append(sliderSpan);
            sliderTouch.append(sliderTooltip);
            sliderTooltip.append(sliderTooltipText);
            this.slider.append(sliderTouch);
            this.sliderTouches.push(sliderTouch);
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
        console.log(sliderLineSpan);
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
        console.log(elements);
        for(let i = 0; i < elements.length; i++) {
            let ratio = ((arrState[i] - min)/(max - min));
            elements[i].style.left = Math.ceil(ratio * (this.slider.offsetWidth - (elements[i].offsetWidth + normolizeFact))) + 'px';
            console.log(elements[i].style.left);
        }
        this.elementSliderLineSpan.style.marginLeft = elements[0].offsetLeft + 'px';
        this.elementSliderLineSpan.style.width = (elements[elements.length - 1].offsetLeft - elements[0].offsetLeft) + 'px';
    }
    setTooltipsValues(arrTooltipValues) {
        
    }
}