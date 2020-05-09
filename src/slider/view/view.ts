import {configuratorHorizontal} from './configuratorHorizontal';
import {configuratorVertical} from './configuratorVertical';
import { EventEmitter } from './eventEmitter';
import {IModelState} from './iModelState';
import {IConfigurator} from './iConfigurator'
import {createElement} from './functions/createElement';

export class View {
    private slider: HTMLElement
    private sliderTouches: HTMLElement[]
    private elementSliderLine!: HTMLElement
    private elementSliderLineSpan!: HTMLElement 
    private elementsSliderTooltipText: HTMLElement[]
    private isCreatedSlider: boolean
    private coefficientPoint: number
    private shiftToMinValue: number
    private startXorY: number
    private maxXorY: number
    private currentXorY: number
    private currentValue: number | null
    private modelState!: IModelState
    private currentTouchIndex: number | null
    private configurator!: IConfigurator
    private currentOrientation: string | null
    private missingAmount: number | null
    private emitter: EventEmitter

    constructor(element: HTMLElement, eventEmitter: EventEmitter) {
        this.slider = element,
        this.sliderTouches = [],
        this.elementsSliderTooltipText =[],
        this.isCreatedSlider = false,
        this.coefficientPoint = 0,
        this.shiftToMinValue = 0,
        this.startXorY = 0,
        this.maxXorY = 0,
        this.currentXorY = 0,
        this.currentValue = 0,
        this.currentTouchIndex = null,
        this.currentOrientation = null,
        this.missingAmount = null,

        this.emitter = eventEmitter,

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
                    this.changeOrientation(); 
                    this.setValueSliderTouch();
                    this.setTooltipsValues();
                }
            }
            if(!this.isCreatedSlider) {
                this.createSlider();
                this.isCreatedSlider = true;
                this.setValueSliderTouch();

                this.listenSliderTouchesEvents();
                this.listenSliderLineEvents();
                this.listenSizeWindow()
            }
            if(this.sliderTouches.length != this.modelState.amount) {
                this.changeAmountTouchs();
            }
            if (this.modelState.tooltip === false) {
                this.hideTooltip();
            }
            if (this.modelState.tooltip === true) {
                this.showTooltip();
            }
            this.setNewValueSliderTouch();
            this.setTooltipsValues();
        })
    }