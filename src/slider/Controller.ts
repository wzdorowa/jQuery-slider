import { IHTMLElement } from './interfaces/iHTMLElement';
import { IModelState } from './interfaces/iModelState';
import Model from './Model';
import View from './view/View';
import EventEmitter from './EventEmitter';

interface IData {
  value: number;
  index: number;
}

class Controller {
  public slider: IHTMLElement;

  public model: Model;

  constructor(element: IHTMLElement, props: IModelState) {
    this.slider = element;
    this.slider.classList.add('slider');

    const eventEmitter = new EventEmitter();
    new View(this.slider, eventEmitter);
    this.model = new Model(eventEmitter, props);

    this.attachPublicMethods(this.model, eventEmitter);

    eventEmitter.makeSubscribe(
      'view:countThumbs-changed',
      (thumbsValues: number[]) => {
        this.model.overwriteCurrentThumbsValues(thumbsValues);
      },
    );

    eventEmitter.makeSubscribe('view:thumbsValues-changed', (data: IData) => {
      this.model.setNewValueThumbsValues(data.value, data.index);
    });
  }

  // public getState(): IModelState {
  //   const modelState: IModelState = { ...this.model.state };
  //   return modelState;
  // }

  private attachPublicMethods(model: Model, eventEmitter: EventEmitter) {
    this.slider.getState = (): IModelState => {
      const modelState: IModelState = { ...model.state };
      return modelState;
    };
    this.slider.setNewValueMin = (min: number): void => {
      model.setNewValueMin(min);
    };
    this.slider.setNewValueMax = (max: number): void => {
      model.setNewValueMax(max);
    };
    this.slider.setNewValueCount = (count: number): void => {
      model.setNewValueCount(count);
      console.log('после смены значения', model.state);
    };
    this.slider.setNewValueThumbsValues = (
      touchValue: number,
      index: number,
    ): void => {
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
    this.slider.setNewValueScaleOfValues = (value: boolean): void => {
      model.setNewValueScaleOfValues(value);
    };
    this.slider.subscribeToStateModel = (
      handler: (state: IModelState) => void,
      isCreatedInput: boolean,
      countInputs: () => Element[],
      changeCountInputs: (state: IModelState) => void,
      setValueToInputFromModelState: (state: IModelState) => void,
      setValueToStepFromModelState: (state: IModelState) => void,
      setValueToMinInputFromModelState: (state: IModelState) => void,
      setValueMaxInputFromModelState: (state: IModelState) => void,
    ): void => {
      eventEmitter.makeSubscribe(
        'model:state-changed',
        (state: IModelState): void => {
          console.log('model.state', state);

          let isCreatedElement = isCreatedInput;
          console.log('isCreatedElement', isCreatedElement);

          if (!isCreatedElement) {
            handler(state);
            isCreatedElement = true;
          }
          const arrayCountInputs = countInputs();
          console.log('arrayCountInputs', arrayCountInputs);

          if (arrayCountInputs.length !== state.thumbsValues.length) {
            changeCountInputs(state);
          }
          setValueToInputFromModelState(state);
          setValueToStepFromModelState(state);
          setValueToMinInputFromModelState(state);
          setValueMaxInputFromModelState(state);
        },
      );
    };
  }
}
export default Controller;
