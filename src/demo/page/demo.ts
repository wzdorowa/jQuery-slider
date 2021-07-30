import ConfigurationPanel from '../components/configuration-panel/configuration-panel';
import '../../slider/slider';

const $elementsSlider = $('.js-slider-test');
$elementsSlider.each((index, element) => {
  new ConfigurationPanel($(element).slider(), index);
});
