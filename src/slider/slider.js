import {Model} from './model.js';
import {View} from './view.js';
import {Controller} from './controller.js';
import {EventEmitter} from './eventEmitter.js';

(function($){
    $.fn.slider = function(){
        const elements = Array.from(this);
        elements.forEach((element, index) => {
            let view = new View(element);
            let model = new Model();
            let emitter = new EventEmitter();
            new Controller(element, model, view, emitter);
            console.log(index);
        });
    }
})(jQuery);