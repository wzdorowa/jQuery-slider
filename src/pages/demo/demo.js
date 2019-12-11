import {Model} from '../../slider/model.js';

$( () => {
    $('.js-slider-test').slider();

    const elements = Array.from($('.js-slider-test'));
    console.log(elements);
    elements.forEach((element, index) => {
        const newConfig = {
            min: 0,
            max: 200,
            sliderTouchsStates: [0, 80, 200],
            orientation: 'horizontal',
            amount: 3,
            step: 4,
            tooltip: true,
        };
        console.log(element.pluginName);
        element.callMethodsetValuesFromTheNewConfig(newConfig);
    });
});

