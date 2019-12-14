import {Model} from './model.js';
import {View} from './view.js';
import {Controller} from './controller.js';
import {EventEmitter} from './eventEmitter.js';

(function($){
    $.fn.slider = function(){
        const elements = Array.from(this);
        elements.forEach((element, index) => {
            let eventEmitter = new EventEmitter();
            let view = new View(element, eventEmitter);
            let model = new Model(eventEmitter);
            new Controller(element, model, view);
            console.log(index);
            this.emitter = eventEmitter;
            // здесь привязываю какие-то данные//
            element.pluginName = "SliderJS";

            element.callMethodSetNewValueMin = (min) => {
                model.setNewValueMin(min);
                console.log(model.state);
            }
            element.callMethodSetNewValueMax = (max) => {
                model.setNewValueMax(max);
                console.log(model.state);
            }
            element.callMethodSetNewValueAmount = (amount) => {
                model.setNewValueAmount(amount);
                console.log(model.state);
            }
            element.callMethodSetNewValueSliderTouchsStates = (touchValue, index) => {
                model.setNewValueSliderTouchsStates(touchValue, index);
                console.log(model.state);
            }
            element.callMethodSetNewValueStep = (step) => {
                model.setNewValueStep(step);
                console.log(model.state);
            }

            /*element.subscribeToStateModel = () => {
                this.emitter.subscribe('model:state-changed', (state) => {
                    createInput(state.amount);
                })
            }*/
        });
    }
})(jQuery);