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
            console.log('getValue.minValue' + getValue);

            newConfig.min = getValue; 
            console.log('newConfig.min' + newConfig.min);
        });
        
        maxValue.addEventListener('blur', () => {
            const getValue = maxValue.value;
            console.log('getValue.maxValue' + getValue);

            newConfig.max = getValue; 
            console.log('newConfig.max' + newConfig.max);
        });

        // получить и передать новое значение количества ползунков введенное пользователем
        // из панели конфигураций в объект newConfig
        const amountSliderTouches = document.querySelector('.field-group-numberValues-container__content');

        amountSliderTouches.addEventListener('blur', () => {
            const getValue = amountSliderTouches.value;
            console.log('getValue.amount' + getValue);

            newConfig.amount = getValue;
            console.log('newConfig.amount' + newConfig.amount)
        });

        // получить и передать новые значения текущих состояний ползунков введенных пользователем
        // из панели конфигураций в объект newConfig
        const inputsSliderTouchs = document.querySelectorAll('.input-rangeOfValues');

        for(let i = 0; i < inputsSliderTouchs.length; i++) {
            inputsSliderTouchs[i].addEventListener('blur', () => {
                const getValue = inputsSliderTouchs[i].value;
                console.log('getValue.inputsSliderTouchs' + getValue);

                newConfig.sliderTouchsStates[i] = getValue;
                console.log('newConfig.sliderTouchsStates[i]' + newConfig.sliderTouchsStates[i])
            })
        }

        // получить и передать новое значение размера шага введенного пользователем
        // из панели конфигураций в объект newConfig
        const stepSize = document.querySelector('.field-group-stepSize-container__content');

        stepSize.addEventListener('blur', () => {
            const getValue = stepSize.value;
            console.log('getValue.stepSize' + getValue);

            newConfig.step = getValue;
            console.log('newConfig.step' + newConfig.step);
        })
    });
});

