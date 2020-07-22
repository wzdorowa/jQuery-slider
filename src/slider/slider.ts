import Controller from './controller';
import { IHTMLElement } from './interfaces/iHTMLElement';

((function ($) {
  const $jquery = $;
  $jquery.fn.slider = function () {
    const elements: IHTMLElement[] = Array.from(this) as IHTMLElement[];
    elements.forEach((element: IHTMLElement) => {
      new Controller(element);
    });
  };
})(jQuery));
