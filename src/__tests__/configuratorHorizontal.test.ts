import {configuratorHorizontal} from '../slider/configuratorHorizontal';

test('Create Slider tooltip text', () => {
    const createElementTooltip = configuratorHorizontal.createSliderTooltipText();
    expect(createElementTooltip.tagName).toBe('SPAN');
    expect(createElementTooltip.className).toBe('slider-tooltip-text');
});