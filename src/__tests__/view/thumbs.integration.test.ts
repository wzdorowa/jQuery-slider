import puppeteer from 'puppeteer';
import { IModelState } from '../../slider/interfaces/iModelState';

interface IRectNextThumb {
    top: number,
    left: number,
    bottom: number,
    right: number
}
const state: IModelState = {
  min: 0,
  max: 100,
  thumbsValues: [20, 30, 40, 50],
  orientation: 'horizontal',
  amount: 4,
  step: 2,
  isTooltip: true,
};

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
  test('Checking the location of the thumbs on the slider', async () => {
    await page.goto('http://localhost:1234');
    await page.waitFor(300);

    // Function for finding the scale division factor in pixels
    const getCoefficientPoint = (scaleLength: number, max: number, min: number) => {
      const value = scaleLength / (max - min);
      return value;
    };
    const getOffsetNextThumb = (rectNextThumbs: IRectNextThumb,
      widthNextThumbs: number, startPointThumbs: number): number => {
      const value = Math.ceil(rectNextThumbs.left - widthNextThumbs - startPointThumbs);
      return value;
    };
    const getOffsetPreviousThumb = (rectPreviousThumb: IRectNextThumb,
      widthNextThumb: number, startPointThumb: number): number => {
      const value = Math.ceil(rectPreviousThumb.left + widthNextThumb - startPointThumb);
      return value;
    };
    /* the method calculates the current value of the thumb */
    const calculateValue = (modelState: IModelState, currentValueAxis: number,
      coefficientPoint: number) => {
      let currentValue: number = Math.floor(currentValueAxis / coefficientPoint) + modelState.min;
      const multi: number = Math.floor(currentValue / modelState.step);
      currentValue = modelState.step * multi;
      return currentValue;
    };
    /* the method calculates the value of the position of the thumb on the scale */
    const calculateValueOfPlaceOnScale = (modelState: IModelState, offsetThumb: number,
      scaleLength: number, max: number, min: number, startPointSlider: number) => {
      const coefficientPoint = getCoefficientPoint(scaleLength, max, min);
      const shiftToMinValue = Math.ceil(coefficientPoint * modelState.min);
      let currentValue: number = calculateValue(modelState, offsetThumb, coefficientPoint);
      const halfStep = Math.floor((currentValue + (modelState.step / 2)) * coefficientPoint)
      - shiftToMinValue;

      if (offsetThumb > halfStep) {
        currentValue += modelState.step;
      }
      return Math.ceil((currentValue * coefficientPoint) + startPointSlider);
    };
    // Find slider scale coordinates
    const scale: puppeteer.ElementHandle<Element> | null = await page.$('.js-slider__scale');
    const rectScale = await page.evaluate((sliderLine: HTMLDivElement) => {
      const {
        top, left, bottom, right,
      } = sliderLine.getBoundingClientRect();
      return {
        top, left, bottom, right,
      };
    }, scale);
    const scaleWidth: number = rectScale.right - rectScale.left;

    // Find the first thumb and its width
    const thumbElements: puppeteer.ElementHandle<Element>[] = await page.$$('.js-slider__thumb');
    const firstElement: puppeteer.ElementHandle<Element> = thumbElements[0];
    let rectFirstElement = await page.evaluate((element: HTMLDivElement) => {
      const {
        top, left, bottom, right,
      } = element.getBoundingClientRect();
      return {
        top, left, bottom, right,
      };
    }, firstElement);
    const elementWidth: number = rectFirstElement.right - rectFirstElement.left;

    // Find the coordinates of the second thumb
    const secondElement: puppeteer.ElementHandle<Element> = thumbElements[1];
    const rectSecondElement = await page.evaluate((element: HTMLDivElement) => {
      const {
        top, left, bottom, right,
      } = element.getBoundingClientRect();
      return {
        top, left, bottom, right,
      };
    }, secondElement);

    // Slider scale start and end points
    const startPointSlider = rectScale.left - (elementWidth / 2);
    const endPointSlider = rectScale.right + (elementWidth / 2);

    // Determine the values, ratios before testing the first thumb
    let offsetNextThumb: number = getOffsetNextThumb(rectSecondElement,
      elementWidth, startPointSlider);
    let currentValue: number = calculateValueOfPlaceOnScale(state, offsetNextThumb,
      scaleWidth, state.max, state.min, startPointSlider);

    // Check if the first thumb works correctly
    await page.mouse.move(rectFirstElement.left, rectFirstElement.top);
    await page.mouse.down();
    await page.waitFor(200);
    await page.mouse.move(rectFirstElement.left - 200, rectFirstElement.top, { steps: 2 });
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
    expect(rectFirstElement.left).toBe(startPointSlider);

    await page.mouse.move(rectFirstElement.left, rectFirstElement.top);
    await page.mouse.down();
    await page.waitFor(200);
    await page.mouse.move(rectFirstElement.left + 250, rectFirstElement.top, { steps: 2 });
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
    expect(rectFirstElement.left).toBe(currentValue);

    // Check the correct movement of the thumb when clicking on the scale
    await page.waitFor(200);
    await page.mouse.click(rectScale.left + 30, rectScale.top);
    await page.waitFor(200);

    rectFirstElement = await page.evaluate((element: HTMLDivElement) => {
      const {
        top, left, bottom, right,
      } = element.getBoundingClientRect();
      return {
        top, left, bottom, right,
      };
    }, firstElement);

    offsetNextThumb = Math.ceil((rectScale.left + 30) - elementWidth / 2 - startPointSlider);
    currentValue = calculateValueOfPlaceOnScale(state, offsetNextThumb, scaleWidth,
      state.max, state.min, startPointSlider);
    expect(rectFirstElement.left).toBe(currentValue);

    // Check the correct operation of one of the intermediate thumbs, for example, the third
    // Find the coordinates of the third thumb
    const thirdElement: puppeteer.ElementHandle<Element> = thumbElements[2];
    let rectThirdElement = await page.evaluate((element: HTMLDivElement) => {
      const {
        top, left, bottom, right,
      } = element.getBoundingClientRect();
      return {
        top, left, bottom, right,
      };
    }, thirdElement);

    // Find the coordinates of the last thumb
    const lastElement: puppeteer.ElementHandle<Element> = thumbElements[3];
    let rectLastElement = await page.evaluate((element: HTMLDivElement) => {
      const {
        top, left, bottom, right,
      } = element.getBoundingClientRect();
      return {
        top, left, bottom, right,
      };
    }, lastElement);

    let offsetPreviousThumb = getOffsetPreviousThumb(rectSecondElement,
      elementWidth, startPointSlider);
    offsetNextThumb = getOffsetNextThumb(rectLastElement, elementWidth, startPointSlider);
    currentValue = calculateValueOfPlaceOnScale(state, offsetNextThumb,
      scaleWidth, state.max, state.min, startPointSlider);

    await page.mouse.move(rectThirdElement.left, rectThirdElement.top);
    await page.mouse.down();
    await page.waitFor(200);
    await page.mouse.move(rectThirdElement.left + 80, rectThirdElement.top, { steps: 2 });
    await page.waitFor(200);
    await page.mouse.up();

    rectThirdElement = await page.evaluate((element: HTMLDivElement) => {
      const {
        top, left, bottom, right,
      } = element.getBoundingClientRect();
      return {
        top, left, bottom, right,
      };
    }, thirdElement);

    expect(rectThirdElement.left).toBe(currentValue);
    currentValue = calculateValueOfPlaceOnScale(state, offsetPreviousThumb,
      scaleWidth, state.max, state.min, startPointSlider);

    await page.mouse.move(rectThirdElement.left, rectThirdElement.top);
    await page.mouse.down();
    await page.waitFor(200);
    await page.mouse.move(rectThirdElement.left - 90, rectThirdElement.top, { steps: 2 });
    await page.waitFor(200);
    await page.mouse.up();

    rectThirdElement = await page.evaluate((element: HTMLDivElement) => {
      const {
        top, left, bottom, right,
      } = element.getBoundingClientRect();
      return {
        top, left, bottom, right,
      };
    }, thirdElement);

    expect(rectThirdElement.left).toBe(currentValue);

    // Check the correctness of the last thumb
    offsetPreviousThumb = getOffsetPreviousThumb(rectThirdElement, elementWidth, startPointSlider);
    currentValue = calculateValueOfPlaceOnScale(state, offsetPreviousThumb,
      scaleWidth, state.max, state.min, startPointSlider);

    await page.mouse.move(rectLastElement.left, rectLastElement.top);
    await page.mouse.down();
    await page.waitFor(200);
    await page.mouse.move(rectLastElement.left - 90, rectLastElement.top, { steps: 2 });
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

    expect(rectLastElement.left).toBe(currentValue);

    await page.mouse.move(rectLastElement.left, rectLastElement.top);
    await page.mouse.down();
    await page.waitFor(200);
    await page.mouse.move(rectLastElement.left + 195, rectLastElement.top, { steps: 2 });
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

    expect(rectLastElement.right).toBe(endPointSlider);

    // Check the correct movement of the thumb when clicking on the scale
    await page.waitFor(200);
    await page.mouse.click(endPointSlider - 50, rectScale.top);
    await page.waitFor(200);

    rectLastElement = await page.evaluate((element: HTMLDivElement) => {
      const {
        top, left, bottom, right,
      } = element.getBoundingClientRect();
      return {
        top, left, bottom, right,
      };
    }, lastElement);

    offsetNextThumb = Math.ceil((endPointSlider - 50) - elementWidth / 2 - startPointSlider);
    currentValue = calculateValueOfPlaceOnScale(state, offsetNextThumb,
      scaleWidth, state.max, state.min, startPointSlider);
    expect(rectLastElement.left).toBe(currentValue);
  });
});
describe('Integration tests for vertical view', () => {
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
  test('Checking the location of the sliders on the slider', async () => {
    await page.goto('http://localhost:1234');
    await page.waitFor(300);

    const getCoefficientPoint = (sliderLineLength: number, max: number, min: number) => {
      const value = sliderLineLength / (max - min);
      return value;
    };
    const getOffsetNextThumb = (rectNextThumb: IRectNextThumb, widthNextThumb:
      number, startPointSlider: number): number => {
      const value = Math.ceil(rectNextThumb.top - widthNextThumb - startPointSlider);
      return value;
    };
    const getOffsetPreviousThumb = (rectPreviousThumb: IRectNextThumb, widthNextThumb:
      number, startPointThumb: number): number => {
      const value = Math.ceil(rectPreviousThumb.top + widthNextThumb - startPointThumb);
      return value;
    };
    /* the method calculates the current value of the thumb */
    const calculateValue = (modelState: IModelState, currentValueAxis: number,
      coefficientPoint: number) => {
      let currentValue: number = Math.floor(currentValueAxis / coefficientPoint) + modelState.min;
      const multi: number = Math.floor(currentValue / modelState.step);
      currentValue = modelState.step * multi;
      return currentValue;
    };
    /* the method calculates the value of the position of the thumb on the scale */
    const calculateValueOfPlaceOnScale = (modelState: IModelState, offsetThumb: number,
      scaleLength: number, max: number, min: number, startPointSlider: number) => {
      const coefficientPoint = getCoefficientPoint(scaleLength, max, min);
      const shiftToMinValue = Math.ceil(coefficientPoint * modelState.min);
      let currentValue: number = calculateValue(modelState, offsetThumb, coefficientPoint);
      const halfStep = Math.floor((currentValue + (modelState.step / 2))
      * coefficientPoint) - shiftToMinValue;

      if (offsetThumb > halfStep) {
        currentValue += modelState.step;
      }
      return Math.ceil((currentValue * coefficientPoint) + startPointSlider);
    };

    // Switch to vertical view
    await page.mouse.click(213.5, 69);
    await page.waitFor(500);

    // Find slider scale coordinates
    const scale: puppeteer.ElementHandle<Element> | null = await page.$('.js-slider__vertical-scale');
    const rectScale = await page.evaluate((element: HTMLDivElement) => {
      const {
        top, left, bottom, right,
      } = element.getBoundingClientRect();
      return {
        top, left, bottom, right,
      };
    }, scale);
    const scaleLength: number = rectScale.bottom - rectScale.top;

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
    const elementHeight: number = rectFirstElement.bottom - rectFirstElement.top;

    // Find the coordinates of the second thumb
    const secondElement: puppeteer.ElementHandle<Element> = thumbsElements[1];
    const rectSecondElement: IRectNextThumb = await
    page.evaluate((element: HTMLDivElement): IRectNextThumb => {
      const {
        top, left, bottom, right,
      } = element.getBoundingClientRect();
      return {
        top, left, bottom, right,
      };
    }, secondElement);

    // Slider scale start and end points
    const startPointSlider = rectScale.top - (elementHeight / 2);
    const endPointSlider = rectScale.bottom - (elementHeight / 2);

    // Determine the values, ratios before testing the first thumb
    let offsetNextThumb: number = getOffsetNextThumb(rectSecondElement, elementHeight,
      startPointSlider);
    let currentValue = calculateValueOfPlaceOnScale(state, offsetNextThumb,
      scaleLength, state.max, state.min, startPointSlider);

    // Check if the first thumb works correctly
    await page.mouse.move(rectFirstElement.left, rectFirstElement.top);
    await page.mouse.down();
    await page.waitFor(200);
    await page.mouse.move(rectFirstElement.left, rectFirstElement.top - 190, { steps: 1 });
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
    expect(rectFirstElement.top).toBe(startPointSlider);

    await page.mouse.move(rectFirstElement.left, rectFirstElement.top);
    await page.mouse.down();
    await page.waitFor(200);
    await page.mouse.move(rectFirstElement.left, rectFirstElement.top + 150, { steps: 1 });
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
    expect(rectFirstElement.top).toBe(currentValue);

    // Check the correct operation of one of the intermediate thumbs, for example, the third
    // Find the coordinates of the third thumb
    const thirdElement: puppeteer.ElementHandle<Element> = thumbsElements[2];
    let rectThirdElement = await page.evaluate((element: HTMLDivElement) => {
      const {
        top, left, bottom, right,
      } = element.getBoundingClientRect();
      return {
        top, left, bottom, right,
      };
    }, thirdElement);

    // Find the coordinates of the last thumb
    const lastElement: puppeteer.ElementHandle<Element> = thumbsElements[3];
    let rectLastElement = await page.evaluate((element: HTMLDivElement) => {
      const {
        top, left, bottom, right,
      } = element.getBoundingClientRect();
      return {
        top, left, bottom, right,
      };
    }, lastElement);

    let offsetPreviousThumb = getOffsetPreviousThumb(rectSecondElement,
      elementHeight, startPointSlider);
    offsetNextThumb = getOffsetNextThumb(rectLastElement, elementHeight, startPointSlider);
    currentValue = calculateValueOfPlaceOnScale(state, offsetPreviousThumb,
      scaleLength, state.max, state.min, startPointSlider);

    await page.mouse.move(rectThirdElement.left, rectThirdElement.top);
    await page.mouse.down();
    await page.waitFor(200);
    await page.mouse.move(rectThirdElement.left, rectThirdElement.top - 70, { steps: 1 });
    await page.waitFor(200);
    await page.mouse.up();

    rectThirdElement = await page.evaluate((element: HTMLDivElement) => {
      const {
        top, left, bottom, right,
      } = element.getBoundingClientRect();
      return {
        top, left, bottom, right,
      };
    }, thirdElement);

    expect(rectThirdElement.top).toBe(currentValue);
    currentValue = calculateValueOfPlaceOnScale(state, offsetNextThumb,
      scaleLength, state.max, state.min, startPointSlider);

    await page.mouse.move(rectThirdElement.left, rectThirdElement.top);
    await page.mouse.down();
    await page.waitFor(200);
    await page.mouse.move(rectThirdElement.left, rectThirdElement.top + 85, { steps: 1 });
    await page.waitFor(200);
    await page.mouse.up();

    rectThirdElement = await page.evaluate((element: HTMLDivElement) => {
      const {
        top, left, bottom, right,
      } = element.getBoundingClientRect();
      return {
        top, left, bottom, right,
      };
    }, thirdElement);

    expect(rectThirdElement.top).toBe(currentValue);

    // Check the correctness of the last thumb
    offsetPreviousThumb = getOffsetPreviousThumb(rectThirdElement,
      elementHeight, startPointSlider);
    currentValue = calculateValueOfPlaceOnScale(state, offsetPreviousThumb,
      scaleLength, state.max, state.min, startPointSlider);

    await page.mouse.move(rectLastElement.left, rectLastElement.top);
    await page.mouse.down();
    await page.waitFor(200);
    await page.mouse.move(rectLastElement.left, rectLastElement.top + 190, { steps: 1 });
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

    expect(rectLastElement.top).toBe(endPointSlider);

    await page.mouse.move(rectLastElement.left, rectLastElement.top);
    await page.mouse.down();
    await page.waitFor(200);
    await page.mouse.move(rectLastElement.left, rectLastElement.top - 200, { steps: 1 });
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

    expect(rectLastElement.top).toBe(currentValue);
  });
});
