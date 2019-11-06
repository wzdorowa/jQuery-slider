import {Controller} from './controller.js';
import {View} from './view.js';

(function($){
    $.fn.slider = function(){
        const elements = Array.from(this);
        elements.forEach((element, index) => {
            new Controller(element);
            new View(element);
            console.log(index);
        });
    }
})(jQuery);