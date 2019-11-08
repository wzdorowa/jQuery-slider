import {Controller} from './controller.js';

export class View {
    // дописать this туда куда нужно в конструкторе
    constructor(element) {
        console.log('view created', this, element),
        this.sliderTouches = [],

        this.slider = element
    }

    /* каким-то образом получить данные о количестве ползунков слайдера 
    из модели amount = currentConfig.amount*/
    createElement(teg, className) {
        const element = document.createElement(teg);
        element.className = className;
        return element;
    }
    createSlider() {
        let amount = 3; //  TODO remove mock
        for(let i = 1; i <= amount; i++) {
            const sliderTouch = this.createElement('div', 'slider-touch');
            const sliderSpan = this.createElement('span', 'slider-span');

            sliderTouch.append(sliderSpan);
            this.slider.append(sliderTouch);
            this.sliderTouches.push(sliderTouch);
        }
        const sliderLine = this.createElement('div', 'slider-line');
        const sliderLineSpan = this.createElement('span', 'slider-line-span');
        
        this.slider.append(sliderLine);
        sliderLine.append(sliderLineSpan);
    }
    setNormolizeFact() {
        const sliderTouch = $(".slider-touch");
        const normolizeFact = sliderTouch[0].clientWidth;
        return normolizeFact;
    }
    /* функция reset устанавливает/сбрасывает настройки расположения ползунков 
    на начальные настройки по умолчанию.
    -найти все кнопки-ползунки внутри слайдера */ 
    reset() {
        const normolizeFact = this.setNormolizeFact();
        console.log(normolizeFact);
        let elements = this.sliderTouches;
        console.log(elements);
        for(let i = 1; i < elements.length; i++) {
            elements[i].style.left = (normolizeFact * i) + 'px';
        }
        sliderLine.style.marginLeft = '0px';
        sliderLine.style.width = (slider.offsetWidth - (elements[elements.length - 1].offsetWidth)) + 'px';
    }
    /* функция setValuesSliderTouch устанавливает полученное значение
     для каждой из кнопок-ползунков */
    setValueSliderTouch(arrValue) {
        let elements = slider.querySelector(".slider-touch");
        for(let i = 0; i <= elements.length; i++) {
            let ratio = ((arrValue[i] - min)/(max - min));
            elements[i].style.left = Math.ceil(ratio * (slider.offsetWidth - (elements[i].offsetWidth + this.normolizeFact))) + 'px';
            this.sliderLine.style.marginLeft = elements[i].offsetLeft + 'px';
            this.sliderLine.style.width = (elements[elements.length - 1].offsetLeft - elements[0].offsetLeft) + 'px';
        }
    }
}