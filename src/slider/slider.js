import {Controller} from './controller.js';

(function($){
    $.fn.slider = function(){
        const elements = Array.from(this);
        elements.forEach((element, index) => {
            new Controller(element);
            console.log(index);
        });
    }
})(jQuery);