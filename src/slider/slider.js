import {Model} from './model.js';
import {View} from './view.js';
import {Controller} from './controller.js';

(function($){
    $.fn.slider = function(){
        const elements = Array.from(this);
        elements.forEach((element, index) => {
            let view = new View(element);
            let model = new Model();
            new Controller(element, model, view);
            console.log(index);
        });
    }
})(jQuery);