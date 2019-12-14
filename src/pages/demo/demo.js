import {EventEmitter} from '../../slider/eventEmitter';

$( () => {
    $('.js-slider-test').slider();


    const elements = Array.from($('.js-slider-test'));
    console.log(elements);
    elements.forEach((element, index) => {
        let eventEmitter = new EventEmitter();

        const newConfig = {};

        eventEmitter.emit('newConfig-changed', newConfig);
        eventEmitter.subscribe('newConfig-changed', (newConfig) => {
            createInput(newConfig.amount);
        });

        const createElement = (teg, className, type, value) => {
            const element = document.createElement(teg);
            element.className = className;
            element.type = type;
            element.value = value;
        }
        const createInput = (state) => {
            const rangeOfValuesList = document.querySelector('.rangeOfValues-list');
            console.log(rangeOfValuesList);
            for(let i = 0; i < state.amount; i++) {
                const rangeOfValuesItem = createElement('li', 'rangeOfValues-item');
                const input = createElement('input', 'input-rangeOgValues', 'text', state.sliderTouchsStates[i]);

                rangeOfValuesItem.append(input);
                rangeOfValuesList.append(rangeOfValuesItem);
            }
            
        }
        //element.callMethodsetValuesFromTheNewConfig(newConfig);
        //element.subscribeToStateModel();

        // получить и передать новые введеные пользователем мин и макс значения слайдера 
        // из панели конфигураций в объект newConfig
        const minMaxValues = document.querySelectorAll('.minMaxValue');
        const minValue = minMaxValues[0];
        const maxValue = minMaxValues[1];

        minValue.addEventListener('blur', () => {
            const min = minValue.value;
            element.callMethodSetNewValueMin(min);
        });
        
        maxValue.addEventListener('blur', () => {
            const max = maxValue.value;
            element.callMethodSetNewValueMax(max);
        });

        // получить и передать новое значение количества ползунков введенное пользователем
        // из панели конфигураций в объект newConfig
        const amountSliderTouches = document.querySelector('.field-group-numberValues-container__content');

        amountSliderTouches.addEventListener('blur', () => {
            const amount = amountSliderTouches.value;
            element.callMethodSetNewValueAmount(amount);
        });

        // получить и передать новые значения текущих состояний ползунков введенных пользователем
        // из панели конфигураций в объект newConfig
        const inputsSliderTouchs = document.querySelectorAll('.input-rangeOfValues');

        for(let i = 0; i < inputsSliderTouchs.length; i++) {
            inputsSliderTouchs[i].addEventListener('blur', () => {
                const touchValue = inputsSliderTouchs[i].value;
                element.callMethodSetNewValueSliderTouchsStates(touchValue, i);
            })
        }

        // получить и передать новое значение размера шага введенного пользователем
        // из панели конфигураций в объект newConfig
        const stepSize = document.querySelector('.field-group-stepSize-container__content');

        stepSize.addEventListener('blur', () => {
            const step = stepSize.value;
            element.callMethodSetNewValueStep(step);
        });

        // получить и передать новое значение ориентации слайдера
        const orientationSlider = document.querySelectorAll('.radio-button-container');

        for(let i = 0; i < orientationSlider.length; i++) {
            orientationSlider[i].addEventListener('click', () => {
                let orientation = '';
                if(i === 0) { orientation = 'horizontal';}
                if(i === 1) { orientation = 'vertical';}
                element.callMethodSetNewValueOrientation(orientation);
            })
        };
        // получить и передать новое значение наличия тултипа
        const checkboxContainer = document.querySelector('.checkbox-button-container');
        const checkboxInput = document.querySelector('.checkbox-button-container__content');

        checkboxContainer.addEventListener('click', () => {
            let checked = null;
            if(checkboxInput.checked === true) {
                checked = true;
            }
            if(checkboxInput.checked === false) {
                checked = false;
            }
            element.callMethodSetNewValueTooltip(checked);
        });
    });
});

