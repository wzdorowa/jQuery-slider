import {configuratorHorizontal} from '../slider/configuratorHorizontal';
import {createElement} from '../slider/functions/createElement';

test('Сhange the class from vertical to horizontal', () => {
    const slider: HTMLElement = createElement('span', 'height-vertical-slider-container');
    configuratorHorizontal.setWidthHeightSliderContainer(slider);
    expect(slider.tagName).toBe('SPAN');
    expect(slider.className).not.toBe('height-vertical-slider-container');
    expect(slider.className).toBe('width-horizontal-slider-container');
});
test('Create element with class "slider-tooltip-text"', () => {
    const createElementTooltip = configuratorHorizontal.createSliderTooltipText();
    expect(createElementTooltip.tagName).toBe('SPAN');
    expect(createElementTooltip.className).toBe('slider-tooltip-text');
});
test('Create element with class "slider-line"', () => {
    const createSliderLine = configuratorHorizontal.createSliderLine();
    expect(createSliderLine.tagName).toBe('DIV');
    expect(createSliderLine.className).toBe('slider-line');
});
test('Create element with class "slider-line-span"', () => {
    const createSliderLineSpan = configuratorHorizontal.createSliderLineSpan();
    expect(createSliderLineSpan.tagName).toBe('SPAN');
    expect(createSliderLineSpan.className).toBe('slider-line-span');
});
test('Find element with class "slider-tooltip-text-for-verticalView"', () => {
    const tooltipText: HTMLElement = createElement('span', 'slider-tooltip-text-for-verticalView');
    const parentTooltipText: HTMLElement = createElement('div', 'search-elements-tooltip-text');;
    const elementCount: number = 4;
    for(let i = 0; i < elementCount; i++) {
        parentTooltipText.append(tooltipText);
    }
    const searchElementsTooltipText: HTMLElement[] = configuratorHorizontal.searchElementsTooltipText(parentTooltipText);
    expect(searchElementsTooltipText[0].className).toBe('slider-tooltip-text-for-verticalView');
});
test('Calculate point coefficient', () => {
    const elementSliderLine: HTMLElement = configuratorHorizontal.createSliderLine();
    elementSliderLine.style.display = 'block';
    elementSliderLine.style.width = 300 + 'px';
    document.body.append(elementSliderLine);
    //@ts-ignore
    const domElement: HTMLElement = document.querySelector('.slider-line');
    console.log(domElement.offsetWidth);
    const calculateCoefficientPoint = configuratorHorizontal.calculateCoefficientPoint(elementSliderLine, 100, 0);
    expect(calculateCoefficientPoint).toBe(2);
});
test('Find element with class "slider-line-span" for delete', () => {
    const lineVerticalView: HTMLElement = createElement('span', 'slider-line-for-verticalView');
    const parentLineVerticalView: HTMLElement = createElement('div', 'parent-slider-line-for-verticalView');
    parentLineVerticalView.append(lineVerticalView);
    const sliderLineToDelete: JQuery<HTMLElement> = configuratorHorizontal.sliderLineToDelete(parentLineVerticalView);
    expect(sliderLineToDelete[0].className).toBe('slider-line-for-verticalView');
});