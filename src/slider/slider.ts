import Controller from './Controller';
import { IHTMLElement } from './interfaces/iHTMLElement';

(function callSlider($) {
  const $jquery = $;
  $jquery.fn.slider = function renderSlider() {
    const elements: IHTMLElement[] = Array.from(this) as IHTMLElement[];
    elements.forEach((element: IHTMLElement) => {
      new Controller(element);
    });
  };
})(jQuery);
