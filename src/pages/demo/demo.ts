import { IModelState } from '../../slider/interfaces/iModelState';
import { IHTMLElement } from '../../slider/interfaces/iHTMLElement';

$(() => {
  $('.js-slider-test').slider({
    min: 20,
    max: 80,
    step: 5,
    thumbsValues: [25, 45, 60],
    thumbsCount: 3,
    isTooltip: true,
    isScaleOfValues: false
  });

  const elements: IHTMLElement[] = Array.from($('.js-slider-test'));

  elements.forEach((element: IHTMLElement, index: number) => {
    let isCreatedInput = false;

    const createElement = (tag: string, className: string) => {
      const htmlElement: IHTMLElement = document.createElement(
        tag,
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

      const fragmentCurrentValueList = document.createDocumentFragment();

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
          currentValueInput.setAttribute('type', 'number');
          currentValueInput.setAttribute(
            'value',
            String(state.thumbsValues[i]),
          );

          currentValueItem.append(currentValueInput);
          fragmentCurrentValueList.append(currentValueItem);
        });
      thumbsCurrentValuesList[index].append(fragmentCurrentValueList);
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
    const changeCountInputs = (state: IModelState) => {
      const thumbsCurrentValuesList: IHTMLElement[] = Array.from(
        document.querySelectorAll(
          '.js-configuration__thumbs-current-value-list',
        ),
      );
      const $countInputs: HTMLElement[] = Array.from(
        $(thumbsCurrentValuesList[index]).find(
          '.js-configuration__thumbs-item',
        ),
      );

      if ($countInputs.length < state.thumbsCount) {
        const missingCount: number = state.thumbsCount - $countInputs.length;

        const fragmentCurrentValueList = document.createDocumentFragment();
        new Array(missingCount)
          .fill(1)
          .forEach((_element: number, i: number) => {
            const $currentCountInputs: HTMLElement[] = Array.from(
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
            currentValueInput.setAttribute('type', 'number');
            currentValueInput.setAttribute(
              'value',
              String(state.thumbsValues[i]),
            );

            currentValueItem.append(currentValueInput);
            fragmentCurrentValueList.append(currentValueItem);

            setNewValueToNewInputs(state);
          });
        thumbsCurrentValuesList[index].append(fragmentCurrentValueList);
      }
      if ($countInputs.length > state.thumbsCount) {
        const excessCount: number = $countInputs.length - state.thumbsCount;

        const $allCurrentValuesInputs: HTMLElement[] = Array.from(
          $(thumbsCurrentValuesList[index]).find(
            '.js-configuration__thumbs-item',
          ),
        );
        new Array(excessCount).fill(1).forEach(() => {
          $allCurrentValuesInputs[$allCurrentValuesInputs.length - 1].remove();
          $allCurrentValuesInputs.splice(-1, 1);
        });
      }
    };
    const setValueToInputFromModelState = (state: IModelState) => {
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

      new Array(state.thumbsValues.length)
        .fill(1)
        .forEach((_element: number, i: number) => {
          $allThumbs[i].value = String(state.thumbsValues[i]);
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

    const getCountInputs = () => {
      const configurationPanel: HTMLDivElement[] = Array.from(
        document.querySelectorAll('.js-configuration'),
      );

      const $countInputs: HTMLElement[] = Array.from(
        $(configurationPanel[index]).find('.js-configuration__thumbs-value'),
      );
      return $countInputs;
    };

    element.subscribeToStateModel(
      createInput,
      isCreatedInput,
      getCountInputs,
      changeCountInputs,
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
    const $countSliderThumbs: HTMLInputElement[] = Array.from(
      $(configurationPanel[index]).find('.js-input-count-thumb__value'),
    ) as HTMLInputElement[];

    const handleCountSliderThumbsBlur = () => {
      const count = Number($countSliderThumbs[0].value);
      element.setNewValueCount(count);
    };
    $countSliderThumbs[0].addEventListener('blur', handleCountSliderThumbsBlur);
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
    const $checkboxInputTooltip: HTMLInputElement[] = Array.from(
      $(configurationPanel[index]).find('.js-checkbox-button__tooltip'),
    ) as HTMLInputElement[];
    const $checkboxInputScaleOfValues: HTMLInputElement[] = Array.from(
      $(configurationPanel[index]).find('.js-checkbox-button__scale-of-values'),
    ) as HTMLInputElement[];

    const handleCheckboxTooltipClick = () => {
      let isChecked = true;
      if ($checkboxInputTooltip[0].checked) {
        isChecked = true;
      }
      if (!$checkboxInputTooltip[0].checked) {
        isChecked = false;
      }
      element.setNewValueTooltip(isChecked);
    };
    const handleCheckboxScaleOfValuesClick = () => {
      let isChecked = true;
      if ($checkboxInputScaleOfValues[0].checked) {
        isChecked = true;
      }
      if (!$checkboxInputScaleOfValues[0].checked) {
        isChecked = false;
      }
      element.setNewValueScaleOfValues(isChecked);
    };
    $checkboxContainer[0].addEventListener('click', handleCheckboxTooltipClick);
    $checkboxContainer[1].addEventListener(
      'click',
      handleCheckboxScaleOfValuesClick,
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

      const count = Number($countSliderThumbs[0].value);
      element.setNewValueCount(count);

      setValueOfInputsSliderThumbs();

      const step = Number($stepSize[0].value);
      element.setNewValueStep(step);
    };
    form.forEach((elementForm: HTMLElement) => {
      elementForm.addEventListener('submit', handleElementFormSubmit);
    });
  });
});
