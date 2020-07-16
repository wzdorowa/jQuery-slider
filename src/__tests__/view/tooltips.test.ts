import EventEmitter from '../../slider/eventEmitter';
import { IModelState } from '../../slider/interfaces/iModelState';
import View from '../../slider/view/view';
import puppeteer from 'puppeteer';

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
  new View(element, eventEmitter);

  test('Проверка корректности создания тултипов', () => {
    eventEmitter.emit('model:state-changed', state);

    const tooltipsElements = window.document.querySelectorAll('.js-slider__tooltip');
    const textInTooltipsElements = window.document.querySelectorAll('.js-slider__tooltip-text');
    const slidersElements = window.document.querySelectorAll('.js-slider__thumb');

    expect(tooltipsElements.length).toBe(state.amount);
    tooltipsElements.forEach((element) => {
      expect(element.className).toContain('js-slider__tooltip');
    });
    expect(textInTooltipsElements.length).toBe(state.amount);
    textInTooltipsElements.forEach((element) => {
      expect(element.className).toContain('js-slider__tooltip-text');
    });
    tooltipsElements.forEach((element, i: number) => {
      expect(element.childNodes).toContain(textInTooltipsElements[i]);
    });
    slidersElements.forEach((element, i: number) => {
      expect(element.childNodes).toContain(tooltipsElements[i]);
    });
  });
  test('Проверка установки значений ползунков по-умолчанию в соответствующие им тултипы ', () => {
    const textInTooltipsElements = window.document.querySelectorAll('.js-slider__tooltip-text');
    state.thumbsValues.forEach((element: number, i: number) => {
      expect(String(element)).toBe(textInTooltipsElements[i].innerHTML);
    });
  });
  test('Проверка изменения количества отрисованных тултипов при изменении количества ползунков', () => {
    state.amount = 6;
    eventEmitter.emit('model:state-changed', state);

    let tooltipsElements = window.document.querySelectorAll('.js-slider__tooltip');
    let textInTooltipsElements = window.document.querySelectorAll('.js-slider__tooltip-text');
    let slidersElements = window.document.querySelectorAll('.js-slider__thumb');

    expect(tooltipsElements.length).toBe(state.amount);
    expect(textInTooltipsElements.length).toBe(state.amount);
    tooltipsElements.forEach((element, i: number) => {
      expect(element.childNodes).toContain(textInTooltipsElements[i]);
    });
    slidersElements.forEach((element, i: number) => {
      expect(String(element.childNodes[0])).toContain(String(tooltipsElements[i]));
    });

    state.amount = 4;
    eventEmitter.emit('model:state-changed', state);

    tooltipsElements = window.document.querySelectorAll('.js-slider__tooltip');
    textInTooltipsElements = window.document.querySelectorAll('.js-slider__tooltip-text');
    slidersElements = window.document.querySelectorAll('.js-slider__thumb');

    expect(tooltipsElements.length).toBe(state.amount);
    expect(textInTooltipsElements.length).toBe(state.amount);
    tooltipsElements.forEach((element, i: number) => {
      expect(element.childNodes).toContain(textInTooltipsElements[i]);
    });
    slidersElements.forEach((element, i: number) => {
      expect(element.childNodes).toContain(tooltipsElements[i]);
    });
  });
  test('Проверка перерисовки тултипов при смене ориентации', () => {
    state.orientation = 'vertical';
    eventEmitter.emit('model:state-changed', state);

    let tooltipsElements = window.document.querySelectorAll('.js-slider__tooltip');
    let textInTooltipsElements = window.document.querySelectorAll('.js-slider__vertical-tooltip-text');

    textInTooltipsElements.forEach((element) => {
      expect(element.className).toContain('js-slider__vertical-tooltip-text');
    });
    tooltipsElements.forEach((element, i: number) => {
      expect(element.childNodes).toContain(textInTooltipsElements[i]);
    });

    state.orientation = 'horizontal';
    eventEmitter.emit('model:state-changed', state);

    tooltipsElements = window.document.querySelectorAll('.js-slider__tooltip');
    textInTooltipsElements = window.document.querySelectorAll('.js-slider__tooltip-text');

    textInTooltipsElements.forEach((element) => {
      expect(element.className).toContain('js-slider__tooltip-text');
    });
    tooltipsElements.forEach((element, i: number) => {
      expect(element.childNodes).toContain(textInTooltipsElements[i]);
    });
  });
  test('Проверить наличие значений в тултипах', () => {
    const tooltipsText = window.document.querySelectorAll('.js-slider__tooltip-text');

    expect(tooltipsText[0].innerHTML).toContain('20');
    expect(tooltipsText[1].innerHTML).toContain('30');
    expect(tooltipsText[2].innerHTML).toContain('40');
  });
  test('Проверка скрытия тултипов бегунков', () => {
    state.isTooltip = false;
    eventEmitter.emit('model:state-changed', state);

    const tooltipsElements = window.document.querySelectorAll('.js-slider__tooltip');
    tooltipsElements.forEach((element) => {
      expect(element.className).toContain('slider__tooltip-hide');
    });
  });
  test('Проверка показа тултипов бегунков', () => {
    state.isTooltip = true;
    eventEmitter.emit('model:state-changed', state);

    const tooltipsElements = window.document.querySelectorAll('.js-slider__tooltip');
    tooltipsElements.forEach((element) => {
      expect(element.className).not.toContain('slider__tooltip-hide');
    });
  });
});
describe('Интеграционные тесты для горизонтального вида', () => {
  let browser: puppeteer.Browser;
  let page: puppeteer.Page;

  beforeEach(async () => {
    const element: HTMLDivElement | null = window.document.querySelector('.js-slider-test');
    if (element !== null || element !== undefined) {
        element?.remove();
    }
    browser = await puppeteer.launch({ headless: false });
    page = await browser.newPage();
  });
  afterEach(async () => {
    await browser.close();
  });
  test('Проверить корректность изменений значений в тултипах горизонтального вида', async () => {
    await page.goto('http://localhost:1234');
    await page.waitFor(500);

    // Функция для нахождения коэффициента единичного значения слайдера в пикселях
    const getCoefficientPoint = (sliderLineWidth: number, max: number, min: number) => {
      const value = sliderLineWidth / (max - min);
      return value;
    };
    const calculateValue = (offsetLeft: number, startSlider: number) => {
      let currentValueX: number = Math.floor((offsetLeft - startSlider) / coefficientPoint) + state.min;
      const multi: number = Math.floor(currentValueX / state.step);
      currentValueX = state.step * multi;
      return currentValueX;
    };
      // Найти координаты линии слайдера
    const sliderLine: puppeteer.ElementHandle<Element> | null = await page.$('.js-slider__scale');
    const rectSliderLine = await page.evaluate((sliderLine: HTMLDivElement) => {
      const {
        top, left, bottom, right,
      } = sliderLine.getBoundingClientRect();
      return {
        top, left, bottom, right,
      };
    }, sliderLine);
    const sliderLineWidth: number = rectSliderLine.right - rectSliderLine.left;

    // Найти первый ползунок и его ширину
    const thumbsElements: puppeteer.ElementHandle<Element>[] = await page.$$('.js-slider__thumb');
    const firstElement: puppeteer.ElementHandle<Element> = thumbsElements[0];
    let rectFirstElement = await page.evaluate((element: HTMLDivElement) => {
      const {
        top, left, bottom, right,
      } = element.getBoundingClientRect();
      return {
        top, left, bottom, right,
      };
    }, firstElement);
    const elementWidth: number = rectFirstElement.right - rectFirstElement.left;

    // Точки начала и конца линии слайдера
    const startPointSlider = rectSliderLine.left - (elementWidth/2);
    // const endPointSlider = rectSliderLine.right + (elementWidth/2);

    await page.mouse.move(rectFirstElement.left, rectFirstElement.top);
    await page.mouse.down();
    await page.waitFor(200);
    await page.mouse.move(rectFirstElement.left - 40, rectFirstElement.top, { steps: 2 });
    await page.waitFor(200);
    await page.mouse.up();

    rectFirstElement = await page.evaluate((element: HTMLDivElement) => {
      const {
        top, left, bottom, right,
      } = element.getBoundingClientRect();
      return {
        top, left, bottom, right,
      };
    }, firstElement);

    const coefficientPoint = getCoefficientPoint(sliderLineWidth, state.max, state.min);
    let currentValueTooltip = String(calculateValue(rectFirstElement.left, startPointSlider));
    let tooltipsText: puppeteer.ElementHandle<Element>[] = await page.$$('.js-slider__tooltip-text');
    let tooltipText: puppeteer.ElementHandle<Element> = tooltipsText[0];
    let innerHTMLTooltip = await page.evaluateHandle((element: HTMLElement) => element.innerHTML, tooltipText);

    expect(await innerHTMLTooltip.jsonValue()).toBe(currentValueTooltip);

    // Найти координаты последнего ползунка
    const lastElement: puppeteer.ElementHandle<Element> = thumbsElements[thumbsElements.length - 1];
    let rectLastElement = await page.evaluate((element: HTMLDivElement) => {
      const {
        top, left, bottom, right,
      } = element.getBoundingClientRect();
      return {
        top, left, bottom, right,
      };
    }, lastElement);

    await page.mouse.move(rectLastElement.left, rectLastElement.top);
    await page.mouse.down();
    await page.waitFor(200);
    await page.mouse.move(rectLastElement.left - 75, rectLastElement.top, { steps: 2 });
    await page.waitFor(200);
    await page.mouse.up();

    rectLastElement = await page.evaluate((element: HTMLDivElement) => {
      const {
        top, left, bottom, right,
      } = element.getBoundingClientRect();
      return {
        top, left, bottom, right,
      };
    }, lastElement);

    currentValueTooltip = String(calculateValue(rectLastElement.left, startPointSlider));
    tooltipsText = await page.$$('.js-slider__tooltip-text');
    tooltipText = tooltipsText[tooltipsText.length - 1];
    innerHTMLTooltip = await page.evaluateHandle((element: HTMLElement) => element.innerHTML, tooltipText);

    expect(await innerHTMLTooltip.jsonValue()).toBe(currentValueTooltip);
  });
});
