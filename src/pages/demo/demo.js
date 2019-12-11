
$( () => {
    $('.js-slider-test').slider();

    const elements = Array.from($('.js-slider-test'));
    console.log(elements);
    elements.forEach((element, index) => {
        console.log(element.pluginName);
        element.displayInConsole();
    });
});

