import {configuratorHorizontal} from '../configuratorHorizontal';
import {configuratorVertical} from '../configuratorVertical';
import {EventEmitter} from '../eventEmitter';
import {IModelState} from '../iModelState';
import {IConfigurator} from '../iConfigurator';
import {Scale} from '../view/scale';
import {Sliders} from '../view/sliders';
import {Tooltips} from '../view/tooltips';

export class View {
    private parentBlock: HTMLElement
    private isCreatedSlider: boolean
    private modelState!: IModelState
    private configurator!: IConfigurator
    private currentOrientation: string | null
    private emitter: EventEmitter
    private scale!: Scale
    private sliders!: Sliders
    private tooltips!: Tooltips

    constructor(element: HTMLElement, eventEmitter: EventEmitter) {
        this.parentBlock = element,
        this.isCreatedSlider = false,
        this.currentOrientation = null,
        this.emitter = eventEmitter,

        this.scale = new Scale(this.parentBlock, this.configurator)
        this.sliders = new Sliders(this.parentBlock, this.emitter, this.configurator)
        this.tooltips = new Tooltips(this.parentBlock, this.emitter, this.configurator)
        

        this.emitter.subscribe('model:state-changed', (state: IModelState) => {
            this.modelState = state;
            if (this.modelState.orientation === 'horizontal') {
                this.configurator = configuratorHorizontal;
            }
            if (this.modelState.orientation === 'vertical') {
                this.configurator = configuratorVertical;
            }
            
            if (this.currentOrientation != this.modelState.orientation) {
                this.currentOrientation = this.modelState.orientation;
                if(this.isCreatedSlider) {
                    this.scale.changeOrientation(this.sliders.setSliderTouchToNewPosition, this.modelState);
                    this.tooltips.changeOrientation(); 
                    this.sliders.setValuesSliders(this.modelState, this.scale.activeRange, this.scale.scale);
                    this.tooltips.setTooltipsValues(this.modelState);
                }
            }
            if(!this.isCreatedSlider) {
                this.scale.createScale();
                this.sliders.createSliders(this.modelState.amount);
                this.tooltips.createTooltips(this.modelState.amount, this.sliders.state.sliders);
                this.isCreatedSlider = true;
                this.sliders.setValuesSliders(this.modelState, this.scale.activeRange, this.scale.scale);

                this.sliders.listenSlidersEvents(this.modelState, this.scale.scale, this.scale.activeRange, this.tooltips.setCurrentTooltipValue);
                this.scale.listenScaleEvents(this.sliders.setSliderTouchToNewPosition, this.modelState);
                this.listenSizeWindow()
            }
            if(this.sliders.state.sliders.length != this.modelState.amount) {
                this.sliders.changeAmountSliders(this.modelState, this.scale.scale, this.scale.activeRange, this.tooltips.setCurrentTooltipValue);
                this.tooltips.changeAmountTooltips(this.modelState, this.sliders.state.sliders)
            }
            if (this.modelState.tooltip === false) {
                this.tooltips.hideTooltip();
            }
            if (this.modelState.tooltip === true) {
                this.tooltips.showTooltip();
            }
            this.sliders.setNewValuesForSliders(this.scale.scale, this.scale.activeRange, this.modelState);
            this.tooltips.setTooltipsValues(this.modelState);
        })
    }
    private listenSizeWindow() {
        window.addEventListener('resize', () => this.sliders.setNewValuesForSliders(this.scale.scale, this.scale.activeRange, this.modelState));
    }
}