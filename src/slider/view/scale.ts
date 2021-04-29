import EventEmitter from '../eventEmitter';
import { IModelState } from '../interfaces/iModelState';
import { IDriver } from '../interfaces/iDriver';
import driverHorizontal from './drivers/driverHorizontal';
import driverVertical from './drivers/driverVertical';

class Scale {
  public slider: HTMLElement;

  public emitter: EventEmitter;

  public scale!: HTMLElement;

  public activeRange!: HTMLElement;

  public orientation: string | null;

  public driver: IDriver | null;

  public thumbsValues: number[];

  constructor(element: HTMLElement, emitter: EventEmitter) {
    this.slider = element;
    this.emitter = emitter;
    this.orientation = null;
    this.driver = null;
    this.thumbsValues = [];
  }

  initializeScale(state: IModelState): void {
    if (this.orientation !== state.orientation) {
      this.orientation = state.orientation;
    }
    if (state.orientation === 'horizontal') {
      this.driver = driverHorizontal;
    }
    if (state.orientation === 'vertical') {
      this.driver = driverVertical;
    }
    if (this.thumbsValues !== state.thumbsValues) {
      this.thumbsValues = state.thumbsValues;
    }

    this.createScale();
    this.listenScaleEvents();
  }

  setConfig(state: IModelState): void {
    if (this.orientation !== state.orientation) {
      if (state.orientation === 'horizontal') {
        this.driver = driverHorizontal;
      }
      if (state.orientation === 'vertical') {
        this.driver = driverVertical;
      }
      this.orientation = state.orientation;
      this.changeOrientation();
    }
    const thumbs: HTMLElement[] = Array.from(
      this.slider.querySelectorAll('.js-slider__thumb'),
    );
    this.driver?.updateActiveRange(this.activeRange, thumbs);
    this.thumbsValues = state.thumbsValues;
  }

  /* function createScale adds scale elements to the main html slider structure */
  createScale(): void {
    if (this.driver !== null) {
      const scale: HTMLElement = this.driver.createElementScale();
      const activeRange: HTMLElement = this.driver.createElementActiveRange();

      this.slider.append(scale);
      scale.append(activeRange);

      this.activeRange = activeRange;
      this.scale = scale;
    }
  }

  changeOrientation(): void {
    if (this.driver !== null) {
      const activeRangeToRemove: JQuery<HTMLElement> = this.driver.searchElementActiveRangeToDelete(
        this.slider,
      );
      activeRangeToRemove.remove();
      const scaleToDelete: JQuery<HTMLElement> = this.driver.searchElementScaleToDelete(
        this.slider,
      );
      scaleToDelete.remove();

      this.createScale();
      this.listenScaleEvents();
    }
  }

  listenScaleEvents(): void {
    const handleScaleClick: (event: MouseEvent) => void = event =>
      this.emitter.emit('view:click-on-scale', event);
    this.scale.addEventListener('click', handleScaleClick);
  }
}
export default Scale;
