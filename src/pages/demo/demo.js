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

            if (amountInputs.length < state.touchsValues.length) {
                const missingAmount = state.touchsValues.length - amountInputs.length;
                const rangeOfValuesList = document.querySelector('.rangeOfValues-list');

                for (let i = 1; i <= missingAmount; i++) {
                    let ArrayRangeOfValuesItem = document.querySelectorAll('.rangeOfValues-item');
                    const rangeOfValuesItem = createElement('li', 'rangeOfValues-item', '', (ArrayRangeOfValuesItem.length + 1));
                    const input = createElement('input', 'input-rangeOfValues', 'text', state.touchsValues[i]);
    
                    rangeOfValuesItem.append(input);
                    rangeOfValuesList.append(rangeOfValuesItem); 

                    setNewValueToNewInputs(state);
                }
            }
            if (amountInputs.length > state.touchsValues.length) {
                const excessAmount = amountInputs.length - state.touchsValues.length;
                let allTouches = Array.from($('.rangeOfValues-list').find('.rangeOfValues-item'));

                for (let i = 1; i <= excessAmount; i++) {
                    allTouches[allTouches.length - 1].remove();
                    allTouches.splice(-1, 1);
                }
            }
        };
        const setNewValueToNewInputs = (state) => {
            let allTouches = Array.from($('.rangeOfValues-list').find('.input-rangeOfValues'));
            const indexNewInput = allTouches.length - 1;
            allTouches[indexNewInput].value = state.touchsValues[indexNewInput];
        }
        const setValueToInputFromModelState = (state) => {
            let allTouches = Array.from($('.rangeOfValues-list').find('.input-rangeOfValues'));
            for (let i = 0; i <= state.touchsValues.length - 1; i++) {
                allTouches[i].value = state.touchsValues[i];
            }
        }
        const setValueToStepFromModelState = (state) => {
            const stepSize = document.querySelector('.field-group-stepSize-container__content');
            stepSize.value = state.step;

        }
        const setValueToMinInputFromModelState = (state) => {
            const MinInput = document.querySelectorAll('.minMaxValue');
            MinInput[0].value = state.min;
        }
        const setValueMaxInputFromModelState = (state) => {
            const MaxInput = document.querySelectorAll('.minMaxValue');
            MaxInput[1].value = state.max;
        }

        let modelState = element.getState();
        createInput(modelState);
        setValueToStepFromModelState(modelState);
        setValueToMinInputFromModelState(modelState);
        setValueMaxInputFromModelState(modelState);

        const amountInputs = () => {
            const amountInputs = Array.from(document.querySelectorAll('.input-rangeOfValues'));
            return amountInputs;
        }
    
        element.subscribeToStateModel(createInput, isCreatedInput, amountInputs, changeAmountInputs,
             setValueToInputFromModelState, setValueToStepFromModelState, setValueToMinInputFromModelState,
             setValueMaxInputFromModelState);

        // получить и передать новые введеные пользователем мин и макс значения слайдера 
        // из панели конфигураций в объект newConfig
        const minMaxValues = document.querySelectorAll('.minMaxValue');
        console.log('minMaxValues', minMaxValues);
        const minValue = minMaxValues[0];
        console.log('minValue', minValue);
        const maxValue = minMaxValues[1];
        console.log('maxValue', maxValue);

        const getMinValue = () => {
            return Number(minValue.value);
        };
        const getMaxValue = () => {
            return Number(maxValue.value);
        }
        const getAmountSliderTouches = () => {
            return Number(amountSliderTouches.value);
        }
        const getInputsSliderTouchs = (i) => {
            return Number(inputsSliderTouchs[i].value);
        }
        const getStepSize = () => {
            return Number(stepSize.value);
        }

        minValue.addEventListener('blur', () => {
            const min = getMinValue();
            element.setNewValueMin(min);
        });
        maxValue.addEventListener('blur', () => {
            const max = getMaxValue();
            element.setNewValueMax(max);
        });

        // получить и передать новое значение количества ползунков введенное пользователем
        // из панели конфигураций в объект newConfig
        const amountSliderTouches = document.querySelector('.field-group-numberValues-container__content');

        amountSliderTouches.addEventListener('blur', () => {
            const amount = getAmountSliderTouches();
            element.setNewValueAmount(amount);
        });

        // получить и передать новые значения текущих состояний ползунков введенных пользователем
        // из панели конфигураций в объект newConfig
        const inputsSliderTouchs = document.querySelectorAll('.input-rangeOfValues');

        for(let i = 0; i < inputsSliderTouchs.length; i++) {
            inputsSliderTouchs[i].addEventListener('blur', () => {
                const touchValue = getInputsSliderTouchs(i);
                element.setNewValueTouchsValues(touchValue, i);
            })
        }

        // получить и передать новое значение размера шага введенного пользователем
        // из панели конфигураций в объект newConfig
        const stepSize = document.querySelector('.field-group-stepSize-container__content');

        stepSize.addEventListener('blur', () => {
            const step = getStepSize();
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

        let form = document.querySelector('.panel-configuration');
        console.log(form);
         form.addEventListener('submit', () => {
            event.preventDefault();
            console.log('я в onsubmit');

            const min = getMinValue();
            element.setNewValueMin(min);

            const max = getMaxValue();
            element.setNewValueMax(max);

            const amount = getAmountSliderTouches();
            element.setNewValueAmount(amount);

            for(let i = 0; i < inputsSliderTouchs.length; i++) {
                const touchValue = getInputsSliderTouchs(i);
                element.setNewValueTouchsValues(touchValue, i);
            }

            const step = getStepSize();
            element.setNewValueStep(step);
         });
    });
});

