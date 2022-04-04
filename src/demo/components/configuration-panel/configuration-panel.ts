import { IModelState } from '../../../slider/interfaces/iModelState';
import utilities from './utilities';

type panelElements = {
  panel: HTMLElement;
  minValue: HTMLInputElement;
  maxValue: HTMLInputElement;
  countSliderThumbs: HTMLInputElement[];
  inputsSliderThumbs: HTMLInputElement[];
  stepSize: HTMLInputElement[];
  orientationButtons: HTMLInputElement[];
  checkboxContainer: HTMLInputElement[];
  checkboxInputTooltip: HTMLInputElement[];
  checkboxInputScaleOfValues: HTMLInputElement[];
  forms: HTMLElement[];
};
class ConfigurationPanel {
  public connection: JQuery.PlainObject<any>;

  public sliderIndex: number;

  public elements: panelElements;

  constructor(element: JQuery<HTMLElement>, index: number) {
    this.connection = element.data();
    this.sliderIndex = index;

    this.elements = this.findElements();

    this.connection.subscribeToStateChanges((state: IModelState) => {
      this.render(state);
    });

    this.connection.subscribeToThumbsChanges((thumbsValues: number[]) => {
      this.updateThumbsValues(thumbsValues);
    });

    this.bindEventListeners();
    this.render(this.connection.getState());
  }

  private render(state: IModelState): void {
    this.createInput(state);
    this.setValuesFromState(state);
  }

  private updateThumbsValues(thumbsValues: number[]): void {
    this.elements.inputsSliderThumbs?.forEach((element, i) => {
      const thumb = element;
      thumb.value = String(thumbsValues[i]);
    });
  }

  private findElements(): panelElements {
    const configurationPanels = Array.from(
      document.querySelectorAll('.js-configuration'),
    );

    const panel = configurationPanels[this.sliderIndex] as HTMLElement;

    const $minMaxContainer = $('.js-field__min-max');
    const $minMaxValues: HTMLInputElement[] = Array.from(
      $($minMaxContainer[this.sliderIndex]).find('.js-input__value'),
    ) as HTMLInputElement[];
    const [$minValue, $maxValue] = $minMaxValues;

    const $countThumbsContainer = $('.js-configuration__field-count-thumb');
    const $countSliderThumbs = Array.from(
      $($countThumbsContainer[this.sliderIndex]).find('.js-input__value'),
    ) as HTMLInputElement[];

    const $thumbsValuesContainer = $('.js-field__thumbs-values');
    const $inputsSliderThumbs = Array.from(
      $thumbsValuesContainer[this.sliderIndex].querySelectorAll(
        '.js-configuration__thumb-value',
      ),
    ) as HTMLInputElement[];

    const $stepSizeContainer = $('.js-configuration__field-step-size');
    const $stepSize = Array.from(
      $($stepSizeContainer[this.sliderIndex]).find('.js-input__value'),
    ) as HTMLInputElement[];

    const $orientationButtons = Array.from(
      $(panel).find('.js-radio-button__content'),
    ) as HTMLInputElement[];

    const $checkboxContainer = Array.from(
      $(panel).find('.js-checkbox-button'),
    ) as HTMLInputElement[];

    const $checkboxInputTooltip = ($(panel).find(
      '[name = "tooltip"]',
    ) as unknown) as HTMLInputElement[];

    const $checkboxInputScaleOfValues = ($(panel).find(
      '[name = "scale-of-values"]',
    ) as unknown) as HTMLInputElement[];

    const $forms = Array.from(
      document.querySelectorAll('.js-configuration'),
    ) as HTMLElement[];

    const panelElements: panelElements = {
      panel,
      minValue: $minValue,
      maxValue: $maxValue,
      countSliderThumbs: $countSliderThumbs,
      inputsSliderThumbs: $inputsSliderThumbs,
      stepSize: $stepSize,
      orientationButtons: $orientationButtons,
      checkboxContainer: $checkboxContainer,
      checkboxInputTooltip: $checkboxInputTooltip,
      checkboxInputScaleOfValues: $checkboxInputScaleOfValues,
      forms: $forms,
    };

    return panelElements;
  }

  private setValuesFromState(state: IModelState): void {
    if (state.orientation === 'horizontal') {
      this.elements.orientationButtons[0].checked = true;
    }
    if (state.orientation === 'vertical') {
      this.elements.orientationButtons[1].checked = true;
    }

    this.elements.minValue.value = String(state.min);

    this.elements.maxValue.value = String(state.max);

    this.elements.countSliderThumbs[0].value = String(
      state.thumbsValues.length,
    );

    this.elements.stepSize[0].value = String(state.step);

    this.elements.checkboxInputTooltip[0].checked = state.hasTooltips;

    this.elements.checkboxInputScaleOfValues[0].checked = state.hasScaleValues;
  }

  private createInput(state: IModelState): void {
    const thumbsCurrentValuesList: HTMLElement[] = Array.from(
      document.querySelectorAll('.js-configuration__thumbs-current-value-list'),
    );

    thumbsCurrentValuesList[this.sliderIndex].innerHTML = '';

    const fragmentCurrentValueList = document.createDocumentFragment();

    state.thumbsValues.forEach((_element: number, i: number) => {
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

  private bindEventListeners(): void {
    this.listenMinValue();
    this.listenMaxValue();
    this.listenThumbsCount();
    this.listenStepSize();
    this.listenOrientationSlider();
    this.listenCheckboxContainer();
    this.listenForm();
  }

  private listenMinValue(): void {
    this.elements.minValue.addEventListener(
      'blur',
      this.handleElementClickOrBlur,
    );
  }

  private listenMaxValue(): void {
    this.elements.maxValue.addEventListener(
      'blur',
      this.handleElementClickOrBlur,
    );
  }

  private listenThumbsCount(): void {
    this.elements.countSliderThumbs[0].addEventListener(
      'blur',
      this.handleElementClickOrBlur,
    );
  }

  private listenStepSize(): void {
    this.elements.stepSize[0].addEventListener(
      'blur',
      this.handleElementClickOrBlur,
    );
  }

  private listenInputsSliderThumbs(): void {
    this.elements.inputsSliderThumbs.forEach(element => {
      element.addEventListener('blur', this.handleElementClickOrBlur);
    });
  }

  private listenOrientationSlider(): void {
    this.elements.orientationButtons.forEach(element => {
      element.addEventListener('click', this.handleElementClickOrBlur);
    });
  }

  private listenCheckboxContainer(): void {
    this.elements.checkboxContainer.forEach(element => {
      element.addEventListener('click', this.handleElementClickOrBlur);
    });
  }

  private listenForm(): void {
    this.elements.forms.forEach((elementForm: HTMLElement) => {
      elementForm.addEventListener('submit', this.handleElementFormSubmit);
    });
  }

  private handleElementClickOrBlur = (): void => {
    const state = this.getValuesFromAllInputs();
    this.connection.update(state);
  };

  private handleElementFormSubmit: (event: Event) => void = (event): void => {
    const currentEvent: Event = event;
    currentEvent.preventDefault();

    const state = this.getValuesFromAllInputs();
    this.connection.update(state);
  };

  private getValuesFromAllInputs(): IModelState {
    const state: IModelState = {
      min: Number(this.elements.minValue?.value),
      max: Number(this.elements.maxValue?.value),
      step: 0,
      thumbsValues: [],
      hasScaleValues: true,
      hasTooltips: true,
      orientation: 'horizontal',
    };

    state.step = Number(this.elements.stepSize[0].value);

    this.elements.inputsSliderThumbs?.forEach((element, i) => {
      state.thumbsValues[i] = Number(element.value);
    });

    const thumbsCount = Number(this.elements.countSliderThumbs[0].value);

    if (thumbsCount > state.thumbsValues.length) {
      const missingNumber = thumbsCount - state.thumbsValues.length;
      new Array(missingNumber).fill(1).forEach(() => {
        const lastThumbIndex = state.thumbsValues.length - 1;
        const nextThumbIndex = state.thumbsValues.length;
        state.thumbsValues[nextThumbIndex] =
          state.thumbsValues[lastThumbIndex] + state.step;
      });
    }

    if (thumbsCount < state.thumbsValues.length) {
      const excessNumber = state.thumbsValues.length - thumbsCount;
      const lastThumbIndex = state.thumbsValues.length - excessNumber;
      state.thumbsValues.splice(lastThumbIndex, excessNumber);
    }

    if (!this.elements.checkboxInputScaleOfValues[0].checked) {
      state.hasScaleValues = false;
    }

    if (!this.elements.checkboxInputTooltip[0].checked) {
      state.hasTooltips = false;
    }

    if (this.elements.orientationButtons[1].checked === true) {
      state.orientation = 'vertical';
    }

    return state;
  }
}
export default ConfigurationPanel;
