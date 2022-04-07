import { IAdapter } from '../interfaces/IAdapter';

const getPointSize = (
  slider: HTMLElement,
  adapter: IAdapter,
  min: number,
  max: number,
): number | null => {
  const progressBar: HTMLElement | null = slider.querySelector(
    '.slider__progress-bar',
  );
  if (progressBar !== null) {
    return progressBar[adapter.offsetLength] / (max - min);
  }
  return null;
};

export default getPointSize;
