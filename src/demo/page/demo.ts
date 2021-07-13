$(() => {
  $('.js-slider-test').slider({
    min: 20,
    max: 80,
    step: 5,
    thumbsValues: [25, 45, 60],
    thumbsCount: 3,
    isTooltip: true,
    isScaleOfValues: false
  });
});
