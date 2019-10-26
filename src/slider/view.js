class View {
    sliderTouch = document.createElement('div');
    sliderTouch.className = "slider-touch";
    sliderTouch.innerHTML = "<span></span>";

    sliderLine = document.createElement('div');
    sliderLine.className = "slider-line";
    sliderLine.innerHTML = "<span></span>";

    slider = document.getElementById('my-slider');

    /* каким-то образом получить данные о количестве ползунков слайдера */

    /* тут должна быть функция, которая будет создавать необходимое
    количество тачей основываясь на полученных данных о их количестве, что-то типа такой: 
    function getListContent() {
        let result = [];

        for(let i=1; i<=3; i++) {
            let li = document.createElement('li');
            li.append(i);
            result.push(li);
        }

        return result;
        }
*/
    document.slider.append(sliderTouch);
}