import $ = require ('jquery');
import {Model} from './model';
import {View} from './view';
import {Controller} from './controller';
import {EventEmitter} from './eventEmitter';

interface StateObject {
    min: number
    max: number,
    touchsValues: number[],
    orientation: string,
    amount: number,
    step: number,
    tooltip: boolean,
}
interface IMyElement extends HTMLElement {
    getState: any;
    setNewValueMin: any
    setNewValueMax: any
    setNewValueAmount: any
    setNewValueTouchsValues: any
    setNewValueStep: any
    setNewValueOrientation: any
    setNewValueTooltip: any
    subscribeToStateModel: any
  }
(function($){
    $.fn.slider = function(){
        const elements: IMyElement[] = Array.from(this) as IMyElement[];
        elements.forEach((element: IMyElement, index: number) => {
            const eventEmitter = new EventEmitter();
            const view: View = new View(element, eventEmitter);
            const model: Model = new Model(eventEmitter);
            new Controller(element);
            console.log(index);

            element.getState = (): StateObject => {
                let modelState: StateObject = model.state;
                return modelState;
            }
            element.setNewValueMin = (min: number) => {
                model.setNewValueMin(min);
            }
            element.setNewValueMax = (max: number) => {
                model.setNewValueMax(max);
            }
            element.setNewValueAmount = (amount: number) => {
                model.setNewValueAmount(amount);
            }
            element.setNewValueTouchsValues = (touchValue: number, index: number) => {
                model.setNewValueTouchsValues(touchValue, index);
            }
            element.setNewValueStep = (step: number) => {
                model.setNewValueStep(step);
            }
            element.setNewValueOrientation = (value: string) => {
                model.setNewValueOrientation(value);
            }
            element.setNewValueTooltip = (value: boolean) => {
                model.setNewValueTooltip(value);
            }

            element.subscribeToStateModel = (handler: (state: StateObject) => void, isCreatedInput: boolean, amountInputs: () => Element[], changeAmountInputs: (state: StateObject) => void,
                 setValueToInputFromModelState: (state: StateObject) => void, setValueToStepFromModelState: (state: StateObject) => void,
                  setValueToMinInputFromModelState: (state: StateObject) => void, setValueMaxInputFromModelState: (state: StateObject) => void) => {
                eventEmitter.subscribe('model:state-changed', (state: StateObject) => {
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