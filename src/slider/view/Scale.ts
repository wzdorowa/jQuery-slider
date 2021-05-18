import EventEmitter from '../EventEmitter';
import { IModelState } from '../interfaces/iModelState';
import { IDriver } from '../interfaces/iDriver';
import driverHorizontal from './drivers/driverHorizontal';
import driverVertical from './drivers/driverVertical';

class Scale {
  private slider: HTMLElement;

  private emitter: EventEmitter;

  private scale!: HTMLElement;

  private orientation: string | null;

  private driver: IDriver | null;

  private thumbsValues: number[];

  constructor(element: HTMLElement, emitter: EventEmitter) {
    this.slider = element;
    this.emitter = emitter;
    this.orientation = null;
    this.driver = null;
    this.thumbsValues = [];
  }

  public initializeScale(state: IModelState): void {
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

  public setConfig(state: IModelState): void {
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
    this.driver?.updateActiveRange(this.slider);
    this.thumbsValues = state.thumbsValues;
  }

  /* function createScale adds scale elements to the main html slider structure */
  private createScale(): void {
    if (this.driver !== null) {
      const scale: HTMLElement = this.driver.createElementScale();
      const activeRange: HTMLElement = this.driver.createElementActiveRange();

      this.slider.append(scale);
      scale.append(activeRange);

      this.scale = scale;
    }
  }

  private changeOrientation(): void {
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

  private listenScaleEvents(): void {
    this.scale.addEventListener('click', this.handleScaleClick.bind(this));
  }

  private handleScaleClick(event: MouseEvent): void {
    this.emitter.emit('view:click-on-scale', event);
  }
}
export default Scale;
