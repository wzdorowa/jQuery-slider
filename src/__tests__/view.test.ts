import {View} from '../slider/view';
import { EventEmitter } from '../slider/eventEmitter';
import {IModelState} from '../slider/iModelState';
//@ts-ignore
import {configuratorHorizontal} from '../slider/configuratorHorizontal';
//@ts-ignore
import {configuratorVertical} from '../slider/configuratorVertical';
//@ts-ignore
import {IConfigurator} from '../slider/iConfigurator'
//import {createElement} from '../slider/functions/createElement';

//var sinon = require('sinon');

debugger;
const element = window.document.createElement('div');
element.className = 'js-slider-test';
window.document.body.appendChild(element);

const eventEmitter = new EventEmitter();
let emitter = eventEmitter;

//@ts-ignore
const view = new View(element, eventEmitter);

let state: IModelState = {
    min: 0,
    max: 100,
    touchsValues: [20,30,40,50],
    orientation: 'horizontal',
    amount: 4,
    step: 2,
    tooltip: true,
}
test('Сreating basic HTML slider structure', () => {
    emitter.emit('model:state-changed', state);
    let touchElements = window.document.querySelectorAll('.slider-touch');
    let sliderSpans = window.document.querySelectorAll('.slider-span');
    let tooltips = window.document.querySelectorAll('.slider-tooltip');
    let tooltipsText = window.document.querySelectorAll('.slider-tooltip-text');
    let sliderLine = window.document.querySelector('.slider-line');
    let sliderLineSpan = window.document.querySelector('.slider-line-span');
    expect(touchElements.length).toBe(state.amount);
    expect(sliderSpans.length).toBe(state.amount);
    expect(tooltips.length).toBe(state.amount);
    expect(tooltipsText.length).toBe(state.amount);
    //@ts-ignore
    expect(sliderLine.className).toBe('slider-line');
    //@ts-ignore
    expect(sliderLineSpan.className).toBe('slider-line-span');
});
