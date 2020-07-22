import driverHorizontal from './drivers/driverHorizontal';
import driverVertical from './drivers/driverVertical';
import EventEmitter from '../eventEmitter';
import { IModelState } from '../interfaces/iModelState';
import { IDriver } from '../interfaces/iDriver';
import Scale from '../view/scale';
import Thumbs from './thumbs';
import Tooltips from '../view/tooltips';

class View {
    private slider: HTMLElement

    private isCreatedSlider: boolean

    private modelState!: IModelState

    private driver!: IDriver

    private currentOrientation: string | null

    private emitter: EventEmitter

    private scale!: Scale

    private thumbs!: Thumbs

    private tooltips!: Tooltips

    constructor(slider: HTMLElement, eventEmitter: EventEmitter) {
      this.slider = slider;
      this.isCreatedSlider = false;
      this.currentOrientation = null;
      this.emitter = eventEmitter;
      this.scale = new Scale(this.slider);
      this.thumbs = new Thumbs(this.slider, this.emitter);
      this.tooltips = new Tooltips(this.slider);
      this.emitter.makeSubscribe('model:state-changed', (state: IModelState) => {
        this.renderView(state);
      });
    }

    renderView(state: IModelState): void {
      this.modelState = { ...state };
      if (this.modelState.orientation === 'horizontal') {
        this.driver = driverHorizontal;
      }
      if (this.modelState.orientation === 'vertical') {
        this.driver = driverVertical;
      }
      if (this.currentOrientation !== this.modelState.orientation) {
        this.currentOrientation = this.modelState.orientation;
        if (this.isCreatedSlider) {
          this.scale.changeOrientation(this.thumbs.setThumbToNewPosition.bind(this.thumbs),
            this.modelState, this.driver);

          this.tooltips.changeOrientation(this.driver);

          this.thumbs.setValuesThumbs(this.modelState, this.scale.activeRange,
            this.scale.scale, this.driver);

          this.tooltips.setTooltipsValues(this.modelState);

          this.thumbs.listenThumbsEventsWhenChangingOrientation(this.modelState,
            this.driver, this.scale.scale, this.scale.activeRange,
            this.tooltips.setCurrentTooltipValue.bind(this.tooltips));

          this.thumbs.listenSizeWindowWhenChangingOrientation(this.modelState,
            this.driver, this.scale.scale, this.scale.activeRange);
        }
      }
      if (!this.isCreatedSlider) {
        this.scale.createScale(this.driver);
        this.thumbs.createThumbs(this.modelState.amount);
        this.tooltips.createTooltips(this.modelState.amount, this.thumbs.state.thumbs,
          this.driver);
        this.isCreatedSlider = true;
        this.thumbs.setValuesThumbs(this.modelState, this.scale.activeRange,
          this.scale.scale, this.driver);

        this.thumbs.listenThumbsEvents(this.modelState, this.driver,
          this.scale.scale, this.scale.activeRange,
          this.tooltips.setCurrentTooltipValue.bind(this.tooltips));
        this.scale.listenScaleEvents(this.thumbs.setThumbToNewPosition.bind(this.thumbs),
          this.modelState, this.driver);
        this.thumbs.listenSizeWindow(this.scale.scale, this.scale.activeRange,
          this.modelState, this.driver);
      }
      if (this.thumbs.state.thumbs.length !== this.modelState.amount) {
        this.thumbs.changeAmountThumbs(this.modelState, this.driver,
          this.scale.scale, this.scale.activeRange,
          this.tooltips.setCurrentTooltipValue.bind(this.tooltips));
      }
      if (this.tooltips.tooltipsElements.length !== this.modelState.thumbsValues.length) {
        this.tooltips.changeAmountTooltips(this.thumbs.state.thumbs, this.driver,
          this.modelState);
      }
      if (this.modelState.isTooltip === false) {
        this.tooltips.hideTooltip();
      }
      if (this.modelState.isTooltip === true) {
        this.tooltips.showTooltip();
      }
      this.thumbs.setNewValuesForThumbs(this.scale.scale, this.scale.activeRange,
        this.modelState, this.driver);
      this.tooltips.setTooltipsValues(this.modelState);
    }
}
export default View;
