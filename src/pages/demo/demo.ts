import {IModelState} from '../../slider/interfaces/iModelState';
import {IHTMLElement} from '../../slider/interfaces/iHTMLElement';

$( () => {
    $('.js-slider-test').slider();

    const elements: IHTMLElement[] = Array.from($('.js-slider-test')) as IHTMLElement[];

    elements.forEach((element: IHTMLElement, index: number) => {
        let isCreatedInput: boolean = false;

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
            let amountInputs: HTMLElement[] = Array.from($(rangeOfValuesList[index]).find('.rangeOfValues-set'));

            if (amountInputs.length < state.thumbsValues.length) {
                const missingAmount: number = state.thumbsValues.length - amountInputs.length;

                new Array(missingAmount)
                    .fill(1)
                    .forEach((_element: number, i: number) => {
                        let currentAmountInputs: HTMLElement[] = Array.from($(rangeOfValuesList[index]).find('.rangeOfValues-set'));
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
                let allThumbs: HTMLElement[] = Array.from($(rangeOfValuesList[index]).find('.rangeOfValues-item'));

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

            let allThumbs: IHTMLElement[] = Array.from($(rangeOfValuesList[index]).find('.input-rangeOfValues')) as IHTMLElement[];
            const indexNewInput: number = allThumbs.length - 1;
            allThumbs[indexNewInput].value = state.thumbsValues[indexNewInput];
        }
        const setValueToInputFromModelState = (state: IModelState) => {
            const rangeOfValuesList: IHTMLElement[] = Array.from(document.querySelectorAll('.rangeOfValues-list'));

            let allThumbs: IHTMLElement[] = Array.from($(rangeOfValuesList[index]).find('.input-rangeOfValues')) as IHTMLElement[];
            let allValueFrom: IHTMLElement[] = Array.from($(rangeOfValuesList[index]).find('.input-rangeOfValues-from')) as IHTMLElement[];
            let allValueTo: IHTMLElement[] = Array.from($(rangeOfValuesList[index]).find('.input-rangeOfValues-to')) as IHTMLElement[];

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
            const sliderConfig: HTMLDivElement[] = Array.from(document.querySelectorAll('.slider-config'));
            
            const stepSize: HTMLElement[] = Array.from($(sliderConfig[index]).find('.field-group-stepSize-container__content'));
            //@ts-ignore
            stepSize[0].value = state.step;

        }
        const setValueToMinInputFromModelState = (state: IModelState) => {
            const sliderConfig: HTMLDivElement[] = Array.from(document.querySelectorAll('.slider-config'));

            const MinInput: HTMLElement[] = Array.from($(sliderConfig[index]).find('.minMaxValue'));
            //@ts-ignore
            MinInput[0].value = state.min;
        }
        const setValueMaxInputFromModelState = (state: IModelState) => {
            const sliderConfig: HTMLDivElement[] = Array.from(document.querySelectorAll('.slider-config'));

            const MaxInput: HTMLElement[] = Array.from($(sliderConfig[index]).find('.minMaxValue'));
            //@ts-ignore
            MaxInput[1].value = state.max;
        }

        let modelState: IModelState = element.getState();
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
        
        const sliderConfig: HTMLDivElement[] = Array.from(document.querySelectorAll('.slider-config'));

        // получить из поля ввода и передать новые введеные пользователем мин и макс значения слайдера 
        // из панели конфигураций в объект newConfig
        const minMaxValues: HTMLElement[] = Array.from($(sliderConfig[index]).find('.minMaxValue'));
        const minValue: HTMLElement = minMaxValues[0];
        const maxValue: HTMLElement = minMaxValues[1];

        minValue.addEventListener('blur', () => {
            //@ts-ignore
            const min: number = Number(minValue.value);
            element.setNewValueMin(min);
        });
        maxValue.addEventListener('blur', () => {
            //@ts-ignore
            const max: number = Number(maxValue.value);
            element.setNewValueMax(max);
        });

        // получить из поля ввода и передать новое значение количества ползунков введенное пользователем
        // из панели конфигураций в объект newConfig
        let amountSliderThumbs: HTMLElement[] = Array.from($(sliderConfig[index]).find('.field-group-numberValues-container__content'));

        amountSliderThumbs[0].addEventListener('blur', () => {
            //@ts-ignore
            const amount: number = Number(amountSliderThumbs[0].value);
            element.setNewValueAmount(amount);
        });
        // получить из поля ввода и передать новые значения текущих состояний ползунков введенных пользователем
        // из панели конфигураций
        const toFindinputsSliderThumbs = (): HTMLElement[] => {
            const sliderConfig: HTMLDivElement[] = Array.from(document.querySelectorAll('.slider-config'));
            return Array.from($(sliderConfig[index]).find('.input-rangeOfValues'));
        };
        let inputsSliderThumbs: HTMLElement[] = toFindinputsSliderThumbs();

        new Array(inputsSliderThumbs.length)
            .fill(1)
            .forEach((_element: number, i: number) => {
                inputsSliderThumbs[i].addEventListener('blur', () => {
                    //@ts-ignore
                    const thumbsValue: number = Number(inputsSliderThumbs[i].value);
                    element.setNewValueThumbsValues(thumbsValue, i);
                })
            })

        // получить из поля ввода и передать новое значение размера шага введенного пользователем
        // из панели конфигураций в объект newConfig
        let stepSize: HTMLElement[] = Array.from($(sliderConfig[index]).find('.field-group-stepSize-container__content'));

        stepSize[0].addEventListener('blur', () => {
            //@ts-ignore
            const step: number = Number(stepSize[0].value);
            element.setNewValueStep(step);
        });

        // получить из поля ввода и передать новое значение ориентации слайдера
        let orientationSlider: HTMLElement[] = Array.from($(sliderConfig[index]).find('.radio-button-container'));

        new Array(orientationSlider.length)
            .fill(1)
            .forEach((_element: number, i: number) => {
                orientationSlider[i].addEventListener('click', () => {
                    let orientation: string = '';
                    if(i === 0) { orientation = 'horizontal';}
                    if(i === 1) { orientation = 'vertical';}
                    element.setNewValueOrientation(orientation);
                })
            })

        // получить из поля ввода и передать новое значение наличия тултипа
        let checkboxContainer: HTMLElement[] = Array.from($(sliderConfig[index]).find('.checkbox-button-container'));
        let checkboxInput: HTMLElement[] = Array.from($(sliderConfig[index]).find('.checkbox-button-container__content'));

        checkboxContainer[0].addEventListener('click', () => {
            let checked: boolean = true;
            //@ts-ignore
            if(checkboxInput[0].checked === true) {
                checked = true;
            }
            //@ts-ignore
            if(checkboxInput[0].checked === false) {
                checked = false;
            }
            element.setNewValueTooltip(checked);
        });

        const setValueOfInputsSliderThumbs = () => {
            let inputsSliderThumbs: HTMLElement[] = toFindinputsSliderThumbs();

            new Array(inputsSliderThumbs.length)
                .fill(1)
                .forEach((_element: number, i: number) => {
                    //@ts-ignore
                    const thumbsValue: number = Number(inputsSliderThumbs[i].value);
                    element.setNewValueThumbsValues(thumbsValue, i);
                })
        }

        let form: HTMLElement[] = Array.from(document.querySelectorAll('.panel-configuration'));
        form.forEach((elementForm: HTMLElement) => {
            elementForm.addEventListener('submit', (event): void => {
                const currentEvent: Event = event as Event;
                currentEvent.preventDefault();
    
                //@ts-ignore
                const min: number = Number(minValue.value);
                element.setNewValueMin(min);
    
                //@ts-ignore
                const max: number = Number(maxValue.value);
                element.setNewValueMax(max);
    
                //@ts-ignore
                const amount: number = Number(amountSliderThumbs[0].value);
                element.setNewValueAmount(amount);
    
                setValueOfInputsSliderThumbs();
    
                //@ts-ignore
                const step: number = Number(stepSize[0].value);
                element.setNewValueStep(step);
             });
        });
    });
});

