import Controller from './Controller';
import { IHTMLElement } from './interfaces/iHTMLElement';

(function callSlider($) {
  const $jquery = $;
  $jquery.fn.slider = function renderSliders(options: object): IHTMLElement {
    const elements: IHTMLElement[] = Array.from(this) as IHTMLElement[];
    elements.forEach((element: IHTMLElement) => {
      const slider = new Controller(
        element,
        $.extend(
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
          options,
        ),
      );
      return slider;
    });
  };
})(jQuery);
