import {Controller} from './controller.js';

export class View {
    // дописать this туда куда нужно в конструкторе
    constructor(element) {
        console.log('view created', this, element),
        this.sliderTouches = [],

        this.slider = element

        /*this.normolizeFact = sliderTouch.offsetWidth;)*/
    }

    /* каким-то образом получить данные о количестве ползунков слайдера 
    из модели amount = currentConfig.amount*/

    createSlider(slider) {
        let amount = 3; //  TODO remove mock
        for(let i = 1; i <= amount; i++) {
            const sliderTouch = document.createElement('div');
            sliderTouch.className = "slider-touch";
            this.sliderTouches.push(sliderTouch);

            const sliderSpan = document.createElement('span');
            sliderSpan.className = "slider-span";

            sliderTouch.append(sliderSpan);
            this.slider.append(sliderTouch);
        }
        const sliderLine = document.createElement('div');
        sliderLine.className = "slider-line";

        const sliderLineSpan = document.createElement('span');
        sliderLineSpan.className = "slider-line-span";
        
        this.slider.append(sliderLine);
        sliderLine.append(sliderLineSpan);
    }
    /* функция reset устанавливает/сбрасывает настройки расположения ползунков 
    на начальные настройки по умолчанию.
    -найти все кнопки-ползунки внутри слайдера */ 
    reset(slider) {
        let elements = slider.querySelector(".slider-touch");
        let sumNormolizeFact = 0;
        for(let i = 0; i <= elements.length; i++) {
            elements[i].style.left = this.normolizeFact + sumNormolizeFact + 'px';
            sumNormlizeFact + this.normolizeFact;
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