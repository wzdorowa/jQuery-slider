import { IModelState } from '../../../slider/interfaces/iModelState';
import { IHTMLElement } from '../../../slider/interfaces/iHTMLElement';

class ConfigurationPanel {
  public isCreatedInput: boolean;

  public slider: IHTMLElement;

  public sliderIndex: number;

  public elements: {
    panel: HTMLElement | null;
    minValue: HTMLInputElement | null;
    maxValue: HTMLInputElement | null;
    countSliderThumbs: HTMLInputElement[] | null;
    inputsSliderThumbs: HTMLInputElement[] | null;
    stepSize: HTMLInputElement[] | null;
    orientationSlider: HTMLElement[] | null;
    checkboxContainer: HTMLInputElement[] | null;
    checkboxInputTooltip: HTMLInputElement[] | null;
    checkboxInputScaleOfValues: HTMLInputElement[] | null;
    forms: HTMLElement[] | null;
  };

  public state: IModelState;

  constructor(element: IHTMLElement, index: number) {
    this.slider = element;
    this.isCreatedInput = false;
    this.sliderIndex = index;
    this.elements = {
      panel: null,
      minValue: null,
      maxValue: null,
      countSliderThumbs: null,
      inputsSliderThumbs: null,
      stepSize: null,
      orientationSlider: null,
      checkboxContainer: null,
      checkboxInputTooltip: null,
      checkboxInputScaleOfValues: null,
      forms: null,
    };
    this.state = {
      min: 0,
      max: 100,
      thumbsValues: [20, 32, 44, 60],
      orientation: 'horizontal',
      thumbsCount: 4,
      step: 2,
      isTooltip: true,
      isScaleOfValues: true,
    };

    this.slider.subscribeToStateModel(
      this.createInput,
      this.isCreatedInput,
      this.getCountInputs,
      this.changeCountInputs,
      this.setValueToInputFromModelState,
      this.setValueToStepFromModelState,
      this.setValueToMinInputFromModelState,
      this.setValueMaxInputFromModelState,
    );
  }

  initialize() {
    this.getState();
    this.createInput(this.state);
    this.setValueToStepFromModelState(this.state);
    this.setValueToMinInputFromModelState(this.state);
    this.setValueMaxInputFromModelState(this.state);
  }

  getState() {
    this.state = this.slider.getState();
  }

  createElement = (tag: string, className: string) => {
    const htmlElement: IHTMLElement = document.createElement(
      tag,
    ) as IHTMLElement;
    htmlElement.className = className;
    return htmlElement;
  };

  createInput = (state: IModelState) => {
    const thumbsCurrentValuesList: IHTMLElement[] = Array.from(
      document.querySelectorAll('.js-configuration__thumbs-current-value-list'),
    );

    const fragmentCurrentValueList = document.createDocumentFragment();

    new Array(state.thumbsCount)
      .fill(1)
      .forEach((_element: number, i: number) => {
        const currentValueItem: HTMLElement = this.createElement(
          'li',
          'configuration__thumbs-item js-configuration__thumbs-item',
        );
        const currentValueInput: HTMLElement = this.createElement(
          'input',
          'configuration__thumbs-value js-configuration__thumbs-value',
        );
        currentValueInput.setAttribute('type', 'number');
        currentValueInput.setAttribute('value', String(state.thumbsValues[i]));

        currentValueItem.append(currentValueInput);
        fragmentCurrentValueList.append(currentValueItem);
      });
    thumbsCurrentValuesList[this.sliderIndex].append(fragmentCurrentValueList);
    if (!this.isCreatedInput) {
      this.isCreatedInput = true;
    }
  };

  setNewValueToNewInputs = (state: IModelState) => {
    const thumbsCurrentValuesList: IHTMLElement[] = Array.from(
      document.querySelectorAll('.js-configuration__thumbs-current-value-list'),
    );

    const $allThumbs: HTMLInputElement[] = Array.from(
      $(thumbsCurrentValuesList[this.sliderIndex]).find(
        '.js-configuration__thumbs-value',
      ),
    ) as HTMLInputElement[];
    const indexNewInput: number = $allThumbs.length - 1;
    $allThumbs[indexNewInput].value = String(state.thumbsValues[indexNewInput]);
  };

  changeCountInputs = (state: IModelState) => {
    const thumbsCurrentValuesList: IHTMLElement[] = Array.from(
      document.querySelectorAll('.js-configuration__thumbs-current-value-list'),
    );
    const $countInputs: HTMLElement[] = Array.from(
      $(thumbsCurrentValuesList[this.sliderIndex]).find(
        '.js-configuration__thumbs-item',
      ),
    );

    if ($countInputs.length < state.thumbsCount) {
      const missingCount: number = state.thumbsCount - $countInputs.length;

      const fragmentCurrentValueList = document.createDocumentFragment();
      new Array(missingCount).fill(1).forEach((_element: number, i: number) => {
        const currentValueItem: HTMLElement = this.createElement(
          'li',
          'configuration__thumbs-item js-configuration__thumbs-item',
        );
        const currentValueInput: HTMLElement = this.createElement(
          'input',
          'configuration__thumbs-value js-configuration__thumbs-value',
        );
        currentValueInput.setAttribute('type', 'number');
        currentValueInput.setAttribute('value', String(state.thumbsValues[i]));

        currentValueItem.append(currentValueInput);
        fragmentCurrentValueList.append(currentValueItem);

        this.setNewValueToNewInputs(state);
      });
      thumbsCurrentValuesList[this.sliderIndex].append(
        fragmentCurrentValueList,
      );
    }
    if ($countInputs.length > state.thumbsCount) {
      const excessCount: number = $countInputs.length - state.thumbsCount;

      const $allCurrentValuesInputs: HTMLElement[] = Array.from(
        $(thumbsCurrentValuesList[this.sliderIndex]).find(
          '.js-configuration__thumbs-item',
        ),
      );
      new Array(excessCount).fill(1).forEach(() => {
        $allCurrentValuesInputs[$allCurrentValuesInputs.length - 1].remove();
        $allCurrentValuesInputs.splice(-1, 1);
      });
    }
  };

  setValueToInputFromModelState = (state: IModelState) => {
    const thumbsCurrentValuesList: IHTMLElement[] = Array.from(
      document.querySelectorAll('.js-configuration__thumbs-current-value-list'),
    );

    const $allThumbs: HTMLInputElement[] = Array.from(
      $(thumbsCurrentValuesList[this.sliderIndex]).find(
        '.js-configuration__thumbs-value',
      ),
    ) as HTMLInputElement[];

    new Array(state.thumbsValues.length)
      .fill(1)
      .forEach((_element: number, i: number) => {
        $allThumbs[i].value = String(state.thumbsValues[i]);
      });
  };

  setValueToStepFromModelState = (state: IModelState) => {
    const configurationPanel: IHTMLElement[] = Array.from(
      document.querySelectorAll('.js-configuration'),
    );

    const $stepSizes: HTMLInputElement[] = Array.from(
      $(configurationPanel[this.sliderIndex]).find(
        '.js-input-step-size__value',
      ),
    ) as HTMLInputElement[];
    const stepSize = $stepSizes[0];
    stepSize.value = String(state.step);
  };

  setValueToMinInputFromModelState = (state: IModelState) => {
    const configurationPanel: IHTMLElement[] = Array.from(
      document.querySelectorAll('.js-configuration'),
    );

    const $minMaxInputs: HTMLInputElement[] = Array.from(
      $(configurationPanel[this.sliderIndex]).find('.js-input-min-max__value'),
    ) as HTMLInputElement[];
    const minInput: HTMLInputElement = $minMaxInputs[0];
    minInput.value = String(state.min);
  };

  setValueMaxInputFromModelState = (state: IModelState) => {
    const configurationPanel: IHTMLElement[] = Array.from(
      document.querySelectorAll('.js-configuration'),
    );

    const $minMaxInputs: HTMLInputElement[] = Array.from(
      $(configurationPanel[this.sliderIndex]).find('.js-input-min-max__value'),
    ) as HTMLInputElement[];
    const maxInput: HTMLInputElement = $minMaxInputs[1];
    maxInput.value = String(state.max);
  };

  getCountInputs = () => {
    const configurationPanel: HTMLDivElement[] = Array.from(
      document.querySelectorAll('.js-configuration'),
    );

    const $countInputs: HTMLElement[] = Array.from(
      $(configurationPanel[this.sliderIndex]).find(
        '.js-configuration__thumbs-value',
      ),
    );
    return $countInputs;
  };

  findElements() {
    const configurationPanels = Array.from(
      document.querySelectorAll('.js-configuration'),
    );
    this.elements.panel = configurationPanels[this.sliderIndex] as HTMLElement;

    const $minMaxValues: HTMLInputElement[] = Array.from(
      $(this.elements.panel).find('.js-input-min-max__value'),
    ) as HTMLInputElement[];

    [this.elements.minValue, this.elements.maxValue] = $minMaxValues;

    this.elements.countSliderThumbs = Array.from(
      $(this.elements.panel).find('.js-input-count-thumb__value'),
    ) as HTMLInputElement[];

    this.elements.inputsSliderThumbs = Array.from(
      $(this.elements.panel).find('.js-configuration__thumbs-value'),
    ) as HTMLInputElement[];

    this.elements.stepSize = Array.from(
      $(this.elements.panel).find('.js-input-step-size__value'),
    ) as HTMLInputElement[];

    this.elements.orientationSlider = Array.from(
      $(this.elements.panel).find('.js-radio-button'),
    );

    this.elements.checkboxContainer = Array.from(
      $(this.elements.panel).find('.js-checkbox-button'),
    ) as HTMLInputElement[];
    this.elements.checkboxInputTooltip = Array.from(
      $(this.elements.panel).find('.js-checkbox-button__tooltip'),
    ) as HTMLInputElement[];
    this.elements.checkboxInputScaleOfValues = Array.from(
      $(this.elements.panel).find('.js-checkbox-button__scale-of-values'),
    ) as HTMLInputElement[];

    this.elements.forms = Array.from(
      document.querySelectorAll('.js-configuration'),
    ) as HTMLElement[];
  }

  setValueOfInputsSliderThumbs = () => {
    this.findElements();
    if (this.elements.inputsSliderThumbs !== null) {
      new Array(this.elements.inputsSliderThumbs.length)
        .fill(1)
        .forEach((_element: number, i: number) => {
          if (this.elements.inputsSliderThumbs !== null) {
            const thumbsValue = Number(
              this.elements.inputsSliderThumbs[i].value,
            );
            this.slider.setNewValueThumbsValues(thumbsValue, i);
          }
        });
    }
  };

  listenMinValue() {
    if (this.elements.minValue !== null) {
      this.elements.minValue.addEventListener('blur', this.handleMinValueBlur);
    }
  }

  listenMaxValue() {
    if (this.elements.maxValue !== null) {
      this.elements.maxValue.addEventListener('blur', this.handleMaxValueBlur);
    }
  }

  listenThumbsCount() {
    if (this.elements.countSliderThumbs !== null) {
      this.elements.countSliderThumbs[0].addEventListener(
        'blur',
        this.handleCountSliderThumbsBlur,
      );
    }
  }

  listenStepSize() {
    if (this.elements.stepSize !== null) {
      this.elements.stepSize[0].addEventListener(
        'blur',
        this.handleStepSizeBlur,
      );
    }
  }

  listenInputsSliderThumbs() {
    if (this.elements.inputsSliderThumbs !== null) {
      new Array(this.elements.inputsSliderThumbs.length)
        .fill(1)
        .forEach((_element: number, i: number) => {
          if (this.elements.inputsSliderThumbs !== null) {
            const handleInputsSliderThumbsBlur = () => {
              if (this.elements.inputsSliderThumbs !== null) {
                const thumbsValue = Number(
                  this.elements.inputsSliderThumbs[i].value,
                );
                this.slider.setNewValueThumbsValues(thumbsValue, i);
              }
            };

            this.elements.inputsSliderThumbs[i].addEventListener(
              'blur',
              handleInputsSliderThumbsBlur,
            );
          }
        });
    }
  }

  listenOrientationSlider() {
    if (this.elements.orientationSlider !== null) {
      new Array(this.elements.orientationSlider.length)
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
            this.slider.setNewValueOrientation(orientation);
          };
          if (this.elements.orientationSlider !== null) {
            this.elements.orientationSlider[i].addEventListener(
              'click',
              handleOrientationSliderClick,
            );
          }
        });
    }
  }

  listenCheckboxContainer() {
    if (this.elements.checkboxContainer !== null) {
      this.elements.checkboxContainer[0].addEventListener(
        'click',
        this.handleCheckboxTooltipClick,
      );
      this.elements.checkboxContainer[1].addEventListener(
        'click',
        this.handleCheckboxScaleOfValuesClick,
      );
    }
  }

  listenForm() {
    if (this.elements.forms !== null) {
      this.elements.forms.forEach((elementForm: HTMLElement) => {
        elementForm.addEventListener('submit', this.handleElementFormSubmit);
      });
    }
  }

  handleMinValueBlur = () => {
    if (this.elements.minValue !== null) {
      const min = Number(this.elements.minValue.value);
      this.slider.setNewValueMin(min);
    }
  };

  handleMaxValueBlur = () => {
    if (this.elements.maxValue !== null) {
      const max = Number(this.elements.maxValue.value);
      this.slider.setNewValueMax(max);
    }
  };

  handleCountSliderThumbsBlur = () => {
    if (this.elements.countSliderThumbs !== null) {
      const count = Number(this.elements.countSliderThumbs[0].value);
      this.slider.setNewValueCount(count);
    }
  };

  handleStepSizeBlur = () => {
    if (this.elements.stepSize !== null) {
      const step = Number(this.elements.stepSize[0].value);
      this.slider.setNewValueStep(step);
    }
  };

  handleCheckboxTooltipClick = () => {
    if (this.elements.checkboxInputTooltip !== null) {
      let isChecked = true;
      if (this.elements.checkboxInputTooltip[0].checked) {
        isChecked = true;
      }
      if (!this.elements.checkboxInputTooltip[0].checked) {
        isChecked = false;
      }
      this.slider.setNewValueTooltip(isChecked);
    }
  };

  handleCheckboxScaleOfValuesClick = () => {
    if (this.elements.checkboxInputScaleOfValues !== null) {
      let isChecked = true;
      if (this.elements.checkboxInputScaleOfValues[0].checked) {
        isChecked = true;
      }
      if (!this.elements.checkboxInputScaleOfValues[0].checked) {
        isChecked = false;
      }
      this.slider.setNewValueScaleOfValues(isChecked);
    }
  };

  handleElementFormSubmit: (event: Event) => void = (event): void => {
    const currentEvent: Event = event;
    currentEvent.preventDefault();

    if (this.elements.minValue !== null) {
      const min = Number(this.elements.minValue.value);
      this.slider.setNewValueMin(min);
    }

    if (this.elements.maxValue !== null) {
      const max = Number(this.elements.maxValue.value);
      this.slider.setNewValueMax(max);
    }

    if (this.elements.countSliderThumbs !== null) {
      const count = Number(this.elements.countSliderThumbs[0].value);
      this.slider.setNewValueCount(count);
    }

    this.setValueOfInputsSliderThumbs();

    if (this.elements.stepSize !== null) {
      const step = Number(this.elements.stepSize[0].value);
      this.slider.setNewValueStep(step);
    }
  };
}

const elements: IHTMLElement[] = Array.from($('.js-slider-test'));
elements.forEach((element: IHTMLElement, index: number) => {
  new ConfigurationPanel(element, index);
});
console.log('elements', elements);
