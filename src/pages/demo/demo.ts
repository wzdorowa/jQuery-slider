import {IModelState} from '../../slider/iModelState';
import {IHTMLElement} from '../../slider/iHTMLElement';

$( () => {
    $('.js-slider-test').slider();

    const elements: IHTMLElement[] = Array.from($('.js-slider-test')) as IHTMLElement[];

    elements.forEach((element: IHTMLElement) => {
        let isCreatedInput: boolean = false;

        const createElement = (teg: string, className: string, type: string, value: number) => {
            const element: IHTMLElement = document.createElement(teg) as IHTMLElement;
            element.className = className;
            element.type = type;
            element.value = value;
            return element;
        }

        const createInput = (state: IModelState) => {
            const rangeOfValuesList: IHTMLElement = document.querySelector('.rangeOfValues-list') as IHTMLElement;

            for(let i = 0; i < state.amount; i++) {
                const rangeOfValuesItem: HTMLElement = createElement('li', 'rangeOfValues-item', '', i+1);
                const input: HTMLElement = createElement('input', 'input-rangeOfValues', 'text', state.touchsValues[i]);

                rangeOfValuesItem.append(input);
                rangeOfValuesList.append(rangeOfValuesItem);
            } 
            if(!isCreatedInput) {
                isCreatedInput = true;
            }
        }
        const changeAmountInputs = (state: IModelState) => {
            let amountInputs: HTMLElement[] = Array.from(document.querySelectorAll('.input-rangeOfValues'));

            if (amountInputs.length < state.touchsValues.length) {
                const missingAmount: number = state.touchsValues.length - amountInputs.length;
                const rangeOfValuesList: IHTMLElement = document.querySelector('.rangeOfValues-list') as IHTMLElement;

                new Array(missingAmount)
                    .fill(1)
                    .forEach((element: number, i: number) => {
                        let ArrayRangeOfValuesItem: NodeListOf<HTMLElement> = document.querySelectorAll('.rangeOfValues-item');
                        const rangeOfValuesItem: HTMLElement = createElement('li', 'rangeOfValues-item', '', ArrayRangeOfValuesItem.length + 1);
                        const input: HTMLElement = createElement('input', 'input-rangeOfValues', 'text', state.touchsValues[i]);
        
                        rangeOfValuesItem.append(input);
                        rangeOfValuesList.append(rangeOfValuesItem); 
    
                        setNewValueToNewInputs(state);
                    })
            }
            if (amountInputs.length > state.touchsValues.length) {
                const excessAmount: number = amountInputs.length - state.touchsValues.length;
                let allTouches: HTMLElement[] = Array.from($('.rangeOfValues-list').find('.rangeOfValues-item'));

                new Array(excessAmount)
                    .fill(1)
                    .forEach(() => {
                        allTouches[allTouches.length - 1].remove();
                        allTouches.splice(-1, 1);
                    })
            }
        };
        const setNewValueToNewInputs = (state: IModelState) => {
            let allTouches: IHTMLElement[] = Array.from($('.rangeOfValues-list').find('.input-rangeOfValues')) as IHTMLElement[];
            const indexNewInput: number = allTouches.length - 1;
            allTouches[indexNewInput].value = state.touchsValues[indexNewInput];
        }
        const setValueToInputFromModelState = (state: IModelState) => {
            let allTouches: IHTMLElement[] = Array.from($('.rangeOfValues-list').find('.input-rangeOfValues')) as IHTMLElement[];
            let touchsValuesLength = state.touchsValues.length - 1;

            new Array(touchsValuesLength)
                .fill(1)
                .forEach((element: number, i: number) => {
                    allTouches[i].value = state.touchsValues[i];
                })
        }
        const setValueToStepFromModelState = (state: IModelState) => {
            const stepSize: IHTMLElement = document.querySelector('.field-group-stepSize-container__content') as IHTMLElement;
            stepSize.value = state.step;

        }
        const setValueToMinInputFromModelState = (state: IModelState) => {
            const MinInput: NodeListOf<IHTMLElement> = document.querySelectorAll('.minMaxValue') as NodeListOf<IHTMLElement>;
            MinInput[0].value = state.min;
        }
        const setValueMaxInputFromModelState = (state: IModelState) => {
            const MaxInput: NodeListOf<IHTMLElement> = document.querySelectorAll('.minMaxValue') as NodeListOf<IHTMLElement>;
            MaxInput[1].value = state.max;
        }

        let modelState: IModelState = element.getState();
        createInput(modelState);
        setValueToStepFromModelState(modelState);
        setValueToMinInputFromModelState(modelState);
        setValueMaxInputFromModelState(modelState);

        const amountInputs = () => {
            const amountInputs: IHTMLElement[] = Array.from(document.querySelectorAll('.input-rangeOfValues'));
            return amountInputs;
        }
    
        element.subscribeToStateModel(createInput, isCreatedInput, amountInputs, changeAmountInputs,
             setValueToInputFromModelState, setValueToStepFromModelState, setValueToMinInputFromModelState,
             setValueMaxInputFromModelState);

        // получить и передать новые введеные пользователем мин и макс значения слайдера 
        // из панели конфигураций в объект newConfig
        const minMaxValues: NodeListOf<IHTMLElement> = document.querySelectorAll('.minMaxValue');
        const minValue: IHTMLElement = minMaxValues[0];
        const maxValue: IHTMLElement = minMaxValues[1];

        minValue.addEventListener('blur', () => {
            const min: number = Number(minValue.value);
            element.setNewValueMin(min);
        });
        maxValue.addEventListener('blur', () => {
            const max: number = Number(maxValue.value);
            element.setNewValueMax(max);
        });

        // получить и передать новое значение количества ползунков введенное пользователем
        // из панели конфигураций в объект newConfig
        let amountSliderTouches: IHTMLElement = document.querySelector('.field-group-numberValues-container__content') as IHTMLElement;

        amountSliderTouches.addEventListener('blur', () => {
            const amount: number = Number(amountSliderTouches.value);
            element.setNewValueAmount(amount);
        });
        // получить и передать новые значения текущих состояний ползунков введенных пользователем
        // из панели конфигураций в объект newConfig
        const toFindinputsSliderTouchs = (): NodeListOf<IHTMLElement> => {
            return document.querySelectorAll('.input-rangeOfValues');
        };
        let inputsSliderTouchs: NodeListOf<IHTMLElement> = toFindinputsSliderTouchs();

        for(let i = 0; i < inputsSliderTouchs.length; i++) {
            inputsSliderTouchs[i].addEventListener('blur', () => {
                const touchValue: number = Number(inputsSliderTouchs[i].value);
                element.setNewValueTouchsValues(touchValue, i);
            })
        };

        // получить и передать новое значение размера шага введенного пользователем
        // из панели конфигураций в объект newConfig
        let stepSize: IHTMLElement = document.querySelector('.field-group-stepSize-container__content') as IHTMLElement;

        stepSize.addEventListener('blur', () => {
            const step: number = Number(stepSize.value);
            element.setNewValueStep(step);
        });

        // получить и передать новое значение ориентации слайдера
        let orientationSlider: NodeListOf<IHTMLElement> = document.querySelectorAll('.radio-button-container');

        for(let i = 0; i < orientationSlider.length; i++) {
            orientationSlider[i].addEventListener('click', () => {
                let orientation: string = '';
                if(i === 0) { orientation = 'horizontal';}
                if(i === 1) { orientation = 'vertical';}
                element.setNewValueOrientation(orientation);
            })
        };

        // получить и передать новое значение наличия тултипа
        let checkboxContainer: IHTMLElement = document.querySelector('.checkbox-button-container') as IHTMLElement;
        let checkboxInput: IHTMLElement = document.querySelector('.checkbox-button-container__content') as IHTMLElement;

        checkboxContainer.addEventListener('click', () => {
            let checked: boolean = true;
            if(checkboxInput.checked === true) {
                checked = true;
            }
            if(checkboxInput.checked === false) {
                checked = false;
            }
            element.setNewValueTooltip(checked);
        });

        const setValueOfInputsSliderTouchs = () => {
            let inputsSliderTouchs: NodeListOf<IHTMLElement> = toFindinputsSliderTouchs();
            for(let i = 0; i < inputsSliderTouchs.length; i++) {
                const touchValue: number = Number(inputsSliderTouchs[i].value);
                element.setNewValueTouchsValues(touchValue, i);
            }
        }

        let form: IHTMLElement = document.querySelector('.panel-configuration') as IHTMLElement;
         form.addEventListener('submit', (): void => {
            const currentEvent: Event = event as Event;
            currentEvent.preventDefault();

            const min: number = Number(minValue.value);
            element.setNewValueMin(min);

            const max: number = Number(maxValue.value);
            element.setNewValueMax(max);

            const amount: number = Number(amountSliderTouches.value);
            element.setNewValueAmount(amount);

            setValueOfInputsSliderTouchs();

            const step: number = Number(stepSize.value);
            element.setNewValueStep(step);
         });
    });
});

