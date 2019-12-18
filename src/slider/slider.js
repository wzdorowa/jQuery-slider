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

            element.setNewValueMin = (min) => {
                model.setNewValueMin(min);
                console.log(model.state);
            }
            element.setNewValueMax = (max) => {
                model.setNewValueMax(max);
                console.log(model.state);
            }
            element.setNewValueAmount = (amount) => {
                model.setNewValueAmount(amount);
                console.log(model.state);
            }
            element.setNewValueTouchsValues = (touchValue, index) => {
                model.setNewValueTouchsValues(touchValue, index);
                console.log(model.state);
            }
            element.setNewValueStep = (step) => {
                model.setNewValueStep(step);
                console.log(model.state);
            }
            element.setNewValueOrientation = (value) => {
                model.setNewValueOrientation(value);
                console.log(model.state);
            }
            element.setNewValueTooltip = (value) => {
                model.setNewValueTooltip(value);
                console.log(model.state);
            }

            element.subscribeToStateModel = (handler, isCreatedInput) => {
                eventEmitter.subscribe('model:state-changed', (state) => {
                    console.log(state);
                    if(!isCreatedInput) {
                        handler(state);
                        isCreatedInput = true;
                    }
                })
            }
        });
    }
})(jQuery);