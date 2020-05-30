import {Scale} from '../../slider/view/scale';
import {Thumbs} from '../../slider/view/thumbs';
import { EventEmitter } from '../../slider/eventEmitter';
import {IModelState} from '../../slider/interfaces/iModelState';
import {configuratorHorizontal} from '../../slider/view/configurators/configuratorHorizontal';
import {configuratorVertical} from '../../slider/view/configurators/configuratorVertical';

const state: IModelState = {
    min: 0,
    max: 100,
    thumbsValues: [20,30,40,50],
    orientation: 'horizontal',
    amount: 4,
    step: 2,
    tooltip: true,
};

describe('Модульные тесты', () => {
    const element = window.document.createElement('div');
    element.className = 'js-slider-test';
    window.document.body.appendChild(element);

    const eventEmitter = new EventEmitter();
    const scale = new Scale(element);
    const sliders = new Thumbs(element, eventEmitter);

    test('Проверка корректного создания элементов шкалы', () => {
        scale.createScale(configuratorHorizontal);

        const scaleElement = window.document.querySelector('.slider-line');
        const activeRange = window.document.querySelector('.slider-line-span');

        expect(scaleElement?.className).toBe('slider-line');
        expect(activeRange?.className).toBe('slider-line-span');
        expect(scale.slider.childElementCount).toBe(1);
        expect(scale.scale).toBe(scaleElement);
        expect(scale.activeRange).toBe(activeRange);

    });
    test('Проверка смены ориентации', () => {
        state.orientation = 'vertical';
        scale.changeOrientation(sliders.setThumbToNewPosition.bind(sliders), state, configuratorVertical);
        const scaleToDelete = window.document.querySelector('.slider-line');
        const activeRangeToDelite = window.document.querySelector('.slider-line-span');

        expect(scaleToDelete).toBe(null);
        expect(activeRangeToDelite).toBe(null);

        const scaleElement = window.document.querySelector('.slider-line-for-verticalView');
        const activeRange = window.document.querySelector('.slider-line-span-for-verticalView');

        expect(scaleElement?.className).toBe('slider-line-for-verticalView');
        expect(activeRange?.className).toBe('slider-line-span-for-verticalView');
        expect(scale.slider.childElementCount).toBe(1);
        expect(scale.scale).toBe(scaleElement);
        expect(scale.activeRange).toBe(activeRange);        
    })
})