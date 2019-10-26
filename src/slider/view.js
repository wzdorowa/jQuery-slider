class View {
    sliderTouch = document.createElement('div');
    sliderTouch.className = "slider-touch";
    sliderTouch.innerHTML = "<span></span>";

    sliderLine = document.createElement('div');
    sliderLine.className = "slider-line";
    sliderLine.innerHTML = "<span></span>";

    slider = document.getElementById('my-slider');

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