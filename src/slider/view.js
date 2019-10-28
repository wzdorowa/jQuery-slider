class View {
    // дописать this туда куда нужно в конструкторе
    constructor(id) {
        this.sliderTouch = document.createElement('div');
        this.sliderTouch.className = "slider-touch";
        this.sliderTouch.innerHTML = "<span></span>";
        
        this.sliderLine = document.createElement('div');
        this.sliderLine.className = "slider-line";
        this.sliderLine.innerHTML = "<span></span>";

        this.slider = id;
    }

    /* каким-то образом получить данные о количестве ползунков слайдера 
    из модели amount = currentConfig.amount*/

    /* функция, которая будет создавать необходимое количество ползунков основываясь 
    на полученных данных о их количестве, что-то типа такой: */
    createSlider(slider) {
        for(let i = 1; i <= amount; i++) {
            document.slider.append(sliderTouch);
        }
        document.slider.append(sliderLine);
    }
}