import {EventEmitter} from '../../slider/eventEmitter';

$( () => {
    $('.js-slider-test').slider();


    const elements = Array.from($('.js-slider-test'));
    console.log(elements);

    elements.forEach((element, index) => {
        let isCreatedInput = false;

        const createElement = (teg, className, type, value) => {
            const element = document.createElement(teg);
            element.className = className;
            element.type = type;
            element.value = value;
            return element;
        }

        const createInput = (state) => {
            const rangeOfValuesList = document.querySelector('.rangeOfValues-list');

            for(let i = 0; i < state.amount; i++) {
                const rangeOfValuesItem = createElement('li', 'rangeOfValues-item', '', i+1);
                const input = createElement('input', 'input-rangeOfValues', 'text', state.touchsValues[i]);

                rangeOfValuesItem.append(input);
                rangeOfValuesList.append(rangeOfValuesItem);
            } 
            if(!isCreatedInput) {
                isCreatedInput = true;
            }
        }
        const changeAmountInputs = (state) => {
            let amountInputs = Array.from(document.querySelectorAll('.input-rangeOfValues'));
            console.log('вызвана changeAmountInputs');
            console.log('amountInputs.length' + amountInputs.length);
            console.log('state.touchsValues.length' + state.touchsValues.length);
            if (amountInputs.length < state.touchsValues.length) {
                console.log('я в условии amountInputs.length <');
                const missingAmount = state.touchsValues.length - amountInputs.length;
                console.log('missingAmount' + missingAmount);
                const rangeOfValuesList = document.querySelector('.rangeOfValues-list');

                for (let i = 1; i <= missingAmount; i++) {
                    const rangeOfValuesItem = createElement('li', 'rangeOfValues-item', '', i+1);
                    const input = createElement('input', 'input-rangeOfValues', 'text', state.touchsValues[i]);
    
                    rangeOfValuesItem.append(input);
                    rangeOfValuesList.append(rangeOfValuesItem); 
                }
            }
            if (amountInputs.length > state.touchsValues.length) {
                const excessAmount = amountInputs.length - state.touchsValues.length;
                let allTouches = Array.from($('.rangeOfValues-list').find('.rangeOfValues-item'));

                for (let i = 1; i <= excessAmount; i++) {
                    allTouches[allTouches.length - 1].remove();
                    allTouches.splice(-1, 1);
                }
                console.log(allTouches);
            }
        };
        let modelState = element.getState();
        createInput(modelState);

        let amountInputs = Array.from(document.querySelectorAll('.input-rangeOfValues'));
        

        element.subscribeToStateModel(createInput, isCreatedInput, amountInputs, changeAmountInputs);

        // получить и передать новые введеные пользователем мин и макс значения слайдера 
        // из панели конфигураций в объект newConfig
        const minMaxValues = document.querySelectorAll('.minMaxValue');
        const minValue = minMaxValues[0];
        const maxValue = minMaxValues[1];

        minValue.addEventListener('blur', () => {
            const min = minValue.value;
            element.setNewValueMin(min);
        });
        
        maxValue.addEventListener('blur', () => {
            const max = maxValue.value;
            element.setNewValueMax(max);
        });

        // получить и передать новое значение количества ползунков введенное пользователем
        // из панели конфигураций в объект newConfig
        const amountSliderTouches = document.querySelector('.field-group-numberValues-container__content');

        amountSliderTouches.addEventListener('blur', () => {
            const amount = amountSliderTouches.value;
            element.setNewValueAmount(amount);
        });

        // получить и передать новые значения текущих состояний ползунков введенных пользователем
        // из панели конфигураций в объект newConfig
        const inputsSliderTouchs = document.querySelectorAll('.input-rangeOfValues');
        console.log(inputsSliderTouchs);

        for(let i = 0; i < inputsSliderTouchs.length; i++) {
            inputsSliderTouchs[i].addEventListener('blur', () => {
                const touchValue = inputsSliderTouchs[i].value;
                element.setNewValueTouchsValues(touchValue, i);
            })
        }

        // получить и передать новое значение размера шага введенного пользователем
        // из панели конфигураций в объект newConfig
        const stepSize = document.querySelector('.field-group-stepSize-container__content');

        stepSize.addEventListener('blur', () => {
            const step = stepSize.value;
            element.setNewValueStep(step);
        });

        // получить и передать новое значение ориентации слайдера
        const orientationSlider = document.querySelectorAll('.radio-button-container');

        for(let i = 0; i < orientationSlider.length; i++) {
            orientationSlider[i].addEventListener('click', () => {
                let orientation = '';
                if(i === 0) { orientation = 'horizontal';}
                if(i === 1) { orientation = 'vertical';}
                element.setNewValueOrientation(orientation);
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
            element.setNewValueTooltip(checked);
        });
    });
});

