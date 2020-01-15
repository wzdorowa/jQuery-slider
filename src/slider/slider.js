import {Model} from './model.js';
import {View} from './view.js';
import {Controller} from './controller.js';
import {EventEmitter} from './eventEmitter.js';

(function($){
    $.fn.slider = function(){
        const elements = Array.from(this);
        elements.forEach((element, index) => {
            const eventEmitter = new EventEmitter();
            const view = new View(element, eventEmitter);
            const model = new Model(eventEmitter);
            new Controller(element, model, view);
            console.log(index);

            element.getState = () => {
                let modelState = model.state;
                return modelState;
            }
            element.setNewValueMin = (min) => {
                model.setNewValueMin(min);
            }
            element.setNewValueMax = (max) => {
                model.setNewValueMax(max);
            }
            element.setNewValueAmount = (amount) => {
                model.setNewValueAmount(amount);
            }
            element.setNewValueTouchsValues = (touchValue, index) => {
                model.setNewValueTouchsValues(touchValue, index);
            }
            element.setNewValueStep = (step) => {
                model.setNewValueStep(step);
            }
            element.setNewValueOrientation = (value) => {
                model.setNewValueOrientation(value);
            }
            element.setNewValueTooltip = (value) => {
                model.setNewValueTooltip(value);
            }

            element.subscribeToStateModel = (handler, isCreatedInput, amountInputs, changeAmountInputs,
                 setValueToInputFromModelState, setValueToStepFromModelState,
                  setValueToMinInputFromModelState, setValueMaxInputFromModelState) => {
                eventEmitter.subscribe('model:state-changed', (state) => {
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