import { configuratorHorizontal } from './configurators/configuratorHorizontal';
import { configuratorVertical } from './configurators/configuratorVertical';
import { EventEmitter } from '../eventEmitter';
import { IModelState } from '../interfaces/iModelState';
import { IConfigurator } from '../interfaces/iConfigurator';
import { Scale } from '../view/scale';
import { Thumbs } from './thumbs';
import { Tooltips } from '../view/tooltips';

export default class View {
    private slider: HTMLElement

    private isCreatedSlider: boolean

    private modelState!: IModelState

    private configurator!: IConfigurator

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
        this.modelState = state;
        if (this.modelState.orientation === 'horizontal') {
          this.configurator = configuratorHorizontal;
        }
        if (this.modelState.orientation === 'vertical') {
          this.configurator = configuratorVertical;
        }
        if (this.currentOrientation !== this.modelState.orientation) {
          this.currentOrientation = this.modelState.orientation;
          if (this.isCreatedSlider) {
            this.scale.changeOrientation(this.thumbs.setThumbToNewPosition.bind(this.thumbs),
              this.modelState, this.configurator);
            this.tooltips.changeOrientation(this.configurator);
            this.thumbs.setValuesThumbs(this.modelState, this.scale.activeRange,
              this.scale.scale, this.configurator);
            this.tooltips.setTooltipsValues(this.modelState);
            this.thumbs.listenThumbsEventsWhenChangingOrientation(this.modelState,
              this.configurator, this.scale.scale, this.scale.activeRange,
              this.tooltips.setCurrentTooltipValue.bind(this.tooltips));
            this.thumbs.listenSizeWindowWhenChangingOrientation(this.modelState,
              this.configurator, this.scale.scale, this.scale.activeRange);
          }
        }
        if (!this.isCreatedSlider) {
          this.scale.createScale(this.configurator);
          this.thumbs.createThumbs(this.modelState.amount);
          this.tooltips.createTooltips(this.modelState.amount, this.thumbs.state.thumbs,
            this.configurator);
          this.isCreatedSlider = true;
          this.thumbs.setValuesThumbs(this.modelState, this.scale.activeRange,
            this.scale.scale, this.configurator);

          this.thumbs.listenThumbsEvents(this.modelState, this.configurator,
            this.scale.scale, this.scale.activeRange,
            this.tooltips.setCurrentTooltipValue.bind(this.tooltips));
          this.scale.listenScaleEvents(this.thumbs.setThumbToNewPosition.bind(this.thumbs),
            this.modelState, this.configurator);
          this.thumbs.listenSizeWindow(this.scale.scale, this.scale.activeRange,
            this.modelState, this.configurator);
        }
        if (this.thumbs.state.thumbs.length !== this.modelState.amount) {
          this.thumbs.changeAmountThumbs(this.modelState, this.configurator,
            this.scale.scale, this.scale.activeRange,
            this.tooltips.setCurrentTooltipValue.bind(this.tooltips));
        }
        if (this.tooltips.tooltipsElements.length !== this.modelState.thumbsValues.length) {
          this.tooltips.changeAmountTooltips(this.thumbs.state.thumbs, this.configurator,
            this.modelState);
        }
        if (this.modelState.isTooltip === false) {
          this.tooltips.hideTooltip();
        }
        if (this.modelState.isTooltip === true) {
          this.tooltips.showTooltip();
        }
        this.thumbs.setNewValuesForThumbs(this.scale.scale, this.scale.activeRange,
          this.modelState, this.configurator);
        this.tooltips.setTooltipsValues(this.modelState);
      });
    }
}
