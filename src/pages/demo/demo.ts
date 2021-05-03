import { IModelState } from '../../slider/interfaces/iModelState';
import { IHTMLElement } from '../../slider/interfaces/iHTMLElement';

$(() => {
  $('.js-slider-test').slider();

  const elements: IHTMLElement[] = Array.from($('.js-slider-test'));

  elements.forEach((element: IHTMLElement, index: number) => {
    let isCreatedInput = false;

    const createElement = (teg: string, className: string) => {
      const htmlElement: IHTMLElement = document.createElement(
        teg,
      ) as IHTMLElement;
      htmlElement.className = className;
      return htmlElement;
    };

    const createInput = (state: IModelState) => {
      const thumbsCurrentValuesList: IHTMLElement[] = Array.from(
        document.querySelectorAll(
          '.js-configuration__thumbs-current-value-list',
        ),
      );
      const thumbsIntervalValuesList: IHTMLElement[] = Array.from(
        document.querySelectorAll(
          '.js-configuration__thumbs-interval-value-list',
        ),
      );

      const fragmentCurrentValueList = document.createDocumentFragment();
      const fragmentIntervalValueList = document.createDocumentFragment();

      new Array(state.thumbsCount)
        .fill(1)
        .forEach((_element: number, i: number) => {
          const currentValueItem: HTMLElement = createElement(
            'li',
            'configuration__thumbs-item js-configuration__thumbs-item',
          );
          const currentValueInput: HTMLElement = createElement(
            'input',
            'configuration__thumbs-value js-configuration__thumbs-value',
          );
          currentValueInput.setAttribute('type', 'text');
          currentValueInput.setAttribute(
            'value',
            String(state.thumbsValues[i]),
          );

          currentValueItem.append(currentValueInput);
          fragmentCurrentValueList.append(currentValueItem);

          const intervalValuesSet: HTMLElement = createElement(
            'li',
            'configuration__thumbs-set js-configuration__thumbs-set',
          );

          const valueFrom: HTMLElement = createElement(
            'input',
            'configuration__thumbs-value-from js-configuration__thumbs-value-from',
          );
          valueFrom.setAttribute('type', 'text');
          if (i === 0) {
            valueFrom.setAttribute('value', String(state.min));
          } else {
            valueFrom.setAttribute(
              'value',
              String(state.thumbsValues[i - 1] + state.step),
            );
          }

          const valueTo: HTMLElement = createElement(
            'input',
            'configuration__thumbs-value-to js-configuration__thumbs-value-to',
          );
          valueTo.setAttribute('type', 'text');
          valueTo.setAttribute('value', String(state.max));
          if (i === state.thumbsCount - 1) {
            valueTo.setAttribute('value', String(state.max));
          } else {
            valueTo.setAttribute(
              'value',
              String(state.thumbsValues[i + 1] - state.step),
            );
          }

          intervalValuesSet.append(valueFrom);
          intervalValuesSet.append(valueTo);
          fragmentIntervalValueList.append(intervalValuesSet);
        });
      thumbsCurrentValuesList[index].append(fragmentCurrentValueList);
      thumbsIntervalValuesList[index].append(fragmentIntervalValueList);
      if (!isCreatedInput) {
        isCreatedInput = true;
      }
    };
    const setNewValueToNewInputs = (state: IModelState) => {
      const thumbsCurrentValuesList: IHTMLElement[] = Array.from(
        document.querySelectorAll(
          '.js-configuration__thumbs-current-value-list',
        ),
      );

      const $allThumbs: HTMLInputElement[] = Array.from(
        $(thumbsCurrentValuesList[index]).find(
          '.js-configuration__thumbs-value',
        ),
      ) as HTMLInputElement[];
      const indexNewInput: number = $allThumbs.length - 1;
      $allThumbs[indexNewInput].value = String(
        state.thumbsValues[indexNewInput],
      );
    };
    const changeAmountInputs = (state: IModelState) => {
      const thumbsCurrentValuesList: IHTMLElement[] = Array.from(
        document.querySelectorAll(
          '.js-configuration__thumbs-current-value-list',
        ),
      );
      const $amountInputs: HTMLElement[] = Array.from(
        $(thumbsCurrentValuesList[index]).find(
          '.js-configuration__thumbs-item',
        ),
      );

      const thumbsIntervalValuesList: IHTMLElement[] = Array.from(
        document.querySelectorAll(
          '.js-configuration__thumbs-interval-value-list',
        ),
      );

      if ($amountInputs.length < state.thumbsCount) {
        const missingAmount: number = state.thumbsCount - $amountInputs.length;

        const fragmentCurrentValueList = document.createDocumentFragment();
        const fragmentIntervalValueList = document.createDocumentFragment();
        new Array(missingAmount)
          .fill(1)
          .forEach((_element: number, i: number) => {
            const $currentAmountInputs: HTMLElement[] = Array.from(
              $(thumbsCurrentValuesList[index]).find(
                '.js-configuration__thumbs-item',
              ),
            );
            const currentValueItem: HTMLElement = createElement(
              'li',
              'configuration__thumbs-item js-configuration__thumbs-item',
            );
            const currentValueInput: HTMLElement = createElement(
              'input',
              'configuration__thumbs-value js-configuration__thumbs-value',
            );
            currentValueInput.setAttribute('type', 'text');
            currentValueInput.setAttribute(
              'value',
              String(state.thumbsValues[i]),
            );

            currentValueItem.append(currentValueInput);
            fragmentCurrentValueList.append(currentValueItem);

            const intervalValuesSet: HTMLElement = createElement(
              'li',
              'configuration__thumbs-set js-configuration__thumbs-set',
            );

            const valueFrom: HTMLElement = createElement(
              'input',
              'configuration__thumbs-value-from js-configuration__thumbs-value-from',
            );
            valueFrom.setAttribute('type', 'text');
            valueFrom.setAttribute(
              'value',
              String(
                state.thumbsValues[$currentAmountInputs.length - 1] +
                  state.step,
              ),
            );

            const valueTo: HTMLElement = createElement(
              'input',
              'configuration__thumbs-value-to js-configuration__thumbs-value-to',
            );
            valueTo.setAttribute('type', 'text');
            valueTo.setAttribute('value', String(state.max));

            intervalValuesSet.append(valueFrom);
            intervalValuesSet.append(valueTo);
            fragmentIntervalValueList.append(intervalValuesSet);

            setNewValueToNewInputs(state);
          });
        thumbsCurrentValuesList[index].append(fragmentCurrentValueList);
        thumbsIntervalValuesList[index].append(fragmentIntervalValueList);
      }
      if ($amountInputs.length > state.thumbsCount) {
        const excessAmount: number = $amountInputs.length - state.thumbsCount;

        const $allCurrentValuesInputs: HTMLElement[] = Array.from(
          $(thumbsCurrentValuesList[index]).find(
            '.js-configuration__thumbs-item',
          ),
        );
        const $allIntervalValuesInputs: HTMLElement[] = Array.from(
          $(thumbsIntervalValuesList[index]).find(
            '.js-configuration__thumbs-set',
          ),
        );
        new Array(excessAmount).fill(1).forEach(() => {
          $allCurrentValuesInputs[$allCurrentValuesInputs.length - 1].remove();
          $allCurrentValuesInputs.splice(-1, 1);

          $allIntervalValuesInputs[
            $allIntervalValuesInputs.length - 1
          ].remove();
          $allIntervalValuesInputs.splice(-1, 1);
        });
      }
    };
    const setValueToInputFromModelState = (state: IModelState) => {
      const thumbsCurrentValuesList: IHTMLElement[] = Array.from(
        document.querySelectorAll(
          '.js-configuration__thumbs-current-value-list',
        ),
      );

      const thumbsIntervalValuesList: IHTMLElement[] = Array.from(
        document.querySelectorAll(
          '.js-configuration__thumbs-interval-value-list',
        ),
      );

      const $allThumbs: HTMLInputElement[] = Array.from(
        $(thumbsCurrentValuesList[index]).find(
          '.js-configuration__thumbs-value',
        ),
      ) as HTMLInputElement[];
      const $allValueFrom: HTMLInputElement[] = Array.from(
        $(thumbsIntervalValuesList[index]).find(
          '.js-configuration__thumbs-value-from',
        ),
      ) as HTMLInputElement[];
      const $allValueTo: HTMLInputElement[] = Array.from(
        $(thumbsIntervalValuesList[index]).find(
          '.js-configuration__thumbs-value-to',
        ),
      ) as HTMLInputElement[];

      new Array(state.thumbsValues.length)
        .fill(1)
        .forEach((_element: number, i: number) => {
          $allThumbs[i].value = String(state.thumbsValues[i]);
          if (i === 0) {
            if (state.thumbsValues.length === 1) {
              $allValueFrom[i].value = String(state.min);
              $allValueTo[i].value = String(state.max);
            } else {
              $allValueFrom[i].value = String(state.min);
              $allValueTo[i].value = String(
                state.thumbsValues[i + 1] - state.step,
              );
            }
          } else if (i === state.thumbsCount - 1) {
            $allValueFrom[i].value = String(
              state.thumbsValues[i - 1] + state.step,
            );
            $allValueTo[i].value = String(state.max);
          } else {
            $allValueFrom[i].value = String(
              state.thumbsValues[i - 1] + state.step,
            );
            $allValueTo[i].value = String(
              state.thumbsValues[i + 1] - state.step,
            );
          }
        });
    };
    const setValueToStepFromModelState = (state: IModelState) => {
      const configurationPanel: IHTMLElement[] = Array.from(
        document.querySelectorAll('.js-configuration'),
      );

      const $stepSizes: HTMLInputElement[] = Array.from(
        $(configurationPanel[index]).find('.js-input-step-size__value'),
      ) as HTMLInputElement[];
      const stepSize = $stepSizes[0];
      stepSize.value = String(state.step);
    };
    const setValueToMinInputFromModelState = (state: IModelState) => {
      const configurationPanel: IHTMLElement[] = Array.from(
        document.querySelectorAll('.js-configuration'),
      );

      const $minMaxInputs: HTMLInputElement[] = Array.from(
        $(configurationPanel[index]).find('.js-input-min-max__value'),
      ) as HTMLInputElement[];
      const minInput: HTMLInputElement = $minMaxInputs[0];
      minInput.value = String(state.min);
    };
    const setValueMaxInputFromModelState = (state: IModelState) => {
      const configurationPanel: IHTMLElement[] = Array.from(
        document.querySelectorAll('.js-configuration'),
      );

      const $minMaxInputs: HTMLInputElement[] = Array.from(
        $(configurationPanel[index]).find('.js-input-min-max__value'),
      ) as HTMLInputElement[];
      const maxInput: HTMLInputElement = $minMaxInputs[1];
      maxInput.value = String(state.max);
    };

    const modelState: IModelState = element.getState();
    createInput(modelState);
    setValueToStepFromModelState(modelState);
    setValueToMinInputFromModelState(modelState);
    setValueMaxInputFromModelState(modelState);

    const getAmountInputs = () => {
      const configurationPanel: HTMLDivElement[] = Array.from(
        document.querySelectorAll('.js-configuration'),
      );

      const $amountInputs: HTMLElement[] = Array.from(
        $(configurationPanel[index]).find('.js-configuration__thumbs-value'),
      );
      return $amountInputs;
    };

    element.subscribeToStateModel(
      createInput,
      isCreatedInput,
      getAmountInputs,
      changeAmountInputs,
      setValueToInputFromModelState,
      setValueToStepFromModelState,
      setValueToMinInputFromModelState,
      setValueMaxInputFromModelState,
    );

    const configurationPanel: IHTMLElement[] = Array.from(
      document.querySelectorAll('.js-configuration'),
    );

    // get from the input field and transfer the new user-entered min
    // and max values of the slider from the configuration panel
    const $minMaxValues: HTMLInputElement[] = Array.from(
      $(configurationPanel[index]).find('.js-input-min-max__value'),
    ) as HTMLInputElement[];
    const minValue: HTMLInputElement = $minMaxValues[0];
    const maxValue: HTMLInputElement = $minMaxValues[1];

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

    // get from the input field and pass the new value of the number
    // of sliders entered by the user from the configuration panel
    const $amountSliderThumbs: HTMLInputElement[] = Array.from(
      $(configurationPanel[index]).find('.js-input-amount-thumb__value'),
    ) as HTMLInputElement[];

    const handleAmountSliderThumbsBlur = () => {
      const amount = Number($amountSliderThumbs[0].value);
      element.setNewValueAmount(amount);
    };
    $amountSliderThumbs[0].addEventListener(
      'blur',
      handleAmountSliderThumbsBlur,
    );
    // get from the input field and pass the new values of the current
    // states of the thumbs entered by the user from the configuration panel
    const toFindInputsSliderThumbs = (): HTMLInputElement[] => {
      const $element: HTMLInputElement[] = Array.from(
        $(configurationPanel[index]).find('.js-configuration__thumbs-value'),
      ) as HTMLInputElement[];
      return $element;
    };
    const inputsSliderThumbs: HTMLInputElement[] = toFindInputsSliderThumbs();

    new Array(inputsSliderThumbs.length)
      .fill(1)
      .forEach((_element: number, i: number) => {
        const handleInputsSliderThumbsBlur = () => {
          const thumbsValue = Number(inputsSliderThumbs[i].value);
          element.setNewValueThumbsValues(thumbsValue, i);
        };
        inputsSliderThumbs[i].addEventListener(
          'blur',
          handleInputsSliderThumbsBlur,
        );
      });

    // get from the input field and pass the new value of the step size
    // entered by the user from the configuration panel
    const $stepSize: HTMLInputElement[] = Array.from(
      $(configurationPanel[index]).find('.js-input-step-size__value'),
    ) as HTMLInputElement[];

    const handleStepSizeBlur = () => {
      const step = Number($stepSize[0].value);
      element.setNewValueStep(step);
    };
    $stepSize[0].addEventListener('blur', handleStepSizeBlur);

    // get from input field and pass new slider orientation value
    const $orientationSlider: HTMLElement[] = Array.from(
      $(configurationPanel[index]).find('.js-radio-button'),
    );

    new Array($orientationSlider.length)
      .fill(1)
      .forEach((_element: number, i: number) => {
        const handleOrientationSliderClick = () => {
          let orientation = '';
          if (i === 0) {
            orientation = 'horizontal';
          }
          if (i === 1) {
            orientation = 'vertical';
          }
          element.setNewValueOrientation(orientation);
        };
        $orientationSlider[i].addEventListener(
          'click',
          handleOrientationSliderClick,
        );
      });

    // get from the input field and pass the new value of the tooltip presence
    const $checkboxContainer: HTMLInputElement[] = Array.from(
      $(configurationPanel[index]).find('.js-checkbox-button'),
    ) as HTMLInputElement[];
    const $checkboxInput: HTMLInputElement[] = Array.from(
      $(configurationPanel[index]).find('.js-checkbox-button__content'),
    ) as HTMLInputElement[];

    const handleCheckboxContainerClick = () => {
      let checked = true;
      if ($checkboxInput[0].checked) {
        checked = true;
      }
      if (!$checkboxInput[0].checked) {
        checked = false;
      }
      element.setNewValueTooltip(checked);
    };
    $checkboxContainer[0].addEventListener(
      'click',
      handleCheckboxContainerClick,
    );

    const setValueOfInputsSliderThumbs = () => {
      const currentInputsSliderThumbs: HTMLInputElement[] = toFindInputsSliderThumbs();
      new Array(currentInputsSliderThumbs.length)
        .fill(1)
        .forEach((_element: number, i: number) => {
          const thumbsValue = Number(currentInputsSliderThumbs[i].value);
          element.setNewValueThumbsValues(thumbsValue, i);
        });
    };

    const form: IHTMLElement[] = Array.from(
      document.querySelectorAll('.js-configuration'),
    );
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
    };
    form.forEach((elementForm: HTMLElement) => {
      elementForm.addEventListener('submit', handleElementFormSubmit);
    });
  });
});
