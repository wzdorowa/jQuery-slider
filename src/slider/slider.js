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
                console.log(model.state);
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

            element.subscribeToStateModel = (handler, isCreatedInput, amountInputs, changeAmountInputs) => {
                eventEmitter.subscribe('model:state-changed', (state) => {
                    console.log('вызвана: subscribeToStateModel');
                    console.log(amountInputs.length);
                    console.log(state.touchsValues.length);
                    if(!isCreatedInput) {
                        console.log('я в условии: !isCreatedInput');
                        handler(state);
                        isCreatedInput = true;
                    }
                    if(amountInputs.length != state.touchsValues.length) {
                        console.log('я в условии: amountInputs.length');
                        changeAmountInputs(state);
                    }
                })
            }
        });
    }
})(jQuery);