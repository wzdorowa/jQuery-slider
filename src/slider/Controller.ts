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

    eventEmitter.makeSubscribe('view:thumbValue-changed', (data: IData) => {
      this.model.setNewThumbValue(data.value, data.index);
    });

    eventEmitter.makeSubscribe(
      'view:update-thumbs-position',
      (currentValue: number) => {
        this.model.findAndSetTheNearestThumb(currentValue);
      },
    );

    eventEmitter.makeSubscribe(
      'view:update-thumbs-position-on-serif-scale',
      (index: number, valuesSerifs: []) => {
        this.model.findAndSetTheNearestThumb(valuesSerifs[index]);
      },
    );
  }

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
    };
    this.slider.setNewThumbValue = (
      touchValue: number,
      index: number,
    ): void => {
      model.setNewThumbValue(touchValue, index);
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
      setValueCountThumbsFromModelState: (state: IModelState) => void,
    ): void => {
      eventEmitter.makeSubscribe(
        'model:state-changed',
        (state: IModelState): void => {
          let isCreatedElement = isCreatedInput;

          if (!isCreatedElement) {
            handler(state);
            isCreatedElement = true;
          }
          const arrayCountInputs = countInputs();

          if (arrayCountInputs.length !== state.thumbsValues.length) {
            changeCountInputs(state);
          }
          setValueToInputFromModelState(state);
          setValueToStepFromModelState(state);
          setValueToMinInputFromModelState(state);
          setValueMaxInputFromModelState(state);
          setValueCountThumbsFromModelState(state);
        },
      );
    };
  }
}
export default Controller;
