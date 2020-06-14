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
            const thumbsCurrentValues: IHTMLElement[] = Array.from(document.querySelectorAll('.js-thumbs-values__current-value'));
            const thumbsCurrentValuesList: IHTMLElement[] = Array.from(thumbsCurrentValues[index].querySelectorAll('.js-thumbs-values__list'));
            
            const thumbsIntervalValues: IHTMLElement[] = Array.from(document.querySelectorAll('.js-thumbs-values__interval-value'));
            const thumbsIntervalValuesList: IHTMLElement[] = Array.from(thumbsIntervalValues[index].querySelectorAll('.js-thumbs-values__list'));

            new Array(state.amount)
                .fill(1)
                .forEach((_element: number, i: number) => {
                    const currentValueItem: HTMLElement = createElement('li', 'thumbs-values__item js-thumbs-values__item');
                    const currentValueInput: HTMLElement = createElement('input', 'thumbs-values__value js-thumbs-values__item');
                    currentValueInput.setAttribute('type', 'text');
                    currentValueInput.setAttribute('value', String(state.thumbsValues[i]));

                    currentValueItem.append(currentValueInput);
                    thumbsCurrentValuesList[0].append(currentValueItem);

                    const intervalValuesSet: HTMLElement = createElement('div', 'thumbs-values__set js-thumbs-values__item');

                    const valueFrom: HTMLElement = createElement('input', 'thumbs-values__value-from js-thumbs-values__item');
                    valueFrom.setAttribute('type', 'text');
                    if (i === 0) {
                        valueFrom.setAttribute('value', String(state.min));
                    } else {
                        valueFrom.setAttribute('value', String(state.thumbsValues[i - 1] + state.step));
                    }

                    const valueTo: HTMLElement = createElement('input', 'thumbs-values__value-to js-thumbs-values__item');
                    valueTo.setAttribute('type', 'text');
                    valueTo.setAttribute('value', String(state.max));
                    if (i === state.amount - 1) {
                        valueTo.setAttribute('value', String(state.max));
                    } else {
                        valueTo.setAttribute('value', String(state.thumbsValues[i + 1] - state.step));
                    }
                    
                    intervalValuesSet.append(valueFrom);
                    intervalValuesSet.append(valueTo)
                    thumbsIntervalValuesList[0].append(intervalValuesSet);
                })
            if(!isCreatedInput) {
                isCreatedInput = true;
            }
        }
        const changeAmountInputs = (state: IModelState) => {
            const thumbsCurrentValues: IHTMLElement[] = Array.from(document.querySelectorAll('.js-thumbs-values__current-value'));
            const thumbsCurrentValuesList: IHTMLElement[] = Array.from(thumbsCurrentValues[index].querySelectorAll('.js-thumbs-values__list'));
            const amountInputs: HTMLElement[] = Array.from($(thumbsCurrentValuesList[0]).find('.js-thumbs-values__item'));

            const thumbsIntervalValues: IHTMLElement[] = Array.from(document.querySelectorAll('.js-thumbs-values__interval-value'));
            const thumbsIntervalValuesList: IHTMLElement[] = Array.from(thumbsIntervalValues[index].querySelectorAll('.js-thumbs-values__list'));

            if (amountInputs.length < state.thumbsValues.length) {
                const missingAmount: number = state.thumbsValues.length - amountInputs.length;

                new Array(missingAmount)
                    .fill(1)
                    .forEach((_element: number, i: number) => {
                        const currentAmountInputs: HTMLElement[] = Array.from($(thumbsCurrentValues[index]).find('.js-thumbs-values__item'));
                        const currentValueItem: HTMLElement = createElement('li', 'thumbs-values__item js-thumbs-values__item');
                        const currentValueInput: HTMLElement = createElement('input', 'thumbs-values__value js-thumbs-values__value');
                        currentValueInput.setAttribute('type', 'text');
                        currentValueInput.setAttribute('value', String(state.thumbsValues[i]));

                        currentValueItem.append(currentValueInput);
                        thumbsCurrentValuesList[0].append(currentValueItem);

                        const intervalValuesSet: HTMLElement = createElement('div', 'thumbs-values__set js-thumbs-values__set');

                        const valueFrom: HTMLElement = createElement('input', 'thumbs-values__value-from js-thumbs-values__value-from');
                        valueFrom.setAttribute('type', 'text');
                        valueFrom.setAttribute('value', String(state.thumbsValues[currentAmountInputs.length - 1] + state.step));

                        const valueTo: HTMLElement = createElement('input', 'thumbs-values__value-to js-thumbs-values__value-to');
                        valueTo.setAttribute('type', 'text');
                        valueTo.setAttribute('value', String(state.max));
                        
                        intervalValuesSet.append(valueFrom);
                        intervalValuesSet.append(valueTo)
                        thumbsIntervalValuesList[0].append(intervalValuesSet);
    
                        setNewValueToNewInputs(state);
                    })
            }
            if (amountInputs.length > state.thumbsValues.length) {
                const excessAmount: number = amountInputs.length - state.thumbsValues.length;

                const thumbsCurrentValues: IHTMLElement[] = Array.from(document.querySelectorAll('.js-thumbs-values__current-value'));
                const thumbsCurrentValuesList: IHTMLElement[] = Array.from(thumbsCurrentValues[index].querySelectorAll('.js-thumbs-values__list'));
                const allCurrentValuesInputs: HTMLElement[] = Array.from($(thumbsCurrentValuesList[0]).find('.js-thumbs-values__item'));

                const thumbsIntervalValues: IHTMLElement[] = Array.from(document.querySelectorAll('.js-thumbs-values__interval-value'));
                const thumbsIntervalValuesList: IHTMLElement[] = Array.from(thumbsIntervalValues[index].querySelectorAll('.js-thumbs-values__list'));
                const allIntervalValuesInputs: HTMLElement[] = Array.from($(thumbsIntervalValuesList[0]).find('.js-thumbs-values__set'));

                new Array(excessAmount)
                    .fill(1)
                    .forEach(() => {
                        allCurrentValuesInputs[allCurrentValuesInputs.length - 1].remove();
                        allCurrentValuesInputs.splice(-1, 1);

                        allIntervalValuesInputs[allIntervalValuesInputs.length - 1].remove();
                        allIntervalValuesInputs.splice(-1, 1);
                    })
            }
        };
        const setNewValueToNewInputs = (state: IModelState) => {
            const thumbsCurrentValues: IHTMLElement[] = Array.from(document.querySelectorAll('.js-thumbs-values__current-value'));
            const thumbsCurrentValuesList: IHTMLElement[] = Array.from(thumbsCurrentValues[index].querySelectorAll('.js-thumbs-values__list'));

            const allThumbs: IHTMLElement[] = Array.from($(thumbsCurrentValuesList[0]).find('.js-thumbs-values__value'));
            const indexNewInput: number = allThumbs.length - 1;
            allThumbs[indexNewInput].value = state.thumbsValues[indexNewInput];
        }
        const setValueToInputFromModelState = (state: IModelState) => {
            const thumbsCurrentValues: IHTMLElement[] = Array.from(document.querySelectorAll('.js-thumbs-values__current-value'));
            const thumbsCurrentValuesList: IHTMLElement[] = Array.from(thumbsCurrentValues[index].querySelectorAll('.js-thumbs-values__list'));
            
            const thumbsIntervalValues: IHTMLElement[] = Array.from(document.querySelectorAll('.js-thumbs-values__interval-value'));
            const thumbsIntervalValuesList: IHTMLElement[] = Array.from(thumbsIntervalValues[index].querySelectorAll('.js-thumbs-values__list'));

            const allThumbs: IHTMLElement[] = Array.from($(thumbsCurrentValuesList[0]).find('.js-thumbs-values__value'));
            const allValueFrom: IHTMLElement[] = Array.from($(thumbsIntervalValuesList[0]).find('.thumbs-values__value-from'));
            const allValueTo: IHTMLElement[] = Array.from($(thumbsIntervalValuesList[0]).find('.thumbs-values__value-to'));

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
            const configurationPanel: IHTMLElement[] = Array.from(document.querySelectorAll('.js-configuration'));
            
            const stepSizes: IHTMLElement[] = Array.from($(configurationPanel[index]).find('.js-step-size__value'));
            const stepSize = stepSizes[0];
            stepSize.value = state.step;

        }
        const setValueToMinInputFromModelState = (state: IModelState) => {
            const configurationPanel: IHTMLElement[] = Array.from(document.querySelectorAll('.js-configuration'));

            const minMaxInputs: IHTMLElement[] = Array.from($(configurationPanel[index]).find('.js-min-max-values__value'));
            const minInput: IHTMLElement = minMaxInputs[0];
            minInput.value = state.min;
        }
        const setValueMaxInputFromModelState = (state: IModelState) => {
            const configurationPanel: IHTMLElement[] = Array.from(document.querySelectorAll('.js-configuration'));

            const minMaxInputs: IHTMLElement[] = Array.from($(configurationPanel[index]).find('.js-min-max-values__value'));
            const maxInput: IHTMLElement = minMaxInputs[1];
            maxInput.value = state.max;
        }

        const modelState: IModelState = element.getState();
        createInput(modelState);
        setValueToStepFromModelState(modelState);
        setValueToMinInputFromModelState(modelState);
        setValueMaxInputFromModelState(modelState);

        const amountInputs = () => {
            const configurationPanel: HTMLDivElement[] = Array.from(document.querySelectorAll('.js-configuration'));

            const amountInputs: HTMLElement[] = Array.from($(configurationPanel[index]).find('.js-thumbs-values__value'));
            return amountInputs;
        }
    
        element.subscribeToStateModel(createInput, isCreatedInput, amountInputs, changeAmountInputs,
             setValueToInputFromModelState, setValueToStepFromModelState, setValueToMinInputFromModelState,
             setValueMaxInputFromModelState);
        
        const configurationPanel: IHTMLElement[] = Array.from(document.querySelectorAll('.js-configuration'));

        // получить из поля ввода и передать новые введеные пользователем мин и макс значения слайдера 
        // из панели конфигураций в объект newConfig
        const minMaxValues: IHTMLElement[] = Array.from($(configurationPanel[index]).find('.js-min-max-values__value'));
        const minValue: IHTMLElement = minMaxValues[0];
        const maxValue: IHTMLElement = minMaxValues[1];

        const onBlurForMinValue = () => {
            const min = Number(minValue.value);
            element.setNewValueMin(min);
        };
        const onBlurForMaxValue = () => {
            const max = Number(maxValue.value);
            element.setNewValueMax(max);
        };
        minValue.addEventListener('blur', onBlurForMinValue);
        maxValue.addEventListener('blur', onBlurForMaxValue);

        // получить из поля ввода и передать новое значение количества ползунков введенное пользователем
        // из панели конфигураций
        const amountSliderThumbs: IHTMLElement[] = Array.from($(configurationPanel[index]).find('.js-amount-thumb__value'));

        const onBlurForAmountSliderThumbs = () => {
            const amount = Number(amountSliderThumbs[0].value);
            element.setNewValueAmount(amount);
        };
        amountSliderThumbs[0].addEventListener('blur', onBlurForAmountSliderThumbs);
        // получить из поля ввода и передать новые значения текущих состояний ползунков введенных пользователем
        // из панели конфигураций
        const toFindinputsSliderThumbs = (): IHTMLElement[] => {
            const configurationPanel: IHTMLElement[] = Array.from(document.querySelectorAll('.js-configuration'));
            return Array.from($(configurationPanel[index]).find('.js-thumbs-values__value'));
        };
        const inputsSliderThumbs: IHTMLElement[] = toFindinputsSliderThumbs();

        new Array(inputsSliderThumbs.length)
            .fill(1)
            .forEach((_element: number, i: number) => {
                const onBlurInputsSliderThumbs = () => {
                    const thumbsValue = Number(inputsSliderThumbs[i].value);
                    element.setNewValueThumbsValues(thumbsValue, i);
                };
                inputsSliderThumbs[i].addEventListener('blur', onBlurInputsSliderThumbs)
            })

        // получить из поля ввода и передать новое значение размера шага введенного пользователем
        // из панели конфигураций в объект newConfig
        const stepSize: IHTMLElement[] = Array.from($(configurationPanel[index]).find('.js-step-size__value'));

        const onBlurStepSize = () => {
            const step = Number(stepSize[0].value);
            element.setNewValueStep(step);
        }
        stepSize[0].addEventListener('blur', onBlurStepSize);

        // получить из поля ввода и передать новое значение ориентации слайдера
        const orientationSlider: IHTMLElement[] = Array.from($(configurationPanel[index]).find('.js-radio-button-container'));

        new Array(orientationSlider.length)
            .fill(1)
            .forEach((_element: number, i: number) => {
                const onClickOrientationSlider = () => {
                    let orientation = '';
                    if(i === 0) { orientation = 'horizontal';}
                    if(i === 1) { orientation = 'vertical';}
                    element.setNewValueOrientation(orientation);
                };
                orientationSlider[i].addEventListener('click', onClickOrientationSlider)
            })

        // получить из поля ввода и передать новое значение наличия тултипа
        const checkboxContainer: IHTMLElement[] = Array.from($(configurationPanel[index]).find('.js-checkbox-button-container'));
        const checkboxInput: IHTMLElement[] = Array.from($(configurationPanel[index]).find('.js-checkbox-button-container__content'));

        const onClickCheckboxContainer = () => {
            let checked = true;
            if(checkboxInput[0].checked === true) {
                checked = true;
            }
            if(checkboxInput[0].checked === false) {
                checked = false;
            }
            element.setNewValueTooltip(checked);
        };
        checkboxContainer[0].addEventListener('click', onClickCheckboxContainer);

        const setValueOfInputsSliderThumbs = () => {
            const inputsSliderThumbs: IHTMLElement[] = toFindinputsSliderThumbs();

            new Array(inputsSliderThumbs.length)
                .fill(1)
                .forEach((_element: number, i: number) => {
                    const thumbsValue = Number(inputsSliderThumbs[i].value);
                    element.setNewValueThumbsValues(thumbsValue, i);
                })
        }

        const form: IHTMLElement[] = Array.from(document.querySelectorAll('.js-panel-configuration'));
        const onSubmitElementForm: (event: Event) => void = (event): void => {
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
         }
        form.forEach((elementForm: HTMLElement) => {
            elementForm.addEventListener('submit', onSubmitElementForm);
        });
    });
});

