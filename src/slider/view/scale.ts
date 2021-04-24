import { IModelState } from '../interfaces/iModelState';
import { IDriver } from '../interfaces/iDriver';

class Scale {
  public slider: HTMLElement;

  public scale!: HTMLElement;

  public activeRange!: HTMLElement;

  public orientation: string | null;

  constructor(element: HTMLElement) {
    this.slider = element;
    this.orientation = null;
  }

  initializeScale(state: IModelState) {
    if (this.orientation !== state.orientation) {
      this.orientation = state.orientation;
    }

    this.createScale();
    this.listenScaleEvents();
  }

  setConfig(state: IModelState) {
    if (this.orientation !== state.orientation) {
      this.orientation = state.orientation;
    }
  }
  /* function createScale adds scale elements to the main html slider structure */
  createScale(): void {
    const scale: HTMLElement = driver.createElementScale();
    const activeRange: HTMLElement = driver.createElementActiveRange();

    this.slider.append(scale);
    scale.append(activeRange);

    this.activeRange = activeRange;
    this.scale = scale;
  }

  changeOrientation(): void {
    const activeRangeToRemove: JQuery<HTMLElement> = driver.searchElementActiveRangeToDelete(
      this.slider,
    );
    activeRangeToRemove.remove();
    const scaleToDelete: JQuery<HTMLElement> = driver.searchElementScaleToDelete(
      this.slider,
    );
    scaleToDelete.remove();

    this.createScale(driver);
    this.listenScaleEvents(setThumbToNewPosition, modelState, driver);
  }

  listenScaleEvents(): void {
    const handleScaleClick: (event: MouseEvent) => void = event =>
      setThumbToNewPosition(event, modelState, driver);
    this.scale.addEventListener('click', handleScaleClick);
  }
}
export default Scale;
