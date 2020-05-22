import {Model} from './model';
import {View} from './view/view';
import {EventEmitter} from './eventEmitter';
import {IModelState} from './interfaces/iModelState';
import {IHTMLElement} from './interfaces/iHTMLElement';

(function($){
    $.fn.slider = function(){
        const elements: IHTMLElement[] = Array.from(this) as IHTMLElement[];
        elements.forEach((element: IHTMLElement) => {
            const eventEmitter = new EventEmitter();
            new View(element, eventEmitter);
            const model: Model = new Model(eventEmitter);

            element.getState = (): IModelState => {
                let modelState: IModelState = model.state;
                return modelState;
            }
            element.setNewValueMin = (min: number): void => {
                model.setNewValueMin(min);
            }
            element.setNewValueMax = (max: number): void => {
                model.setNewValueMax(max);
            }
            element.setNewValueAmount = (amount: number): void => {
                model.setNewValueAmount(amount);
            }
            element.setNewValueTouchsValues = (touchValue: number, index: number): void => {
                model.setNewValueTouchsValues(touchValue, index);
            }
            element.setNewValueStep = (step: number): void => {
                model.setNewValueStep(step);
            }
            element.setNewValueOrientation = (value: string): void => {
                model.setNewValueOrientation(value);
            }
            element.setNewValueTooltip = (value: boolean): void => {
                model.setNewValueTooltip(value);
            }

            element.subscribeToStateModel = (handler: (state: IModelState) => void, isCreatedInput: boolean, amountInputs: () => Element[], changeAmountInputs: (state: IModelState) => void,
                 setValueToInputFromModelState: (state: IModelState) => void, setValueToStepFromModelState: (state: IModelState) => void,
                  setValueToMinInputFromModelState: (state: IModelState) => void, setValueMaxInputFromModelState: (state: IModelState) => void): void => {
                eventEmitter.subscribe('model:state-changed', (state: IModelState): void => {
                    if(!isCreatedInput) {
                        handler(state);
                        isCreatedInput = true;
                    }
                    const arrayAmountInputs = amountInputs();
                    if(arrayAmountInputs.length != state.touchsValues.length) {
                        changeAmountInputs(state);
                    }
                    setValueToInputFromModelState(state);
                    setValueToStepFromModelState(state);
                    setValueToMinInputFromModelState(state);
                    setValueMaxInputFromModelState(state);
                })
            }
        });
    }
})(jQuery);