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
    private missingAmount: number | null

    constructor(element: HTMLElement, eventEmitter: EventEmitter) {
        this.parentBlock = element,
        this.isCreatedSlider = false,
        this.currentOrientation = null,
        this.missingAmount = null,
        this.emitter = eventEmitter,

        this.scale = new Scale(this.parentBlock)
        this.sliders = new Sliders(this.parentBlock, this.emitter)
        this.tooltips = new Tooltips(this.parentBlock, this.emitter)
        

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
                    this.scale.changeOrientation(this.sliders.setSliderTouchToNewPosition.bind(this.sliders), this.modelState, this.configurator);
                    this.tooltips.changeOrientation(this.configurator); 
                    this.sliders.setValuesSliders(this.modelState, this.scale.activeRange, this.scale.scale, this.configurator);
                    this.tooltips.setTooltipsValues(this.modelState);
                }
            }
            if(!this.isCreatedSlider) {
                this.scale.createScale(this.configurator);
                this.sliders.createSliders(this.modelState.amount);
                this.tooltips.createTooltips(this.modelState.amount, this.sliders.state.sliders, this.configurator);
                this.isCreatedSlider = true;
                this.sliders.setValuesSliders(this.modelState, this.scale.activeRange, this.scale.scale, this.configurator);

                this.sliders.listenSlidersEvents(this.modelState, this.configurator, this.scale.scale, this.scale.activeRange, this.tooltips.setCurrentTooltipValue.bind(this.tooltips));
                this.scale.listenScaleEvents(this.sliders.setSliderTouchToNewPosition.bind(this.sliders), this.modelState, this.configurator);
                this.listenSizeWindow()
            }
            if(this.sliders.state.sliders.length != this.modelState.amount) {
                this.missingAmount = this.modelState.amount - this.sliders.state.sliders.length;
                this.sliders.changeAmountSliders(this.modelState, this.configurator, this.scale.scale, this.scale.activeRange, this.tooltips.setCurrentTooltipValue.bind(this.tooltips));
            }
            if(this.tooltips.tooltipsElements.length != this.modelState.touchsValues.length) {
                this.tooltips.changeAmountTooltips(this.sliders.state.sliders, this.configurator, this.modelState);
            }
            if (this.modelState.tooltip === false) {
                this.tooltips.hideTooltip();
            }
            if (this.modelState.tooltip === true) {
                this.tooltips.showTooltip();
            }
            this.sliders.setNewValuesForSliders(this.scale.scale, this.scale.activeRange, this.modelState, this.configurator);
            this.tooltips.setTooltipsValues(this.modelState);
        })
    }
    private listenSizeWindow() {
        window.addEventListener('resize', () => this.sliders.setNewValuesForSliders(this.scale.scale, this.scale.activeRange, this.modelState, this.configurator));
    }
}