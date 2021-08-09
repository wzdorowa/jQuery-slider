import Controller from './Controller';
import { IHTMLElement } from './interfaces/iHTMLElement';

(function callSlider($) {
  const $jquery = $;
  $jquery.fn.slider = function (): JQuery<HTMLElement> {
    const element = (this[0] as unknown) as IHTMLElement;
    const data = this.data();
    const settings = $.extend(
      true,
      {
        min: 0,
        max: 100,
        thumbsValues: [20, 32, 44, 60],
        orientation: 'horizontal',
        thumbsCount: 4,
        step: 2,
        isTooltip: true,
        isScaleOfValues: true,
      },
      data,
    );
    this.data('controller', new Controller(element, settings));
    return this;
  };
})(jQuery);
