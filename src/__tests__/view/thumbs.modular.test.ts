import configuratorHorizontal from '../../slider/view/configurators/configuratorHorizontal';
import EventEmitter from '../../slider/eventEmitter';
import { IModelState } from '../../slider/interfaces/iModelState';
import View from '../../slider/view/view';
import Thumbs from '../../slider/view/thumbs';
import sinonLib = require('sinon');

const state: IModelState = {
  min: 0,
  max: 100,
  thumbsValues: [20, 30, 40, 50],
  orientation: 'horizontal',
  amount: 4,
  step: 2,
  isTooltip: true,
};
describe('Модульные тесты', () => {
  const element = window.document.createElement('div');
  element.className = 'js-slider-test';
  window.document.body.appendChild(element);

  const eventEmitter = new EventEmitter();
  const emitter = eventEmitter;

  const view = new View(element, eventEmitter);
  const thumbs = new Thumbs(element, eventEmitter);

  test('Проверка корректного создания элементов', () => {
    emitter.emit('model:state-changed', state);

    const thumbsElements = window.document.querySelectorAll('.js-slider__thumb');

    expect(thumbsElements.length).toBe(state.amount);
  });
  test('Проверить наличие родителей у созданных элементов', () => {
    const parentThumbsElements = window.document.querySelectorAll('.js-slider__thumb')[0].parentNode as HTMLElement;

    expect(parentThumbsElements.className).toContain('js-slider-test');
  });
  test('Проверить изменение количества созданных элементов при изменении количества бегунков в большую сторону', () => {
    state.amount = 5;
    emitter.emit('model:state-changed', state);

    const thumbsElements = window.document.querySelectorAll('.js-slider__thumb');

    expect(thumbsElements.length).toBe(state.amount);

    // Проверить значение добавленного ползунка
    expect(state.thumbsValues.length).toBe(5);
    expect(state.thumbsValues[4]).toBe(52);
  });
  test('Проверить удаление ползунков', () => {
    state.amount = 3;
    emitter.emit('model:state-changed', state);

    const thumbsElements = window.document.querySelectorAll('.js-slider__thumb');

    expect(thumbsElements.length).toBe(state.amount);
    expect(state.thumbsValues.length).toBe(3);
  });
  test('Проверить корректность рассчета текущего значения ползунка', () => {
    thumbs.state.coefficientPoint = 3.5;
    const currentValue: number = thumbs.calculateValue(state, 345);
    expect(currentValue).toBe(98);
  });
  test('Проверка рассчета значения места бегунка на шкале', () => {
    thumbs.state.coefficientPoint = 3.2;
    thumbs.state.currentValueAxis = 273;
    thumbs.state.shiftToMinValue = 0;
    thumbs.calculateValueOfPlaceOnScale(state, 3);
    expect(thumbs.state.currentValue).toBe(86);
  });
  test('Проверка установки ближайшего ползунка на место клика по шкале слайдера', () => {
    const sinon: sinonLib.SinonStatic = sinonLib;

    const configurator = configuratorHorizontal;
    const activeRange: HTMLElement = configurator.createElementActivRange();
    const scale: HTMLElement = configurator.createElementScale();

    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      clientX: 100,
      clientY: 100,
    });

    sinon.stub(configuratorHorizontal, 'calculateCoefficientPoint').callsFake(() => 2);
    sinon.stub(configuratorHorizontal, 'getOffsetFromClick').callsFake(() => 100);
    sinon.stub(configuratorHorizontal, 'calculateClickLocation').callsFake(() => 130);

    scale.dispatchEvent(event);
    let currentValues = thumbs.setThumbToNewPosition.apply(thumbs, [event, state, configurator]);
    expect(currentValues[0]).toBe(30);
    expect(currentValues[1]).toBe(1);

    activeRange.dispatchEvent(event);
    currentValues = thumbs.setThumbToNewPosition.apply(thumbs, [event, state, configurator]);
    expect(currentValues[0]).toBe(40);
    expect(currentValues[1]).toBe(2);

    sinon.reset();
  });
  test('Тест вызова onStart', () => {
    const sinon: sinonLib.SinonStatic = sinonLib;

    thumbs.configurator = configuratorHorizontal;
    const activeRange: HTMLElement = thumbs.configurator.createElementActivRange();
    const scale: HTMLElement = thumbs.configurator.createElementScale();
    const i = 0;
    const setCurrentTooltipValue = () => 0;
    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      clientX: 100,
      clientY: 100,
    });

    sinon.stub(configuratorHorizontal, 'getCurrentValueAxisToProcessStart').callsFake(() => 90);
    sinon.stub(configuratorHorizontal, 'getStartValueAxisToProcessStart').callsFake(() => 50);
    sinon.stub(configuratorHorizontal, 'getMaxValueAxisToProcessStart').callsFake(() => 300);

    thumbs.processStart(state, event, i, scale, activeRange, setCurrentTooltipValue);
    expect(thumbs.state.currentValue).toBe(state.thumbsValues[i]);

    sinon.reset();
  });
  test('Проверка onMove для первого ползунка', () => {
    const sinon: sinonLib.SinonStatic = sinonLib;

    thumbs.configurator = configuratorHorizontal;
    const activeRange: HTMLElement = thumbs.configurator.createElementActivRange();
    const elements: HTMLElement[] = thumbs.state.thumbs;

    const setCurrentTooltipValue = () => 0;
    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      clientX: 100,
      clientY: 100,
    });

    const getCurrentValueAxisToOnMove = sinon.stub(configuratorHorizontal, 'getCurrentValueAxisToProcessMove');
    getCurrentValueAxisToOnMove.onCall(0).returns(290);
    getCurrentValueAxisToOnMove.onCall(1).returns(290);
    getCurrentValueAxisToOnMove.onCall(2).returns(10);
    const elementOffset = sinon.stub(configuratorHorizontal, 'getElementOffset').callsFake(() => 290);
    const targetOffset = sinon.stub(configuratorHorizontal, 'getTargetWidth').callsFake(() => 24);
    const setIndentForTarget = sinon.stub(configuratorHorizontal, 'setIndentForTarget').callsFake(() => 0);
    const updateLineSpan = sinon.stub(configuratorHorizontal, 'updateActiveRange').callsFake(() => 0);

    const i = 0;
    const target: HTMLElement = elements[i];

    // Если ползунок на шкале один
    thumbs.state.maxValueAxis = 280;
    thumbs.state.thumbs.length = 1;

    thumbs.processMove(state, event, i, target, activeRange, setCurrentTooltipValue);
    expect(thumbs.state.currentValueAxis).toBe(thumbs.state.maxValueAxis);
    thumbs.state.maxValueAxis = 350;

    // Проверка первого ползунка, если ползунков на шкале много
    thumbs.state.thumbs.length = 4;

    thumbs.processMove(state, event, i, target, activeRange, setCurrentTooltipValue);
    expect(thumbs.state.currentValueAxis).toBe(266);

    // Если значение первого ползунка становиться меньше минимально возможного значения
    state.min = 20;

    thumbs.processMove(state, event, i, target, activeRange, setCurrentTooltipValue);
    expect(thumbs.state.currentValueAxis).toBe(state.min);

    // сбросить заглушки
    getCurrentValueAxisToOnMove.restore();
    elementOffset.restore();
    targetOffset.restore();
    setIndentForTarget.restore();
    updateLineSpan.restore();
  });
  test('Проверка onMove для любого ползунка кроме первого и последнего', () => {
    const sinon: sinonLib.SinonStatic = sinonLib;

    thumbs.configurator = configuratorHorizontal;
    const activeRange: HTMLElement = thumbs.configurator.createElementActivRange();
    const elements: HTMLElement[] = thumbs.state.thumbs;

    const setCurrentTooltipValue = () => 0;
    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      clientX: 100,
      clientY: 100,
    });

    const setCurrentXorYtoOnMove = sinon.stub(configuratorHorizontal, 'getCurrentValueAxisToProcessMove');
    setCurrentXorYtoOnMove.onCall(0).returns(290);
    setCurrentXorYtoOnMove.onCall(1).returns(250);

    const elementOffset = sinon.stub(configuratorHorizontal, 'getElementOffset').callsFake(() => 290);
    elementOffset.onCall(0).returns(290);
    elementOffset.onCall(1).returns(250);
    elementOffset.onCall(2).returns(350);
    elementOffset.onCall(3).returns(250);

    const targetOffset = sinon.stub(configuratorHorizontal, 'getTargetWidth').callsFake(() => 24);
    const setIndentForTarget = sinon.stub(configuratorHorizontal, 'setIndentForTarget').callsFake(() => 0);
    const updateLineSpan = sinon.stub(configuratorHorizontal, 'updateActiveRange').callsFake(() => 0);

    const i = 1;
    const target: HTMLElement = elements[i];

    // Если значение любого кроме первого и последнего ползунка
    // превышает значение следующего за ним ползунка
    thumbs.processMove(state, event, i, target, activeRange, setCurrentTooltipValue);
    expect(thumbs.state.currentValueAxis).toBe(266);

    // Если значение любого кроме первого и последнего ползунка меньше значения предыдущего ползунка
    thumbs.processMove(state, event, i, target, activeRange, setCurrentTooltipValue);
    expect(thumbs.state.currentValueAxis).toBe(274);

    // сбросить заглушки
    setCurrentXorYtoOnMove.restore();
    elementOffset.restore();
    targetOffset.restore();
    setIndentForTarget.restore();
    updateLineSpan.restore();
  });
  test('Проверка onMove для последнего ползунка', () => {
    const sinon: sinonLib.SinonStatic = sinonLib;

    thumbs.configurator = configuratorHorizontal;
    const activeRange: HTMLElement = thumbs.configurator.createElementActivRange();
    const elements: HTMLElement[] = thumbs.state.thumbs;

    const setCurrentTooltipValue = () => 0;
    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      clientX: 100,
      clientY: 100,
    });

    const i = 3;
    const target: HTMLElement = elements[i];

    const setCurrentXorYtoOnMove = sinon.stub(configuratorHorizontal, 'getCurrentValueAxisToProcessMove');
    setCurrentXorYtoOnMove.onCall(0).returns(290);
    setCurrentXorYtoOnMove.onCall(1).returns(350);

    const elementOffset = sinon.stub(configuratorHorizontal, 'getElementOffset').callsFake(() => 290);
    const targetOffset = sinon.stub(configuratorHorizontal, 'getTargetWidth').callsFake(() => 24);
    const setIndentForTarget = sinon.stub(configuratorHorizontal, 'setIndentForTarget').callsFake(() => 0);
    const updateLineSpan = sinon.stub(configuratorHorizontal, 'updateActiveRange').callsFake(() => 0);

    // Если значение ползунка меньше значения предыдущего ползунка
    thumbs.processMove(state, event, i, target, activeRange, setCurrentTooltipValue);
    expect(thumbs.state.currentValueAxis).toBe(314);

    thumbs.state.maxValueAxis = 280;
    // Если значение ползунка больше максимально допустимого значения предыдущего ползунка
    thumbs.processMove(state, event, i, target, activeRange, setCurrentTooltipValue);
    expect(thumbs.state.currentValueAxis).toBe(thumbs.state.maxValueAxis);

    // сбросить заглушки
    setCurrentXorYtoOnMove.restore();
    elementOffset.restore();
    targetOffset.restore();
    setIndentForTarget.restore();
    updateLineSpan.restore();
  });
  test('Проверка onStop', () => {
    const sinon: sinonLib.SinonStatic = sinonLib;

    thumbs.configurator = configuratorHorizontal;
    const activeRange: HTMLElement = thumbs.configurator.createElementActivRange();
    const elements: HTMLElement[] = thumbs.state.thumbs;

    const setCurrentTooltipValue = () => 0;
    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      clientX: 100,
      clientY: 100,
    });
    const i = 1;
    const target: HTMLElement = elements[i];

    sinon.stub(configuratorHorizontal, 'setIndentForTargetToProcessStop').callsFake(() => 0);

    const handleMove = () => thumbs.processMove(state, event,
      i, target, activeRange, setCurrentTooltipValue);
    const handleStop = () => thumbs.processStop(handleMove, handleStop, event,
      i, target, state, setCurrentTooltipValue);

    thumbs.processStop(handleMove, handleStop, event, i, target, state, setCurrentTooltipValue);
    expect(thumbs.state.currentValue).toBe(null);
    expect(thumbs.state.currentThumbIndex).toBe(null);
  });
});
