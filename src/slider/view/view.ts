import driverHorizontal from './drivers/driverHorizontal';
import driverVertical from './drivers/driverVertical';
import EventEmitter from '../eventEmitter';
import { IModelState } from '../interfaces/iModelState';
import { IDriver } from '../interfaces/iDriver';
import Scale from '../view/scale';
import Thumbs from './thumbs';
import Tooltips from '../view/tooltips';

class View {
  private slider: HTMLElement;

  private isCreatedSlider: boolean;

  private modelState!: IModelState;

  private driver!: IDriver;

  private currentOrientation: string | null;

  private emitter: EventEmitter;

  private scale!: Scale;

  private thumbs!: Thumbs;

  private tooltips!: Tooltips;

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

  private renderView(state: IModelState): void {
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
        this.scale.changeOrientation(
          this.thumbs.setThumbToNewPosition.bind(this.thumbs),
          this.modelState,
          this.driver,
        );

        this.tooltips.changeOrientation(this.driver);

        this.thumbs.setValuesThumbs({
          modelState: this.modelState,
          activeRange: this.scale.activeRange,
          scale: this.scale.scale,
          driver: this.driver,
        });

        this.tooltips.setTooltipsValues(this.modelState);

        // this.thumbs.overrideThumbsEventHandlers({
        //   modelState: this.modelState,
        //   driver: this.driver,
        //   scale: this.scale.scale,
        //   activeRange: this.scale.activeRange,
        //   setCurrentTooltipValue: this.tooltips.setCurrentTooltipValue.bind(
        //     this.tooltips,
        //   ),
        // });

        // this.thumbs.listenSizeWindowWhenChangingOrientation({
        //   modelState: this.modelState,
        //   driver: this.driver,
        //   scale: this.scale.scale,
        //   activeRange: this.scale.activeRange,
        // });
      }
    }
    if (!this.isCreatedSlider) {
      this.scale.createScale(this.driver);
      this.thumbs.createThumbs(this.modelState.thumbsCount);
      this.tooltips.createTooltips(
        this.modelState.thumbsCount,
        this.thumbs.state.thumbs,
        this.driver,
      );
      this.thumbs.state.minValueSlider = this.modelState.min;
      this.thumbs.state.maxValueSlider = this.modelState.max;
      this.thumbs.state.stepSlider = this.modelState.step;
      this.isCreatedSlider = true;
      this.thumbs.setValuesThumbs({
        modelState: this.modelState,
        activeRange: this.scale.activeRange,
        scale: this.scale.scale,
        driver: this.driver,
      });

      this.thumbs.listenThumbsEvents({
        modelState: this.modelState,
        driver: this.driver,
        scale: this.scale.scale,
        activeRange: this.scale.activeRange,
        setCurrentTooltipValue: this.tooltips.setCurrentTooltipValue.bind(
          this.tooltips,
        ),
      });
      this.scale.listenScaleEvents(
        this.thumbs.setThumbToNewPosition.bind(this.thumbs),
        this.modelState,
        this.driver,
      );
      this.thumbs.listenSizeWindow({
        scale: this.scale.scale,
        activeRange: this.scale.activeRange,
        modelState: this.modelState,
        driver: this.driver,
      });
    }
    if (this.thumbs.state.minValueSlider !== this.modelState.min) {
      this.thumbs.state.minValueSlider = this.modelState.min;
      // this.thumbs.overrideThumbsEventHandlers({
      //   modelState: this.modelState,
      //   driver: this.driver,
      //   scale: this.scale.scale,
      //   activeRange: this.scale.activeRange,
      //   setCurrentTooltipValue: this.tooltips.setCurrentTooltipValue.bind(
      //     this.tooltips,
      //   ),
      // });
    }
    if (this.thumbs.state.maxValueSlider !== this.modelState.max) {
      this.thumbs.state.maxValueSlider = this.modelState.max;

      // this.thumbs.overrideThumbsEventHandlers({
      //   modelState: this.modelState,
      //   driver: this.driver,
      //   scale: this.scale.scale,
      //   activeRange: this.scale.activeRange,
      //   setCurrentTooltipValue: this.tooltips.setCurrentTooltipValue.bind(
      //     this.tooltips,
      //   ),
      // });
    }
    if (this.thumbs.state.stepSlider !== this.modelState.step) {
      this.thumbs.state.stepSlider = this.modelState.step;

      // this.thumbs.overrideThumbsEventHandlers({
      //   modelState: this.modelState,
      //   driver: this.driver,
      //   scale: this.scale.scale,
      //   activeRange: this.scale.activeRange,
      //   setCurrentTooltipValue: this.tooltips.setCurrentTooltipValue.bind(
      //     this.tooltips,
      //   ),
      // });
    }
    if (this.thumbs.state.thumbs.length !== this.modelState.thumbsCount) {
      this.thumbs.changeAmountThumbs({
        modelState: this.modelState,
        driver: this.driver,
        scale: this.scale.scale,
        activeRange: this.scale.activeRange,
        setCurrentTooltipValue: this.tooltips.setCurrentTooltipValue.bind(
          this.tooltips,
        ),
      });
    }
    if (
      this.tooltips.tooltipsElements.length !==
      this.modelState.thumbsValues.length
    ) {
      this.tooltips.changeAmountTooltips(
        this.thumbs.state.thumbs,
        this.driver,
        this.modelState,
      );
    }
    if (this.modelState.isTooltip === false) {
      this.tooltips.hideTooltip();
    }
    if (this.modelState.isTooltip === true) {
      this.tooltips.showTooltip();
    }
    this.thumbs.updateThumbsPosition({
      modelState: this.modelState,
      activeRange: this.scale.activeRange,
      driver: this.driver,
      scale: this.scale.scale,
    });
    this.tooltips.setTooltipsValues(this.modelState);
  }
}
export default View;
