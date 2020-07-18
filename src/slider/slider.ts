import Controller from './controller';
import { IHTMLElement } from './interfaces/iHTMLElement';

((function ($) {
  $.fn.slider = function () {
    const elements: IHTMLElement[] = Array.from(this) as IHTMLElement[];
    elements.forEach((element: IHTMLElement) => {
      const controller = new Controller(element);
      console.log('создан контроллер', controller);
    });
  };
})(jQuery));
