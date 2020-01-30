import $ = require ('jquery');
import {EventEmitter} from '../../slider/eventEmitter';

interface StateObject {
    min: number
    max: number,
    touchsValues: number[],
    orientation: string,
    amount: number,
    step: number,
    tooltip: boolean,
}
interface IMyElement extends HTMLElement {
    type: string
    value: number
    checked: boolean
    getState: any;
    setNewValueMin: any
    setNewValueMax: any
    setNewValueAmount: any
    setNewValueTouchsValues: any
    setNewValueStep: any
    setNewValueOrientation: any
    setNewValueTooltip: any
    subscribeToStateModel: any
  }

$( () => {
    $('.js-slider-test').slider();

    const elements: IMyElement[] = Array.from($('.js-slider-test')) as IMyElement[];

    elements.forEach((element: IMyElement) => {
        let isCreatedInput: boolean = false;

        const createElement = (teg: string, className: string, type: string, value: number) => {
            const element: IMyElement = document.createElement(teg) as IMyElement;
            element.className = className;
            element.type = type;
            element.value = value;
            return element;
        }

        const createInput = (state: StateObject) => {
            const rangeOfValuesList = document.querySelector('.rangeOfValues-list');

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
        const changeAmountInputs = (state: StateObject) => {
            let amountInputs: HTMLElement[] = Array.from(document.querySelectorAll('.input-rangeOfValues'));

            if (amountInputs.length < state.touchsValues.length) {
                const missingAmount: number = state.touchsValues.length - amountInputs.length;
                const rangeOfValuesList: HTMLElement = document.querySelector('.rangeOfValues-list');

                for (let i = 1; i <= missingAmount; i++) {
                    let ArrayRangeOfValuesItem: NodeListOf<HTMLElement> = document.querySelectorAll('.rangeOfValues-item');
                    const rangeOfValuesItem: HTMLElement = createElement('li', 'rangeOfValues-item', '', ArrayRangeOfValuesItem.length + 1);
                    const input: HTMLElement = createElement('input', 'input-rangeOfValues', 'text', state.touchsValues[i]);
    
                    rangeOfValuesItem.append(input);
                    rangeOfValuesList.append(rangeOfValuesItem); 

                    setNewValueToNewInputs(state);
                }
            }
            if (amountInputs.length > state.touchsValues.length) {
                const excessAmount: number = amountInputs.length - state.touchsValues.length;
                let allTouches: HTMLElement[] = Array.from($('.rangeOfValues-list').find('.rangeOfValues-item'));

                for (let i = 1; i <= excessAmount; i++) {
                    allTouches[allTouches.length - 1].remove();
                    allTouches.splice(-1, 1);
                }
            }
        };
        const setNewValueToNewInputs = (state: StateObject) => {
            let allTouches: IMyElement[] = Array.from($('.rangeOfValues-list').find('.input-rangeOfValues')) as IMyElement[];
            const indexNewInput: number = allTouches.length - 1;
            allTouches[indexNewInput].value = state.touchsValues[indexNewInput];
        }
        const setValueToInputFromModelState = (state: StateObject) => {
            let allTouches: IMyElement[] = Array.from($('.rangeOfValues-list').find('.input-rangeOfValues')) as IMyElement[];
            for (let i = 0; i <= state.touchsValues.length - 1; i++) {
                allTouches[i].value = state.touchsValues[i];
            }
        }
        const setValueToStepFromModelState = (state: StateObject) => {
            const stepSize: IMyElement = document.querySelector('.field-group-stepSize-container__content') as IMyElement;
            stepSize.value = state.step;

        }
        const setValueToMinInputFromModelState = (state: StateObject) => {
            const MinInput: NodeListOf<IMyElement> = document.querySelectorAll('.minMaxValue') as NodeListOf<IMyElement>;
            MinInput[0].value = state.min;
        }
        const setValueMaxInputFromModelState = (state: StateObject) => {
            const MaxInput: NodeListOf<IMyElement> = document.querySelectorAll('.minMaxValue') as NodeListOf<IMyElement>;
            MaxInput[1].value = state.max;
        }

        let modelState: StateObject = element.getState();
        createInput(modelState);
        setValueToStepFromModelState(modelState);
        setValueToMinInputFromModelState(modelState);
        setValueMaxInputFromModelState(modelState);

        const amountInputs = () => {
            const amountInputs: IMyElement[] = Array.from(document.querySelectorAll('.input-rangeOfValues'));
            return amountInputs;
        }
    
        element.subscribeToStateModel(createInput, isCreatedInput, amountInputs, changeAmountInputs,
             setValueToInputFromModelState, setValueToStepFromModelState, setValueToMinInputFromModelState,
             setValueMaxInputFromModelState);

        // получить и передать новые введеные пользователем мин и макс значения слайдера 
        // из панели конфигураций в объект newConfig
        const minMaxValues: NodeListOf<IMyElement> = document.querySelectorAll('.minMaxValue');
        const minValue: IMyElement = minMaxValues[0];
        const maxValue: IMyElement = minMaxValues[1];

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
        let amountSliderTouches: IMyElement = document.querySelector('.field-group-numberValues-container__content');

        amountSliderTouches.addEventListener('blur', () => {
            const amount: number = Number(amountSliderTouches.value);
            element.setNewValueAmount(amount);
        });
        // получить и передать новые значения текущих состояний ползунков введенных пользователем
        // из панели конфигураций в объект newConfig
        const toFindinputsSliderTouchs = (): NodeListOf<IMyElement> => {
            return document.querySelectorAll('.input-rangeOfValues');
        };
        let inputsSliderTouchs: NodeListOf<IMyElement> = toFindinputsSliderTouchs();

        for(let i = 0; i < inputsSliderTouchs.length; i++) {
            inputsSliderTouchs[i].addEventListener('blur', () => {
                const touchValue: number = Number(inputsSliderTouchs[i].value);
                element.setNewValueTouchsValues(touchValue, i);
            })
        };

        // получить и передать новое значение размера шага введенного пользователем
        // из панели конфигураций в объект newConfig
        let stepSize: IMyElement = document.querySelector('.field-group-stepSize-container__content');

        stepSize.addEventListener('blur', () => {
            const step: number = Number(stepSize.value);
            element.setNewValueStep(step);
        });

        // получить и передать новое значение ориентации слайдера
        let orientationSlider: NodeListOf<IMyElement> = document.querySelectorAll('.radio-button-container');

        for(let i = 0; i < orientationSlider.length; i++) {
            orientationSlider[i].addEventListener('click', () => {
                let orientation: string = '';
                if(i === 0) { orientation = 'horizontal';}
                if(i === 1) { orientation = 'vertical';}
                element.setNewValueOrientation(orientation);
            })
        };

        // получить и передать новое значение наличия тултипа
        let checkboxContainer: IMyElement = document.querySelector('.checkbox-button-container');
        let checkboxInput: IMyElement = document.querySelector('.checkbox-button-container__content');

        checkboxContainer.addEventListener('click', () => {
            let checked: boolean | null = null;
            if(checkboxInput.checked === true) {
                checked = true;
            }
            if(checkboxInput.checked === false) {
                checked = false;
            }
            element.setNewValueTooltip(checked);
        });

        const setValueOfInputsSliderTouchs = () => {
            let inputsSliderTouchs: NodeListOf<IMyElement> = toFindinputsSliderTouchs();
            for(let i = 0; i < inputsSliderTouchs.length; i++) {
                const touchValue: number = Number(inputsSliderTouchs[i].value);
                element.setNewValueTouchsValues(touchValue, i);
            }
        }

        let form: IMyElement = document.querySelector('.panel-configuration');
         form.addEventListener('submit', () => {
            event.preventDefault();

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

