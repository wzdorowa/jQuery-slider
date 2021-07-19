import Controller from './Controller';
import { IHTMLElement } from './interfaces/iHTMLElement';

(function callSlider($) {
  const $jquery = $;
  ($jquery.fn as any).slider = function renderSliders(
    method?: {} | string,
    ...arg: any
  ) {
    const methods = {
      setOption($slider: JQuery<HTMLElement>, options: {} | undefined) {
        const element = ($slider[0] as unknown) as IHTMLElement;

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
          options,
        );

        $slider.data('controller', new Controller(element, settings));

        return $slider;
      },
      // getState($slider: JQuery<HTMLElement>) {
      //   const data = $slider.data('controller').getState();
      //   console.log('data', data);

      //   return $slider;
      // },
    };

    const isMethod = typeof method === 'object' || !method;

    if (typeof method === 'string') {
      return (methods as any)[method].call(this, this, ...arg);
    }
    if (isMethod) {
      return methods.setOption(this, method);
    }
  };
})(jQuery);
