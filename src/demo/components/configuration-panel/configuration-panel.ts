import { IModelState } from '../../../slider/interfaces/iModelState';
import utilities from './utilities';

class ConfigurationPanel {
  public connection: JQuery.PlainObject<any>;

  public sliderIndex: number;

  public elements: {
    panel: HTMLElement | null;
    minValue: HTMLInputElement | null;
    maxValue: HTMLInputElement | null;
    countSliderThumbs: HTMLInputElement[] | null;
    inputsSliderThumbs: HTMLInputElement[] | null;
    stepSize: HTMLInputElement[] | null;
    orientationButtons: HTMLInputElement[] | null;
    checkboxContainer: HTMLInputElement[] | null;
    checkboxInputTooltip: HTMLInputElement[] | null;
    checkboxInputScaleOfValues: HTMLInputElement[] | null;
    forms: HTMLElement[] | null;
  };

  constructor(element: JQuery<HTMLElement>, index: number) {
    this.connection = element.data();
    this.sliderIndex = index;

    this.elements = {
      panel: null,
      minValue: null,
      maxValue: null,
      countSliderThumbs: null,
      inputsSliderThumbs: null,
      stepSize: null,
      orientationButtons: null,
      checkboxContainer: null,
      checkboxInputTooltip: null,
      checkboxInputScaleOfValues: null,
      forms: null,
    };

    this.connection.subscribeToModelChanges((state: IModelState) => {
      this.render(state);
    });

    this.connection.subscribeToThumbsChanges((thumbsValues: number[]) => {
      this.updateThumbsValues(thumbsValues);
    });

    this.findElements();
    this.bindEventListeners();
    this.render(this.connection.getState());
  }

  render(state: IModelState): void {
    this.createInput(state);
    this.setValuesFromState(state);
  }

  updateThumbsValues(thumbsValues: number[]): void {
    this.elements.inputsSliderThumbs?.forEach((element, i) => {
      const thumb = element;
      thumb.value = String(thumbsValues[i]);
    });
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
      $thumbsValuesContainer[this.sliderIndex].querySelectorAll(
        '.js-configuration__thumb-value',
      ),
    );

    const $stepSizeContainer = $('.js-configuration__field-step-size');
    this.elements.stepSize = Array.from(
      $($stepSizeContainer[this.sliderIndex]).find('.js-input__value'),
    ) as HTMLInputElement[];

    this.elements.orientationButtons = Array.from(
      $(this.elements.panel).find('.js-radio-button__content'),
    ) as HTMLInputElement[];

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

  setValuesFromState(state: IModelState): void {
    if (this.elements.orientationButtons !== null) {
      if (state.orientation === 'horizontal') {
        this.elements.orientationButtons[0].checked = true;
      }
      if (state.orientation === 'vertical') {
        this.elements.orientationButtons[1].checked = true;
      }
    }

    if (this.elements.minValue !== null) {
      this.elements.minValue.value = String(state.min);
    }
    if (this.elements.maxValue !== null) {
      this.elements.maxValue.value = String(state.max);
    }

    if (this.elements.countSliderThumbs !== null) {
      this.elements.countSliderThumbs[0].value = String(state.thumbsCount);
    }

    if (this.elements.stepSize !== null) {
      this.elements.stepSize[0].value = String(state.step);
    }

    if (this.elements.checkboxInputTooltip !== null) {
      if (!state.tooltipIsActive) {
        this.elements.checkboxInputTooltip[0].checked = false;
      } else {
        this.elements.checkboxInputTooltip[0].checked = true;
      }
    }

    if (this.elements.checkboxInputScaleOfValues !== null) {
      if (!state.scaleValuesIsActive) {
        this.elements.checkboxInputScaleOfValues[0].checked = false;
      }
      if (state.scaleValuesIsActive) {
        this.elements.checkboxInputScaleOfValues[0].checked = true;
      }
    }
  }

  createInput(state: IModelState): void {
    const thumbsCurrentValuesList: HTMLElement[] = Array.from(
      document.querySelectorAll('.js-configuration__thumbs-current-value-list'),
    );

    thumbsCurrentValuesList[this.sliderIndex].innerHTML = '';

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
          'configuration__thumbs-value js-configuration__thumb-value',
        );
        currentValueInput.setAttribute('type', 'number');
        currentValueInput.setAttribute('step', 'any');
        currentValueInput.setAttribute('value', String(state.thumbsValues[i]));

        currentValueItem.append(currentValueInput);
        fragmentCurrentValueList.append(currentValueItem);
      });
    thumbsCurrentValuesList[this.sliderIndex].append(fragmentCurrentValueList);

    this.elements.inputsSliderThumbs = Array.from(
      thumbsCurrentValuesList[this.sliderIndex].querySelectorAll(
        '.js-configuration__thumb-value',
      ),
    );
    this.listenInputsSliderThumbs();
  }

  bindEventListeners(): void {
    this.listenMinValue();
    this.listenMaxValue();
    this.listenThumbsCount();
    this.listenStepSize();
    this.listenOrientationSlider();
    this.listenCheckboxContainer();
    this.listenForm();
  }

  listenMinValue(): void {
    this.elements.minValue?.addEventListener(
      'blur',
      this.handleElementClickOrBlur.bind(this),
    );
  }

  listenMaxValue(): void {
    this.elements.maxValue?.addEventListener(
      'blur',
      this.handleElementClickOrBlur.bind(this),
    );
  }

  listenThumbsCount(): void {
    if (this.elements.countSliderThumbs !== null) {
      this.elements.countSliderThumbs[0].addEventListener(
        'blur',
        this.handleElementClickOrBlur.bind(this),
      );
    }
  }

  listenStepSize(): void {
    if (this.elements.stepSize !== null) {
      this.elements.stepSize[0].addEventListener(
        'blur',
        this.handleElementClickOrBlur.bind(this),
      );
    }
  }

  listenInputsSliderThumbs(): void {
    this.elements.inputsSliderThumbs?.forEach(element => {
      element.addEventListener(
        'blur',
        this.handleElementClickOrBlur.bind(this),
      );
    });
  }

  listenOrientationSlider(): void {
    this.elements.orientationButtons?.forEach(element => {
      element.addEventListener(
        'click',
        this.handleElementClickOrBlur.bind(this),
      );
    });
  }

  listenCheckboxContainer(): void {
    this.elements.checkboxContainer?.forEach(element => {
      element.addEventListener(
        'click',
        this.handleElementClickOrBlur.bind(this),
      );
    });
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

  handleElementClickOrBlur(): void {
    const state = this.getValuesFromAllInputs();
    this.connection.update(state);
  }

  handleElementFormSubmit: (event: Event) => void = (event): void => {
    const currentEvent: Event = event;
    currentEvent.preventDefault();

    const state = this.getValuesFromAllInputs();
    this.connection.update(state);
  };

  getValuesFromAllInputs(): IModelState {
    const state: IModelState = {
      min: Number(this.elements.minValue?.value),
      max: Number(this.elements.maxValue?.value),
      step: 0,
      thumbsCount: 0,
      thumbsValues: [],
      scaleValuesIsActive: true,
      tooltipIsActive: true,
      orientation: 'horizontal',
    };

    if (this.elements.stepSize !== null) {
      state.step = Number(this.elements.stepSize[0].value);
    }

    if (this.elements.countSliderThumbs !== null) {
      state.thumbsCount = Number(this.elements.countSliderThumbs[0].value);
    }

    this.elements.inputsSliderThumbs?.forEach((element, i) => {
      state.thumbsValues[i] = Number(element.value);
    });

    if (this.elements.checkboxInputScaleOfValues !== null) {
      if (!this.elements.checkboxInputScaleOfValues[0].checked) {
        state.scaleValuesIsActive = false;
      }
    }

    if (this.elements.checkboxInputTooltip !== null) {
      if (!this.elements.checkboxInputTooltip[0].checked) {
        state.tooltipIsActive = false;
      }
    }

    if (this.elements.orientationButtons !== null) {
      if (this.elements.orientationButtons[1].checked === true) {
        state.orientation = 'vertical';
      }
    }

    return state;
  }
}
export default ConfigurationPanel;
