import Wrapper from './Wrapper';

(function callSlider($) {
  const $jquery = $;
  $jquery.fn.slider = function renderSlider(): globalThis.JQuery<HTMLElement> {
    const element = (this[0] as unknown) as HTMLElement;
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
        hasTooltips: true,
        hasScaleValues: true,
      },
      data,
    );
    const wrapper = new Wrapper(element, settings);
    this.data('getState', wrapper.getState);
    this.data('update', wrapper.update);
    this.data('subscribeToModelChanges', wrapper.subscribeToModelChanges);
    this.data('subscribeToThumbsChanges', wrapper.subscribeToThumbsChanges);
    return this;
  };
  $jquery.fn.extend($jquery.fn.slider);
})(jQuery);
