import puppeteer from 'puppeteer';
import EventEmitter from '../../slider/eventEmitter';
import { IModelState } from '../../slider/interfaces/iModelState';
import View from '../../slider/view/view';

const state: IModelState = {
  min: 0,
  max: 100,
  thumbsValues: [20, 30, 40, 50],
  orientation: 'horizontal',
  amount: 4,
  step: 2,
  isTooltip: true,
};

describe('Unit tests', () => {
  const slider = window.document.createElement('div');
  slider.className = 'js-slider-test';
  window.document.body.appendChild(slider);

  const eventEmitter = new EventEmitter();
  const view = new View(slider, eventEmitter);

  test('Checking the correctness of tooltips creation', () => {
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
  test('Checking the setting of default sliders values ​​in their corresponding tooltips', () => {
    const textInTooltipsElements = window.document.querySelectorAll('.js-slider__tooltip-text');
    state.thumbsValues.forEach((element: number, i: number) => {
      expect(String(element)).toBe(textInTooltipsElements[i].innerHTML);
    });
  });
  test('Checking the change in the number of rendered tooltips when changing the number of sliders', () => {
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
  test('Checking redrawing of tooltips when changing orientation', () => {
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
  test('Check for the presence of values ​​in tooltips', () => {
    const tooltipsText = window.document.querySelectorAll('.js-slider__tooltip-text');

    expect(tooltipsText[0].innerHTML).toContain('20');
    expect(tooltipsText[1].innerHTML).toContain('30');
    expect(tooltipsText[2].innerHTML).toContain('40');
  });
  test('Checking if thumbs tooltips are hidden', () => {
    state.isTooltip = false;
    eventEmitter.emit('model:state-changed', state);

    const tooltipsElements = window.document.querySelectorAll('.js-slider__tooltip');
    tooltipsElements.forEach((element) => {
      expect(element.className).toContain('slider__tooltip-hide');
    });
  });
  test('Checking the display of thumbs tooltips', () => {
    state.isTooltip = true;
    eventEmitter.emit('model:state-changed', state);

    const tooltipsElements = window.document.querySelectorAll('.js-slider__tooltip');
    tooltipsElements.forEach((element) => {
      expect(element.className).not.toContain('slider__tooltip-hide');
    });
  });
});
describe('Integration tests for horizontal view', () => {
  let browser: puppeteer.Browser;
  let page: puppeteer.Page;

  beforeEach(async () => {
    const element: HTMLDivElement | null = window.document.querySelector('.js-slider-test');
    if (element !== null) {
      if (element !== undefined) {
        element.remove();
      }
    }
    browser = await puppeteer.launch({ headless: false });
    page = await browser.newPage();
  });
  afterEach(async () => {
    await browser.close();
  });
  test('Check the correctness of value changes in horizontal tooltips', async () => {
    await page.goto('http://localhost:1234');
    await page.waitFor(500);

    // Function for finding the slider scale division factor in pixels
    const getCoefficientPoint = (sliderLineWidth: number, max: number, min: number) => {
      const value = sliderLineWidth / (max - min);
      return value;
    };
    const calculateValue = (offsetLeft: number, startSlider: number, coefficientPoint: number) => {
      let currentValueX: number = Math.floor((offsetLeft - startSlider)
      / coefficientPoint) + state.min;
      const multi: number = Math.floor(currentValueX / state.step);
      currentValueX = state.step * multi;
      return currentValueX;
    };
      // Find slider scale coordinates
    const sliderLine: puppeteer.ElementHandle<Element> | null = await page.$('.js-slider__scale');
    const rectSliderLine = await page.evaluate((element: HTMLDivElement) => {
      const {
        top, left, bottom, right,
      } = element.getBoundingClientRect();
      return {
        top, left, bottom, right,
      };
    }, sliderLine);
    const sliderLineWidth: number = rectSliderLine.right - rectSliderLine.left;

    // Find the first thumb and its width
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

    // Slider scale start and end points
    const startPointSlider = rectSliderLine.left - (elementWidth / 2);
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
    let currentValueTooltip = String(calculateValue(rectFirstElement.left,
      startPointSlider, coefficientPoint));
    let tooltipsText: puppeteer.ElementHandle<Element>[] = await page.$$('.js-slider__tooltip-text');
    let tooltipText: puppeteer.ElementHandle<Element> = tooltipsText[0];
    let innerHTMLTooltip = await page.evaluateHandle((element:
      HTMLElement) => element.innerHTML, tooltipText);

    expect(await innerHTMLTooltip.jsonValue()).toBe(currentValueTooltip);

    // Find the coordinates of the last thumb
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

    currentValueTooltip = String(calculateValue(rectLastElement.left,
      startPointSlider, coefficientPoint));
    tooltipsText = await page.$$('.js-slider__tooltip-text');
    tooltipText = tooltipsText[tooltipsText.length - 1];
    innerHTMLTooltip = await page.evaluateHandle((element:
      HTMLElement) => element.innerHTML, tooltipText);

    expect(await innerHTMLTooltip.jsonValue()).toBe(currentValueTooltip);
  });
});
