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

        // получить и передать новые введеные пользователем мин и макс значения слайдера 
        // из панели конфигураций в объект newConfig
        const minMaxValues = document.querySelectorAll('.minMaxValue');
        console.log(minMaxValues);
        const minValue = minMaxValues[0];
        const maxValue = minMaxValues[1];

        minValue.addEventListener('blur', () => {
            const getValue = minValue.value;
            console.log(getValue);

            newConfig.min = getValue; 
            console.log(newConfig.min);
        });
        
        maxValue.addEventListener('blur', () => {
            const getValue = maxValue.value;
            console.log(getValue);

            newConfig.max = getValue; 
            console.log(newConfig.max);
        });

    });
});

