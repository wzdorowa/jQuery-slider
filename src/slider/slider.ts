import './styles/slider.scss';
import Wrapper from './Wrapper';
import Controller from './Controller';

(function callSlider($) {
  const $jquery = $;
  $jquery.fn.slider = function renderSlider(): globalThis.JQuery<HTMLElement> {
    const element = (this[0] as unknown) as HTMLElement;
    const data = this.data();
    const controller = new Controller(element, data);
    const wrapper = new Wrapper(controller);
    this.data('getState', wrapper.getState);
    this.data('update', wrapper.update);
    this.data('subscribeToModelChanges', wrapper.subscribeToModelChanges);
    this.data('subscribeToThumbsChanges', wrapper.subscribeToThumbsChanges);
    return this;
  };
  $jquery.fn.extend($jquery.fn.slider);
})(jQuery);
