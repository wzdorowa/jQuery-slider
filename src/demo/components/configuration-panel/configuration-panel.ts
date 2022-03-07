import { IModelState } from '../../../slider/interfaces/iModelState';
import utilities from './utilities';

class ConfigurationPanel {
  public isCreatedInput: boolean;

  public slider: HTMLElement;

  public sliderIndex: number;

  public element: PlainObject<any>;

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

  constructor(element: JQuery<HTMLElement>, index: number) {
    this.slider = (element[0] as unknown) as HTMLElement;
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

    this.element = element.data();
    this.element.subscribe(state => {
      this.initialize(state);
    });
    this.element.update({
      min: 10,
      max: 100,
      thumbsValues: [10, 22, 40, 50],
      orientation: 'horizontal',
      thumbsCount: 4,
      step: 2,
      isTooltip: true,
      isScaleOfValues: true,
    });

    this.findElements();

    this.listenMinValue();
    this.listenMaxValue();
    this.listenThumbsCount();
    this.listenStepSize();
    this.listenInputsSliderThumbs();
    this.listenOrientationSlider();
    this.listenCheckboxContainer();
    this.listenForm();
  }

  initialize(state: IModelState): void {
    this.createInput(state);
    this.setValueToOrientationFromModelState(state);
    this.setValueToStepFromModelState(state);
    this.setValueToMinInputFromModelState(state);
    this.setValueMaxInputFromModelState(state);
    this.setValueCountThumbsFromModelState(state);
    this.setValueToCheckboxTooltipFromModelState(state);
    this.setValueToCheckboxScaleOfValuesFromModelState(state);
  }

  createInput(state: IModelState): void {
    console.log('state из createInput', state);

    const thumbsCurrentValuesList: HTMLElement[] = Array.from(
      document.querySelectorAll('.js-configuration__thumbs-current-value-list'),
    );

    const fragmentCurrentValueList = document.createDocumentFragment();

    new Array(state.thumbsCount)
      .fill(1)
      .forEach((_element: number, i: number) => {
        const currentValueItem: HTMLElement = utilities.createElement(
          'li',
          'configuration__thumbs-item js-configuration__thumbs-item',
        );
        const currentValueInput: HTMLElement = utilities.createElement(
          'input',
          'configuration__thumbs-value js-configuration__thumbs-value',
        );
        currentValueInput.setAttribute('type', 'number');
        currentValueInput.setAttribute('step', 'any');
        currentValueInput.setAttribute('value', String(state.thumbsValues[i]));

        currentValueItem.append(currentValueInput);
        fragmentCurrentValueList.append(currentValueItem);
      });
    thumbsCurrentValuesList[this.sliderIndex].append(fragmentCurrentValueList);
    if (!this.isCreatedInput) {
      this.isCreatedInput = true;
    }
  }

  setNewValueToNewInputs(state: IModelState): void {
    const thumbsCurrentValuesList: HTMLElement[] = Array.from(
      document.querySelectorAll('.js-configuration__thumbs-current-value-list'),
    );

    const $allThumbs: HTMLInputElement[] = Array.from(
      $(thumbsCurrentValuesList[this.sliderIndex]).find(
        '.js-configuration__thumbs-value',
      ),
    ) as HTMLInputElement[];
    const indexNewInput: number = $allThumbs.length - 1;
    $allThumbs[indexNewInput].value = String(state.thumbsValues[indexNewInput]);
  }

  changeCountInputs(state: IModelState): void {
    const thumbsCurrentValuesList: HTMLElement[] = Array.from(
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
        const currentValueItem: HTMLElement = utilities.createElement(
          'li',
          'configuration__thumbs-item js-configuration__thumbs-item',
        );
        const currentValueInput: HTMLElement = utilities.createElement(
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
  }

  setValueToOrientationFromModelState(state: IModelState): void {
    const configurationPanel: HTMLElement[] = Array.from(
      document.querySelectorAll('.js-configuration'),
    );

    const $buttonsOrientation: HTMLInputElement[] = Array.from(
      $(configurationPanel[this.sliderIndex]).find('.js-radio-button__content'),
    ) as HTMLInputElement[];

    if (state.orientation === 'horizontal') {
      $buttonsOrientation[0].checked = true;
    }
    if (state.orientation === 'vertical') {
      $buttonsOrientation[1].checked = true;
    }
    this.state.orientation = state.orientation;
  }

  setValueToMinInputFromModelState(state: IModelState): void {
    const configurationPanel: HTMLElement[] = Array.from(
      document.querySelectorAll('.js-field__min-max'),
    );

    const $minMaxInputs: HTMLInputElement[] = Array.from(
      $(configurationPanel[this.sliderIndex]).find('.js-input__value'),
    ) as HTMLInputElement[];
    const minInput: HTMLInputElement = $minMaxInputs[0];
    minInput.value = String(state.min);
    this.state.min = state.min;
  }

  setValueMaxInputFromModelState(state: IModelState): void {
    const configurationPanel: HTMLElement[] = Array.from(
      document.querySelectorAll('.js-field__min-max'),
    );

    const $minMaxInputs: HTMLInputElement[] = Array.from(
      $(configurationPanel[this.sliderIndex]).find('.js-input__value'),
    ) as HTMLInputElement[];
    const maxInput: HTMLInputElement = $minMaxInputs[1];
    maxInput.value = String(state.max);
    this.state.max = state.max;
  }

  setValueCountThumbsFromModelState(state: IModelState): void {
    const fieldCountThumbs: HTMLElement[] = Array.from(
      document.querySelectorAll('.js-configuration__field-count-thumb'),
    );
    const countThumbsInput: HTMLInputElement = fieldCountThumbs[
      this.sliderIndex
    ].querySelector('.js-input__value') as HTMLInputElement;
    countThumbsInput.value = String(state.thumbsCount);
    this.state.thumbsCount = state.thumbsCount;
  }

  setValueToInputFromModelState(state: IModelState): void {
    const thumbsCurrentValuesList: HTMLElement[] = Array.from(
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
    this.state.thumbsValues = state.thumbsValues;
  }

  setValueToStepFromModelState(state: IModelState): void {
    const configurationPanel: HTMLElement[] = Array.from(
      document.querySelectorAll('.js-configuration__field-step-size'),
    );

    const $stepSizes: HTMLInputElement[] = Array.from(
      $(configurationPanel[this.sliderIndex]).find('.js-input__value'),
    ) as HTMLInputElement[];

    const stepSize = $stepSizes[0];
    stepSize.value = String(state.step);
    this.state.step = state.step;
  }

  setValueToCheckboxTooltipFromModelState(state: IModelState): void {
    const configurationPanel: HTMLElement[] = Array.from(
      document.querySelectorAll('.js-configuration'),
    );

    const $checkboxTooltip: HTMLInputElement[] = Array.from(
      $(configurationPanel[this.sliderIndex]).find(
        '.js-checkbox-button__tooltip',
      ),
    ) as HTMLInputElement[];

    if (!state.isTooltip) {
      $checkboxTooltip[0].checked = false;
    }
    if (state.isTooltip) {
      $checkboxTooltip[0].checked = true;
    }
    this.state.isTooltip = state.isTooltip;
  }

  setValueToCheckboxScaleOfValuesFromModelState(state: IModelState): void {
    const configurationPanel: HTMLElement[] = Array.from(
      document.querySelectorAll('.js-configuration'),
    );

    const $checkboxScaleOfValues: HTMLInputElement[] = Array.from(
      $(configurationPanel[this.sliderIndex]).find(
        '.js-checkbox-button__scale-of-values',
      ),
    ) as HTMLInputElement[];

    if (!state.isScaleOfValues) {
      $checkboxScaleOfValues[0].checked = false;
    }
    if (state.isScaleOfValues) {
      $checkboxScaleOfValues[0].checked = true;
    }
    this.state.isScaleOfValues = state.isScaleOfValues;
  }

  getCountInputs(): HTMLElement[] {
    const configurationPanel: HTMLDivElement[] = Array.from(
      document.querySelectorAll('.js-configuration'),
    );

    const $countInputs: HTMLElement[] = Array.from(
      $(configurationPanel[this.sliderIndex]).find(
        '.js-configuration__thumbs-value',
      ),
    );
    return $countInputs;
  }

  findElements(): void {
    const configurationPanels = Array.from(
      document.querySelectorAll('.js-configuration'),
    );

    this.elements.panel = configurationPanels[this.sliderIndex] as HTMLElement;

    const $minMaxContainer = $('.js-field__min-max');
    const $minMaxValues: HTMLInputElement[] = Array.from(
      $($minMaxContainer[this.sliderIndex]).find('.js-input__value'),
    ) as HTMLInputElement[];

    [this.elements.minValue, this.elements.maxValue] = $minMaxValues;

    const $countThumbsContainer = $('.js-configuration__field-count-thumb');
    this.elements.countSliderThumbs = Array.from(
      $($countThumbsContainer[this.sliderIndex]).find('.js-input__value'),
    ) as HTMLInputElement[];

    const $thumbsValuesContainer = $('.js-field__thumbs-values');

    this.elements.inputsSliderThumbs = Array.from(
      $($thumbsValuesContainer[this.sliderIndex]).find(
        '.js-configuration__thumbs-value',
      ),
    ) as HTMLInputElement[];

    const $stepSizeContainer = $('.js-configuration__field-step-size');
    this.elements.stepSize = Array.from(
      $($stepSizeContainer[this.sliderIndex]).find('.js-input__value'),
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

  setValueOfInputsSliderThumbs(): void {
    const $thumbsValuesContainer = document.querySelectorAll(
      '.js-field__thumbs-values',
    );
    this.elements.inputsSliderThumbs = Array.from(
      $($thumbsValuesContainer[this.sliderIndex]).find(
        '.js-configuration__thumbs-value',
      ),
    ) as HTMLInputElement[];

    if (this.elements.inputsSliderThumbs !== null) {
      new Array(this.elements.inputsSliderThumbs.length)
        .fill(1)
        .forEach((_element: number, i: number) => {
          if (this.elements.inputsSliderThumbs !== null) {
            const thumbsValue = Number(
              this.elements.inputsSliderThumbs[i].value,
            );
            this.slider.setNewThumbValue(thumbsValue, i);
          }
        });
    }
  }

  listenMinValue(): void {
    if (this.elements.minValue !== null) {
      this.elements.minValue.addEventListener(
        'blur',
        this.handleMinValueBlur.bind(this),
      );
    }
  }

  listenMaxValue(): void {
    if (this.elements.maxValue !== null) {
      this.elements.maxValue.addEventListener(
        'blur',
        this.handleMaxValueBlur.bind(this),
      );
    }
  }

  listenThumbsCount(): void {
    if (this.elements.countSliderThumbs !== null) {
      this.elements.countSliderThumbs[0].addEventListener(
        'blur',
        this.handleCountSliderThumbsBlur.bind(this),
      );
    }
  }

  listenStepSize(): void {
    if (this.elements.stepSize !== null) {
      this.elements.stepSize[0].addEventListener(
        'blur',
        this.handleStepSizeBlur.bind(this),
      );
    }
  }

  listenInputsSliderThumbs(): void {
    if (this.elements.inputsSliderThumbs !== null) {
      new Array(this.elements.inputsSliderThumbs.length)
        .fill(1)
        .forEach((_element: number, i: number) => {
          if (this.elements.inputsSliderThumbs !== null) {
            this.elements.inputsSliderThumbs[i].addEventListener(
              'blur',
              this.handleInputsSliderThumbsBlur.bind(this, i),
            );
          }
        });
    }
  }

  handleInputsSliderThumbsBlur(index: number): void {
    if (this.elements.inputsSliderThumbs !== null) {
      const thumbsValue = Number(this.elements.inputsSliderThumbs[index].value);
      this.slider.setNewThumbValue(thumbsValue, index);
    }
  }

  listenOrientationSlider(): void {
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
              handleOrientationSliderClick.bind(this),
            );
          }
        });
    }
  }

  listenCheckboxContainer(): void {
    if (this.elements.checkboxContainer !== null) {
      this.elements.checkboxContainer[0].addEventListener(
        'click',
        this.handleCheckboxTooltipClick.bind(this),
      );
      this.elements.checkboxContainer[1].addEventListener(
        'click',
        this.handleCheckboxScaleOfValuesClick.bind(this),
      );
    }
  }

  listenForm(): void {
    if (this.elements.forms !== null) {
      this.elements.forms.forEach((elementForm: HTMLElement) => {
        elementForm.addEventListener(
          'submit',
          this.handleElementFormSubmit.bind(this),
        );
      });
    }
  }

  handleMinValueBlur(): void {
    if (this.elements.minValue !== null) {
      const min = Number(this.elements.minValue.value);
      this.slider.setNewValueMin(min);
    }
  }

  handleMaxValueBlur(): void {
    if (this.elements.maxValue !== null) {
      const max = Number(this.elements.maxValue.value);
      this.slider.setNewValueMax(max);
    }
  }

  handleCountSliderThumbsBlur(): void {
    if (this.elements.countSliderThumbs !== null) {
      const count = Number(this.elements.countSliderThumbs[0].value);
      this.slider.setNewValueCount(count);
    }
  }

  handleStepSizeBlur(): void {
    if (this.elements.stepSize !== null) {
      const step = Number(this.elements.stepSize[0].value);
      this.slider.setNewValueStep(step);
    }
  }

  handleCheckboxTooltipClick(): void {
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
  }

  handleCheckboxScaleOfValuesClick(): void {
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
  }

  handleElementFormSubmit: (event: Event) => void = (event): void => {
    const currentEvent: Event = event;
    currentEvent.preventDefault();

    if (this.elements.stepSize !== null) {
      const step = Number(this.elements.stepSize[0].value);
      if (step !== this.state.step) {
        this.slider.setNewValueStep(step);
      }
    }

    if (this.elements.minValue !== null) {
      const min = Number(this.elements.minValue.value);
      if (min !== this.state.min) {
        this.slider.setNewValueMin(min);
      }
    }

    if (this.elements.maxValue !== null) {
      const max = Number(this.elements.maxValue.value);
      if (max !== this.state.max) {
        this.slider.setNewValueMax(max);
      }
    }

    if (this.elements.countSliderThumbs !== null) {
      const count = Number(this.elements.countSliderThumbs[0].value);
      if (count !== this.state.thumbsCount) {
        this.slider.setNewValueCount(count);
      }
    }

    this.setValueOfInputsSliderThumbs();
  };
}
export default ConfigurationPanel;
