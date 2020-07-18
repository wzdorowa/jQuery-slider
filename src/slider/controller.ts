import { IHTMLElement } from './interfaces/iHTMLElement';
import Model from './model';
import View from './view/view';
import EventEmitter from './eventEmitter';
import { IModelState } from './interfaces/iModelState';

interface IData {
    value: number
    index: number
}

export default class Controller {
    public slider: IHTMLElement

    constructor(element: IHTMLElement) {
      this.slider = element;
      this.slider.classList.add('slider');

      const eventEmitter = new EventEmitter();
      const view = new View(this.slider, eventEmitter);
      const model: Model = new Model(eventEmitter);

      this.slider.getState = (): IModelState => {
        const modelState: IModelState = model.state;
        return modelState;
      };
      this.slider.setNewValueMin = (min: number): void => {
        model.setNewValueMin(min);
      };
      this.slider.setNewValueMax = (max: number): void => {
        model.setNewValueMax(max);
      };
      this.slider.setNewValueAmount = (amount: number): void => {
        model.setNewValueAmount(amount);
      };
      this.slider.setNewValueThumbsValues = (touchValue: number, index: number): void => {
        model.setNewValueThumbsValues(touchValue, index);
      };
      this.slider.setNewValueStep = (step: number): void => {
        model.setNewValueStep(step);
      };
      this.slider.setNewValueOrientation = (value: string): void => {
        model.setNewValueOrientation(value);
      };
      this.slider.setNewValueTooltip = (value: boolean): void => {
        model.setNewValueTooltip(value);
      };
      this.slider.subscribeToStateModel = (handler: (state: IModelState) => void,
        isCreatedInput: boolean, amountInputs: () => Element[],
        changeAmountInputs: (state: IModelState) => void,
        setValueToInputFromModelState: (state: IModelState) => void,
        setValueToStepFromModelState: (state: IModelState) => void,
        setValueToMinInputFromModelState: (state: IModelState) => void,
        setValueMaxInputFromModelState: (state: IModelState) => void): void => {
        eventEmitter.makeSubscribe('model:state-changed', (state: IModelState): void => {
          if (!isCreatedInput) {
            handler(state);
            isCreatedInput = true;
          }
          const arrayAmountInputs = amountInputs();
          if (arrayAmountInputs.length !== state.thumbsValues.length) {
            changeAmountInputs(state);
          }
          setValueToInputFromModelState(state);
          setValueToStepFromModelState(state);
          setValueToMinInputFromModelState(state);
          setValueMaxInputFromModelState(state);
        });
      };
      eventEmitter.makeSubscribe('view:amountThumbs-changed', (thumbsValues: number[]) => {
        model.overwriteCurrentThumbsValues(thumbsValues);
      });

      eventEmitter.makeSubscribe('view:thumbsValues-changed', (data: IData) => {
        model.setCurrentThumbsValues(data.value, data.index);
      });
    }
}
