import {IModelState} from '../../slider/interfaces/iModelState';
import {IHTMLElement} from '../../slider/interfaces/iHTMLElement';

$( () => {
    $('.js-slider-test').slider();

    const elements: IHTMLElement[] = Array.from($('.js-slider-test'));

    elements.forEach((element: IHTMLElement, index: number) => {
        let isCreatedInput = false;

        const createElement = (teg: string, className: string) => {
            const element: IHTMLElement = document.createElement(teg) as IHTMLElement;
            element.className = className;
            return element;
        }

        const createInput = (state: IModelState) => {
            const rangeOfValuesList: IHTMLElement[] = Array.from(document.querySelectorAll('.rangeOfValues-list'));

            new Array(state.amount)
                .fill(1)
                .forEach((_element: number, i: number) => {
                    const rangeOfValuesItem: HTMLElement = createElement('li', 'rangeOfValues-item');
                    const rangeOfValuesSet: HTMLElement = createElement('div', 'rangeOfValues-set');
                    const input: HTMLElement = createElement('input', 'input-rangeOfValues');
                    input.setAttribute('type', 'text');
                    input.setAttribute('value', String(state.thumbsValues[i]));

                    const valueFrom: HTMLElement = createElement('input', 'input-rangeOfValues-from');
                    valueFrom.setAttribute('type', 'text');
                    if (i === 0) {
                        valueFrom.setAttribute('value', String(state.min));
                    } else {
                        valueFrom.setAttribute('value', String(state.thumbsValues[i - 1] + state.step));
                    }

                    const valueTo: HTMLElement = createElement('input', 'input-rangeOfValues-to');
                    valueTo.setAttribute('type', 'text');
                    valueTo.setAttribute('value', String(state.max));
                    if (i === state.amount - 1) {
                        valueTo.setAttribute('value', String(state.max));
                    } else {
                        valueTo.setAttribute('value', String(state.thumbsValues[i + 1] - state.step));
                    }
                    
                    rangeOfValuesItem.append(rangeOfValuesSet);
                    rangeOfValuesSet.append(input);
                    rangeOfValuesSet.append(valueFrom);
                    rangeOfValuesSet.append(valueTo)
                    rangeOfValuesList[index].append(rangeOfValuesItem);
                })
            if(!isCreatedInput) {
                isCreatedInput = true;
            }
        }
        const changeAmountInputs = (state: IModelState) => {
            const rangeOfValuesList: IHTMLElement[] = Array.from(document.querySelectorAll('.rangeOfValues-list'));
            const amountInputs: HTMLElement[] = Array.from($(rangeOfValuesList[index]).find('.rangeOfValues-set'));

            if (amountInputs.length < state.thumbsValues.length) {
                const missingAmount: number = state.thumbsValues.length - amountInputs.length;

                new Array(missingAmount)
                    .fill(1)
                    .forEach((_element: number, i: number) => {
                        const currentAmountInputs: HTMLElement[] = Array.from($(rangeOfValuesList[index]).find('.rangeOfValues-set'));
                        const rangeOfValuesItem: HTMLElement = createElement('li', 'rangeOfValues-item');
                        const rangeOfValuesSet: HTMLElement = createElement('div', 'rangeOfValues-set');
                        const input: HTMLElement = createElement('input', 'input-rangeOfValues');
                        input.setAttribute('type', 'text');
                        input.setAttribute('value', String(state.thumbsValues[i]));

                        const valueFrom: HTMLElement = createElement('input', 'input-rangeOfValues-from');
                        valueFrom.setAttribute('type', 'text');
                        valueFrom.setAttribute('value', String(state.thumbsValues[currentAmountInputs.length - 1] + state.step));

                        const valueTo: HTMLElement = createElement('input', 'input-rangeOfValues-to');
                        valueTo.setAttribute('type', 'text');
                        valueTo.setAttribute('value', String(state.max));
                        
                        rangeOfValuesItem.append(rangeOfValuesSet);
                        rangeOfValuesSet.append(input);
                        rangeOfValuesSet.append(valueFrom);
                        rangeOfValuesSet.append(valueTo)
                        rangeOfValuesList[index].append(rangeOfValuesItem);
    
                        setNewValueToNewInputs(state);
                    })
            }
            if (amountInputs.length > state.thumbsValues.length) {
                const excessAmount: number = amountInputs.length - state.thumbsValues.length;

                const rangeOfValuesList: IHTMLElement[] = Array.from(document.querySelectorAll('.rangeOfValues-list'));
                const allThumbs: HTMLElement[] = Array.from($(rangeOfValuesList[index]).find('.rangeOfValues-item'));

                new Array(excessAmount)
                    .fill(1)
                    .forEach(() => {
                        allThumbs[allThumbs.length - 1].remove();
                        allThumbs.splice(-1, 1);
                    })
            }
        };
        const setNewValueToNewInputs = (state: IModelState) => {
            const rangeOfValuesList: IHTMLElement[] = Array.from(document.querySelectorAll('.rangeOfValues-list'));

            const allThumbs: IHTMLElement[] = Array.from($(rangeOfValuesList[index]).find('.input-rangeOfValues'));
            const indexNewInput: number = allThumbs.length - 1;
            allThumbs[indexNewInput].value = state.thumbsValues[indexNewInput];
        }
        const setValueToInputFromModelState = (state: IModelState) => {
            const rangeOfValuesList: IHTMLElement[] = Array.from(document.querySelectorAll('.rangeOfValues-list'));

            const allThumbs: IHTMLElement[] = Array.from($(rangeOfValuesList[index]).find('.input-rangeOfValues'));
            const allValueFrom: IHTMLElement[] = Array.from($(rangeOfValuesList[index]).find('.input-rangeOfValues-from'));
            const allValueTo: IHTMLElement[] = Array.from($(rangeOfValuesList[index]).find('.input-rangeOfValues-to'));

            new Array(state.thumbsValues.length)
                .fill(1)
                .forEach((_element: number, i: number) => {
                    allThumbs[i].value = state.thumbsValues[i];
                    if (i === 0) {
                        if (state.thumbsValues.length === 1) {
                            allValueFrom[i].value = state.min;
                            allValueTo[i].value = state.max;
                        } else {
                            allValueFrom[i].value = state.min;
                            allValueTo[i].value = state.thumbsValues[i + 1] - state.step;
                        }
                    } else if (i === state.amount - 1) {
                        allValueFrom[i].value = state.thumbsValues[i - 1] + state.step;
                        allValueTo[i].value = state.max;
                    } else {
                        allValueFrom[i].value = state.thumbsValues[i - 1] + state.step;
                        allValueTo[i].value = state.thumbsValues[i + 1] - state.step;
                    }
                })
        }
        const setValueToStepFromModelState = (state: IModelState) => {
            const sliderConfig: IHTMLElement[] = Array.from(document.querySelectorAll('.slider-config'));
            
            const stepSizes: IHTMLElement[] = Array.from($(sliderConfig[index]).find('.field-group-stepSize-container__content'));
            const stepSize = stepSizes[0];
            stepSize.value = state.step;

        }
        const setValueToMinInputFromModelState = (state: IModelState) => {
            const sliderConfig: IHTMLElement[] = Array.from(document.querySelectorAll('.slider-config'));

            const MinInput: IHTMLElement[] = Array.from($(sliderConfig[index]).find('.minMaxValue'));
            MinInput[0].value = state.min;
        }
        const setValueMaxInputFromModelState = (state: IModelState) => {
            const sliderConfig: IHTMLElement[] = Array.from(document.querySelectorAll('.slider-config'));

            const MaxInput: IHTMLElement[] = Array.from($(sliderConfig[index]).find('.minMaxValue'));
            MaxInput[1].value = state.max;
        }

        const modelState: IModelState = element.getState();
        createInput(modelState);
        setValueToStepFromModelState(modelState);
        setValueToMinInputFromModelState(modelState);
        setValueMaxInputFromModelState(modelState);

        const amountInputs = () => {
            const sliderConfig: HTMLDivElement[] = Array.from(document.querySelectorAll('.slider-config'));

            const amountInputs: HTMLElement[] = Array.from($(sliderConfig[index]).find('.input-rangeOfValues'));
            return amountInputs;
        }
    
        element.subscribeToStateModel(createInput, isCreatedInput, amountInputs, changeAmountInputs,
             setValueToInputFromModelState, setValueToStepFromModelState, setValueToMinInputFromModelState,
             setValueMaxInputFromModelState);
        
        const sliderConfig: IHTMLElement[] = Array.from(document.querySelectorAll('.slider-config'));

        // получить из поля ввода и передать новые введеные пользователем мин и макс значения слайдера 
        // из панели конфигураций в объект newConfig
        const minMaxValues: IHTMLElement[] = Array.from($(sliderConfig[index]).find('.minMaxValue'));
        const minValue: IHTMLElement = minMaxValues[0];
        const maxValue: IHTMLElement = minMaxValues[1];

        minValue.addEventListener('blur', () => {
            const min = Number(minValue.value);
            element.setNewValueMin(min);
        });
        maxValue.addEventListener('blur', () => {
            const max = Number(maxValue.value);
            element.setNewValueMax(max);
        });

        // получить из поля ввода и передать новое значение количества ползунков введенное пользователем
        // из панели конфигураций в объект newConfig
        const amountSliderThumbs: IHTMLElement[] = Array.from($(sliderConfig[index]).find('.field-group-numberValues-container__content'));

        amountSliderThumbs[0].addEventListener('blur', () => {
            const amount = Number(amountSliderThumbs[0].value);
            element.setNewValueAmount(amount);
        });
        // получить из поля ввода и передать новые значения текущих состояний ползунков введенных пользователем
        // из панели конфигураций
        const toFindinputsSliderThumbs = (): IHTMLElement[] => {
            const sliderConfig: IHTMLElement[] = Array.from(document.querySelectorAll('.slider-config'));
            return Array.from($(sliderConfig[index]).find('.input-rangeOfValues'));
        };
        const inputsSliderThumbs: IHTMLElement[] = toFindinputsSliderThumbs();

        new Array(inputsSliderThumbs.length)
            .fill(1)
            .forEach((_element: number, i: number) => {
                inputsSliderThumbs[i].addEventListener('blur', () => {
                    const thumbsValue = Number(inputsSliderThumbs[i].value);
                    element.setNewValueThumbsValues(thumbsValue, i);
                })
            })

        // получить из поля ввода и передать новое значение размера шага введенного пользователем
        // из панели конфигураций в объект newConfig
        const stepSize: IHTMLElement[] = Array.from($(sliderConfig[index]).find('.field-group-stepSize-container__content'));

        stepSize[0].addEventListener('blur', () => {
            const step = Number(stepSize[0].value);
            element.setNewValueStep(step);
        });

        // получить из поля ввода и передать новое значение ориентации слайдера
        const orientationSlider: IHTMLElement[] = Array.from($(sliderConfig[index]).find('.radio-button-container'));

        new Array(orientationSlider.length)
            .fill(1)
            .forEach((_element: number, i: number) => {
                orientationSlider[i].addEventListener('click', () => {
                    let orientation = '';
                    if(i === 0) { orientation = 'horizontal';}
                    if(i === 1) { orientation = 'vertical';}
                    element.setNewValueOrientation(orientation);
                })
            })

        // получить из поля ввода и передать новое значение наличия тултипа
        const checkboxContainer: IHTMLElement[] = Array.from($(sliderConfig[index]).find('.checkbox-button-container'));
        const checkboxInput: IHTMLElement[] = Array.from($(sliderConfig[index]).find('.checkbox-button-container__content'));

        checkboxContainer[0].addEventListener('click', () => {
            let checked = true;
            if(checkboxInput[0].checked === true) {
                checked = true;
            }
            if(checkboxInput[0].checked === false) {
                checked = false;
            }
            element.setNewValueTooltip(checked);
        });

        const setValueOfInputsSliderThumbs = () => {
            const inputsSliderThumbs: IHTMLElement[] = toFindinputsSliderThumbs();

            new Array(inputsSliderThumbs.length)
                .fill(1)
                .forEach((_element: number, i: number) => {
                    const thumbsValue = Number(inputsSliderThumbs[i].value);
                    element.setNewValueThumbsValues(thumbsValue, i);
                })
        }

        const form: IHTMLElement[] = Array.from(document.querySelectorAll('.panel-configuration'));
        form.forEach((elementForm: HTMLElement) => {
            elementForm.addEventListener('submit', (event): void => {
                const currentEvent: Event = event;
                currentEvent.preventDefault();
    
                const min = Number(minValue.value);
                element.setNewValueMin(min);
    
                const max = Number(maxValue.value);
                element.setNewValueMax(max);
    
                const amount = Number(amountSliderThumbs[0].value);
                element.setNewValueAmount(amount);
    
                setValueOfInputsSliderThumbs();
    
                const step = Number(stepSize[0].value);
                element.setNewValueStep(step);
             });
        });
    });
});

