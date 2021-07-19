import ConfigurationPanel from '../components/configuration-panel/configuration-panel';
import '../../slider/slider';

const firstSetOfOptions = {
  min: 20,
  max: 80,
  thumbsValues: [20, 32, 44, 60],
  orientation: 'horizontal',
  thumbsCount: 4,
  step: 2,
  isTooltip: true,
  isScaleOfValues: true,
};

const secondSetOfOptions = {
  min: 0,
  max: 100,
  thumbsValues: [20, 35, 45, 60],
  orientation: 'vertical',
  thumbsCount: 3,
  step: 5,
  isTooltip: false,
  isScaleOfValues: true,
};

const thirdSetOfOptions = {
  min: 0,
  max: 100,
  thumbsValues: [21, 33, 60, 72],
  orientation: 'horizontal',
  thumbsCount: 4,
  step: 3,
  isTooltip: true,
  isScaleOfValues: false,
};

const options = [firstSetOfOptions, secondSetOfOptions, thirdSetOfOptions];

const $elementsSlider = $('.js-slider-test');
$elementsSlider.each((index, element) => {
  new ConfigurationPanel(
    $(element).slider(options[index]),
    index,
  );
});
