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
            const thumbsCurrentValuesList: IHTMLElement[] = Array.from(document.querySelectorAll('.js-configuration__thumbs-current-value-list'));
            const thumbsIntervalValuesList: IHTMLElement[] = Array.from(document.querySelectorAll('.js-configuration__thumbs-interval-value-list'));

            const fragmentCurrentValueList = document.createDocumentFragment();
            const fragmentIntervalValueList = document.createDocumentFragment();

            new Array(state.amount)
                .fill(1)
                .forEach((_element: number, i: number) => {
                    const currentValueItem: HTMLElement = createElement('li', 'configuration__thumbs-item js-configuration__thumbs-item');
                    const currentValueInput: HTMLElement = createElement('input', 'configuration__thumbs-value js-configuration__thumbs-value');
                    currentValueInput.setAttribute('type', 'text');
                    currentValueInput.setAttribute('value', String(state.thumbsValues[i]));

                    currentValueItem.append(currentValueInput);
                    fragmentCurrentValueList.append(currentValueItem);

                    const intervalValuesSet: HTMLElement = createElement('li', 'configuration__thumbs-set js-configuration__thumbs-set');

                    const valueFrom: HTMLElement = createElement('input', 'configuration__thumbs-value-from js-configuration__thumbs-value-from');
                    valueFrom.setAttribute('type', 'text');
                    if (i === 0) {
                        valueFrom.setAttribute('value', String(state.min));
                    } else {
                        valueFrom.setAttribute('value', String(state.thumbsValues[i - 1] + state.step));
                    }

                    const valueTo: HTMLElement = createElement('input', 'configuration__thumbs-value-to js-configuration__thumbs-value-to');
                    valueTo.setAttribute('type', 'text');
                    valueTo.setAttribute('value', String(state.max));
                    if (i === state.amount - 1) {
                        valueTo.setAttribute('value', String(state.max));
                    } else {
                        valueTo.setAttribute('value', String(state.thumbsValues[i + 1] - state.step));
                    }

                    intervalValuesSet.append(valueFrom);
                    intervalValuesSet.append(valueTo)
                    fragmentIntervalValueList.append(intervalValuesSet);
                });
            thumbsCurrentValuesList[index].append(fragmentCurrentValueList);
            thumbsIntervalValuesList[index].append(fragmentIntervalValueList);
            if(!isCreatedInput) {
                isCreatedInput = true;
            }
        }
        const changeAmountInputs = (state: IModelState) => {
            const thumbsCurrentValuesList: IHTMLElement[] = Array.from(document.querySelectorAll('.js-configuration__thumbs-current-value-list'));
            const $amountInputs: HTMLElement[] = Array.from($(thumbsCurrentValuesList[index]).find('.js-configuration__thumbs-item'));

            const thumbsIntervalValuesList: IHTMLElement[] = Array.from(document.querySelectorAll('.js-configuration__thumbs-interval-value-list'));

            if ($amountInputs.length < state.thumbsValues.length) {
                const missingAmount: number = state.thumbsValues.length - $amountInputs.length;

                const fragmentCurrentValueList = document.createDocumentFragment();
                const fragmentIntervalValueList = document.createDocumentFragment();
                new Array(missingAmount)
                    .fill(1)
                    .forEach((_element: number, i: number) => {
                        const $currentAmountInputs: HTMLElement[] = Array.from($(thumbsCurrentValuesList[index]).find('.js-configuration__thumbs-item'));
                        const currentValueItem: HTMLElement = createElement('li', 'configuration__thumbs-item js-thumbs-values__item');
                        const currentValueInput: HTMLElement = createElement('input', 'configuration__thumbs-value js-configuration__thumbs-value');
                        currentValueInput.setAttribute('type', 'text');
                        currentValueInput.setAttribute('value', String(state.thumbsValues[i]));

                        currentValueItem.append(currentValueInput);
                        fragmentCurrentValueList.append(currentValueItem);

                        const intervalValuesSet: HTMLElement = createElement('div', 'configuration__thumbs-set js-configuration__thumbs-set');

                        const valueFrom: HTMLElement = createElement('input', 'configuration__thumbs-value-from js-configuration__thumbs-value-from');
                        valueFrom.setAttribute('type', 'text');
                        valueFrom.setAttribute('value', String(state.thumbsValues[$currentAmountInputs.length - 1] + state.step));

                        const valueTo: HTMLElement = createElement('input', 'configuration__thumbs-value-to js-configuration__thumbs-value-to');
                        valueTo.setAttribute('type', 'text');
                        valueTo.setAttribute('value', String(state.max));
                        
                        intervalValuesSet.append(valueFrom);
                        intervalValuesSet.append(valueTo);
                        fragmentIntervalValueList.append(intervalValuesSet);
    
                        setNewValueToNewInputs(state);
                    })
                thumbsCurrentValuesList[index].append(fragmentCurrentValueList);
                thumbsIntervalValuesList[index].append(fragmentIntervalValueList);
            }
            if ($amountInputs.length > state.thumbsValues.length) {
                const excessAmount: number = $amountInputs.length - state.thumbsValues.length;

                const thumbsCurrentValuesList: IHTMLElement[] = Array.from(document.querySelectorAll('.js-configuration__thumbs-current-value-list'));
                const $allCurrentValuesInputs: HTMLElement[] = Array.from($(thumbsCurrentValuesList[0]).find('.js-configuration__thumbs-item'));

                const thumbsIntervalValuesList: IHTMLElement[] = Array.from(document.querySelectorAll('.js-configuration__thumbs-interval-value-list'));
                const $allIntervalValuesInputs: HTMLElement[] = Array.from($(thumbsIntervalValuesList[0]).find('.js-configuration__thumbs-set'));

                new Array(excessAmount)
                    .fill(1)
                    .forEach(() => {
                        $allCurrentValuesInputs[$allCurrentValuesInputs.length - 1].remove();
                        $allCurrentValuesInputs.splice(-1, 1);

                        $allIntervalValuesInputs[$allIntervalValuesInputs.length - 1].remove();
                        $allIntervalValuesInputs.splice(-1, 1);
                    })
            }
        };
        const setNewValueToNewInputs = (state: IModelState) => {
            const thumbsCurrentValuesList: IHTMLElement[] = Array.from(document.querySelectorAll('.js-configuration__thumbs-current-value-list'));

            const $allThumbs: IHTMLElement[] = Array.from($(thumbsCurrentValuesList[index]).find('.js-configuration__thumbs-value'));
            const indexNewInput: number = $allThumbs.length - 1;
            $allThumbs[indexNewInput].value = state.thumbsValues[indexNewInput];
        }
        const setValueToInputFromModelState = (state: IModelState) => {
            const thumbsCurrentValuesList: IHTMLElement[] = Array.from(document.querySelectorAll('.js-configuration__thumbs-current-value-list'));
            
            const thumbsIntervalValuesList: IHTMLElement[] = Array.from(document.querySelectorAll('.js-configuration__thumbs-interval-value-list'));

            const $allThumbs: IHTMLElement[] = Array.from($(thumbsCurrentValuesList[index]).find('.js-configuration__thumbs-value'));
            const $allValueFrom: IHTMLElement[] = Array.from($(thumbsIntervalValuesList[index]).find('.js-configuration__thumbs-value-from'));
            const $allValueTo: IHTMLElement[] = Array.from($(thumbsIntervalValuesList[index]).find('.js-configuration__thumbs-value-to'));

            new Array(state.thumbsValues.length)
                .fill(1)
                .forEach((_element: number, i: number) => {
                    $allThumbs[i].value = state.thumbsValues[i];
                    if (i === 0) {
                        if (state.thumbsValues.length === 1) {
                            $allValueFrom[i].value = state.min;
                            $allValueTo[i].value = state.max;
                        } else {
                            $allValueFrom[i].value = state.min;
                            $allValueTo[i].value = state.thumbsValues[i + 1] - state.step;
                        }
                    } else if (i === state.amount - 1) {
                        $allValueFrom[i].value = state.thumbsValues[i - 1] + state.step;
                        $allValueTo[i].value = state.max;
                    } else {
                        $allValueFrom[i].value = state.thumbsValues[i - 1] + state.step;
                        $allValueTo[i].value = state.thumbsValues[i + 1] - state.step;
                    }
                })
        }
        const setValueToStepFromModelState = (state: IModelState) => {
            const configurationPanel: IHTMLElement[] = Array.from(document.querySelectorAll('.js-configuration'));
            
            const $stepSizes: IHTMLElement[] = Array.from($(configurationPanel[index]).find('.js-input-step-size__value'));
            const stepSize = $stepSizes[0];
            stepSize.value = state.step;

        }
        const setValueToMinInputFromModelState = (state: IModelState) => {
            const configurationPanel: IHTMLElement[] = Array.from(document.querySelectorAll('.js-configuration'));

            const $minMaxInputs: IHTMLElement[] = Array.from($(configurationPanel[index]).find('.js-input-min-max__value'));
            const minInput: IHTMLElement = $minMaxInputs[0];
            minInput.value = state.min;
        }
        const setValueMaxInputFromModelState = (state: IModelState) => {
            const configurationPanel: IHTMLElement[] = Array.from(document.querySelectorAll('.js-configuration'));

            const $minMaxInputs: IHTMLElement[] = Array.from($(configurationPanel[index]).find('.js-input-min-max__value'));
            const maxInput: IHTMLElement = $minMaxInputs[1];
            maxInput.value = state.max;
        }

        const modelState: IModelState = element.getState();
        createInput(modelState);
        setValueToStepFromModelState(modelState);
        setValueToMinInputFromModelState(modelState);
        setValueMaxInputFromModelState(modelState);
        //переименовать функцию
        const amountInputs = () => {
            const configurationPanel: HTMLDivElement[] = Array.from(document.querySelectorAll('.js-configuration'));

            const $amountInputs: HTMLElement[] = Array.from($(configurationPanel[index]).find('.js-configuration__thumbs-value'));
            return $amountInputs;
        }
    
        element.subscribeToStateModel(createInput, isCreatedInput, amountInputs, changeAmountInputs,
             setValueToInputFromModelState, setValueToStepFromModelState, setValueToMinInputFromModelState,
             setValueMaxInputFromModelState);
        
        const configurationPanel: IHTMLElement[] = Array.from(document.querySelectorAll('.js-configuration'));

        // получить из поля ввода и передать новые введеные пользователем мин и макс значения слайдера 
        // из панели конфигураций в объект newConfig
        const $minMaxValues: IHTMLElement[] = Array.from($(configurationPanel[index]).find('.js-input-min-max__value'));
        const minValue: IHTMLElement = $minMaxValues[0];
        const maxValue: IHTMLElement = $minMaxValues[1];

        const handleMinValueBlur = () => {
            const min = Number(minValue.value);
            element.setNewValueMin(min);
        };
        const handleMaxValueBlur = () => {
            const max = Number(maxValue.value);
            element.setNewValueMax(max);
        };
        minValue.addEventListener('blur', handleMinValueBlur);
        maxValue.addEventListener('blur', handleMaxValueBlur);

        // получить из поля ввода и передать новое значение количества ползунков введенное пользователем
        // из панели конфигураций
        const $amountSliderThumbs: IHTMLElement[] = Array.from($(configurationPanel[index]).find('.js-input-amount-thumb__value'));

        const handleAmountSliderThumbsBlur = () => {
            const amount = Number($amountSliderThumbs[0].value);
            element.setNewValueAmount(amount);
        };
        $amountSliderThumbs[0].addEventListener('blur', handleAmountSliderThumbsBlur);
        // получить из поля ввода и передать новые значения текущих состояний ползунков введенных пользователем
        // из панели конфигураций
        const toFindinputsSliderThumbs = (): IHTMLElement[] => {
            const configurationPanel: IHTMLElement[] = Array.from(document.querySelectorAll('.js-configuration'));
            const $element:IHTMLElement[] = Array.from($(configurationPanel[index]).find('.js-configuration__thumbs-value'));
            return $element;
        };
        const inputsSliderThumbs: IHTMLElement[] = toFindinputsSliderThumbs();

        new Array(inputsSliderThumbs.length)
            .fill(1)
            .forEach((_element: number, i: number) => {
                const handleInputsSliderThumbsBlur = () => {
                    const thumbsValue = Number(inputsSliderThumbs[i].value);
                    element.setNewValueThumbsValues(thumbsValue, i);
                };
                inputsSliderThumbs[i].addEventListener('blur', handleInputsSliderThumbsBlur)
            })

        // получить из поля ввода и передать новое значение размера шага введенного пользователем
        // из панели конфигураций в объект newConfig
        const $stepSize: IHTMLElement[] = Array.from($(configurationPanel[index]).find('.js-input-step-size__value'));

        const handleStepSizeBlur = () => {
            const step = Number($stepSize[0].value);
            element.setNewValueStep(step);
        }
        $stepSize[0].addEventListener('blur', handleStepSizeBlur);

        // получить из поля ввода и передать новое значение ориентации слайдера
        const $orientationSlider: IHTMLElement[] = Array.from($(configurationPanel[index]).find('.js-radio-button'));

        new Array($orientationSlider.length)
            .fill(1)
            .forEach((_element: number, i: number) => {
                const handleOrientationSliderClick = () => {
                    let orientation = '';
                    if(i === 0) { orientation = 'horizontal';}
                    if(i === 1) { orientation = 'vertical';}
                    element.setNewValueOrientation(orientation);
                };
                $orientationSlider[i].addEventListener('click', handleOrientationSliderClick)
            })

        // получить из поля ввода и передать новое значение наличия тултипа
        const $checkboxContainer: IHTMLElement[] = Array.from($(configurationPanel[index]).find('.js-checkbox-button'));
        const $checkboxInput: IHTMLElement[] = Array.from($(configurationPanel[index]).find('.js-checkbox-button__content'));

        const handleCheckboxContainerClick = () => {
            let checked = true;
            if($checkboxInput[0].checked === true) {
                checked = true;
            }
            if($checkboxInput[0].checked === false) {
                checked = false;
            }
            element.setNewValueTooltip(checked);
        };
        $checkboxContainer[0].addEventListener('click', handleCheckboxContainerClick);

        const setValueOfInputsSliderThumbs = () => {
            const inputsSliderThumbs: IHTMLElement[] = toFindinputsSliderThumbs();

            new Array(inputsSliderThumbs.length)
                .fill(1)
                .forEach((_element: number, i: number) => {
                    const thumbsValue = Number(inputsSliderThumbs[i].value);
                    element.setNewValueThumbsValues(thumbsValue, i);
                })
        }

        const form: IHTMLElement[] = Array.from(document.querySelectorAll('.js-configuration'));
        const handleElementFormSubmit: (event: Event) => void = (event): void => {
            const currentEvent: Event = event;
            currentEvent.preventDefault();

            const min = Number(minValue.value);
            element.setNewValueMin(min);

            const max = Number(maxValue.value);
            element.setNewValueMax(max);

            const amount = Number($amountSliderThumbs[0].value);
            element.setNewValueAmount(amount);

            setValueOfInputsSliderThumbs();

            const step = Number($stepSize[0].value);
            element.setNewValueStep(step);
         }
        form.forEach((elementForm: HTMLElement) => {
            elementForm.addEventListener('submit', handleElementFormSubmit);
        });
    });
});

