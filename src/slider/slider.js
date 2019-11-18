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
        });
    }
})(jQuery);