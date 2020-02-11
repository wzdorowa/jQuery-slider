import {configuratorHorizontal} from './configuratorHorizontal';
import {configuratorVertical} from './configuratorVertical';
import { EventEmitter } from './eventEmitter';
import {IModelState} from './iModelState';
import {IConfigurator} from './iConfigurator'

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
        this.missingAmount = null

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
                this.setWidthSliderContainer();
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
        }),
        this.getCoefficientPoint = this.getCoefficientPoint.bind(this);
    }
    private setWidthSliderContainer(): void {
        if(this.configurator !== null) {
            this.configurator.setWidthHeightSliderContainer(this.slider);
        } 
    }
    /* функция CreateElement создает необходимый элемент с заданным классом */
    public createElement(teg: string, className: string): HTMLElement {
        const element: HTMLElement = document.createElement(teg);
        element.className = className;
        return element;
    }
    /* функция CreateSlider создает основную html-структуру слайдера */
    private createSlider(): void {
            new Array(this.modelState.amount)
                .fill(1)
                .forEach(() => {
                    const sliderTouch: HTMLElement = this.createElement('div', 'slider-touch');
                    const sliderSpan: HTMLElement = this.createElement('span', 'slider-span');
                    const sliderTooltip: HTMLElement = this.createElement('div', 'slider-tooltip');
                    const sliderTooltipText: HTMLElement = this.configurator.createSliderTooltipText(this.createElement);
    
                    sliderTouch.append(sliderSpan);
                    sliderTouch.append(sliderTooltip);
                    sliderTooltip.append(sliderTooltipText);
                    this.slider.append(sliderTouch);
                    this.sliderTouches.push(sliderTouch);
                    this.elementsSliderTooltipText.push(sliderTooltipText);
                })
            const sliderLine: HTMLElement = this.configurator.createSliderLine(this.createElement);
            const sliderLineSpan: HTMLElement = this.createElement('div', 'slider-line-span');
            
            this.slider.append(sliderLine);
            sliderLine.append(sliderLineSpan);
    
            this.elementSliderLineSpan = sliderLineSpan;
            this.elementSliderLine = sliderLine;
    }
    private changeAmountTouchs(): void {
            if (this.sliderTouches.length < this.modelState.amount) {
                let amount: number = this.modelState.amount - this.sliderTouches.length;
                if (this.missingAmount !== null) {
                    this.missingAmount = this.missingAmount + amount;
                }
                new Array(amount)
                    .fill(1)
                    .forEach(() => {
                        const sliderTouch: HTMLElement = this.createElement('div', 'slider-touch');
                        const sliderSpan: HTMLElement = this.createElement('span', 'slider-span');
                        const sliderTooltip: HTMLElement = this.createElement('div', 'slider-tooltip');
                        const sliderTooltipText: HTMLElement = this.configurator.createSliderTooltipText(this.createElement);
        
                        sliderTouch.append(sliderSpan);
                        sliderTouch.append(sliderTooltip);
                        sliderTooltip.append(sliderTooltipText);
                        this.slider.append(sliderTouch);
                        this.sliderTouches.push(sliderTouch);
                        this.elementsSliderTooltipText.push(sliderTooltipText);
        
                        this.newListenSliderTouchesEvents();
                        this.setValueToNewTouch();
                    })
            }
            if (this.sliderTouches.length > this.modelState.amount) {
                const excessAmount: number =  this.sliderTouches.length - this.modelState.amount;
                let allTouches: HTMLElement[] = Array.from($(this.slider).find('.slider-touch'));
    
                new Array(excessAmount)
                    .fill(1)
                    .forEach((_element: number, i: number) => {
                        this.modelState.touchsValues.splice(-1, 1);
                        this.sliderTouches.splice(-1, 1);
                        this.elementsSliderTooltipText.splice(-1, 1);
                        let newLength = allTouches.length - i;
                        allTouches[newLength - 1].remove();
                    })
                this.emitter.emit('view:amountTouches-changed', this.modelState.touchsValues);
            }
    }
    private changeOrientation(): void {
            const sliderTooltip: HTMLElement[] = Array.from($(this.slider).find('.slider-tooltip'));
            this.elementsSliderTooltipText = [];
            const tooltipText: HTMLElement[] = this.configurator.searchElementsTooltipText(this.slider);
            tooltipText.forEach((element: HTMLElement) => {
                element.remove();
            });
            sliderTooltip.forEach((element: HTMLElement) => {
                const sliderTooltipText: HTMLElement = this.configurator.createSliderTooltipText(this.createElement);
                element.append(sliderTooltipText);
                this.elementsSliderTooltipText.push(sliderTooltipText);
            });
            const sliderLineToDelete: JQuery<HTMLElement> = this.configurator.sliderLineToDelete(this.slider)
            sliderLineToDelete.remove();
    
            const sliderLine: HTMLElement = this.configurator.createSliderLine(this.createElement);
            const sliderLineSpan: HTMLElement = this.configurator.createSliderLineSpan(this.createElement);
    
            this.slider.append(sliderLine);
            sliderLine.append(sliderLineSpan);
    
            this.elementSliderLine = sliderLine;
            this.elementSliderLineSpan = sliderLineSpan;
    }
    /* устанавливает значение для добавленного ползунка */
    private setValueToNewTouch() {
        let allTouches: HTMLElement[] = Array.from($(this.slider).find('.slider-touch'));
        const indexNewTouch: number = allTouches.length - 1;

        this.modelState.touchsValues[indexNewTouch] = (this.modelState.touchsValues[indexNewTouch -1] + (this.modelState.step));
        this.emitter.emit('view:amountTouches-changed', this.modelState.touchsValues);
    }
    public getCoefficientPoint(): number {
        return this.coefficientPoint = this.configurator.calculateCoefficientPoint(this.elementSliderLine, this.modelState.max, this.modelState.min);
    }
    /* функция setValuesSliderTouch устанавливает полученное по-умолчанию значение
     для каждой из кнопок-ползунков */
    private setValueSliderTouch() {
        let elements: HTMLElement[] = this.sliderTouches;
        if(this.modelState && this.configurator !== null && this.getCoefficientPoint !== undefined) {
            this.configurator.calculateValueSliderTouch(elements, this.getCoefficientPoint, this.modelState, this.elementSliderLineSpan);
        }
    }
    private setNewValueSliderTouch() {
        let elements: HTMLElement[] = this.sliderTouches;
        this.coefficientPoint = this.getCoefficientPoint();

        this.shiftToMinValue = Math.ceil(this.coefficientPoint * this.modelState.min);
        this.configurator.calculateNewValueSliderTouch(elements, this.currentTouchIndex, this.coefficientPoint, this.modelState, this.shiftToMinValue, this.elementSliderLineSpan);
    }
    /* функция setTooltipsValues устанавливает значения по-умолчанию ползунков
     в соответствующие им тултипы  */
    private setTooltipsValues() {
        if(this.modelState && this.configurator !== null) {
            this.modelState.touchsValues.forEach((element: number, i: number) => {
                this.elementsSliderTooltipText[i].innerHTML = String(element);
            });
        }
    }
    private listenSliderTouchesEvents() {
        let elements: HTMLElement[] = this.sliderTouches;
        elements.forEach((element: HTMLElement, i: number) => {
            element.addEventListener('mousedown', event => this.onStart(this.modelState, event, i))
        });
    }
    private newListenSliderTouchesEvents() {
        let elements: HTMLElement[] = this.sliderTouches;
        let i: number = elements.length - 1;
        elements[i].addEventListener('mousedown', event => this.onStart(this.modelState, event, i));
    }
    private onStart(modelState: IModelState | null, event: MouseEvent, i: number) {
        this.currentTouchIndex = i;
        event.preventDefault();

        let elements: HTMLElement[] = this.sliderTouches;
        let target: HTMLElement = elements[i];
        let eventTouch: MouseEvent = event;
        
        if(modelState &&  this.configurator !== null) {
            this.currentXorY = this.configurator.setCurrentXorYtoOnStart(target);
            this.startXorY = this.configurator.setStartXorYtoOnStart(eventTouch, this.currentXorY);
            this.maxXorY = this.configurator.setMaxXorYtoOnStart(this.elementSliderLine);
            this.currentValue = modelState.touchsValues[i];
        }

        const handleMove = (event: MouseEvent) => this.onMove(this.modelState, event, i, target);
        document.addEventListener('mousemove', handleMove);

        const handleStop = (event: MouseEvent) => this.onStop(handleMove, handleStop, event, i, target);
        document.addEventListener('mouseup', handleStop);
    }
    private onMove(modelState: IModelState | null, event: MouseEvent, i: number, target: HTMLElement) {
        let elements: HTMLElement[] = this.sliderTouches;
        let eventTouch: MouseEvent = event;
    
        if(modelState &&  this.configurator !== null) {
            this.currentXorY = this.configurator.setCurrentXorYtoOnMove(eventTouch, this.startXorY);
            if (i === 0) {
                if (this.currentXorY > (this.configurator.elementOffset(elements[i + 1]) - this.configurator.targetOffset(target))) {
                    this.currentXorY = (this.configurator.elementOffset(elements[i + 1]) - this.configurator.targetOffset(target));
                }
                if (this.currentXorY < 0) {
                    this.currentXorY = 0;
                }
                this.configurator.setIndentForTarget(target, this.currentXorY);
            }
            if (i > 0 && i < elements.length - 1) {
                if(this.currentXorY > (this.configurator.elementOffset(elements[i + 1]) - this.configurator.targetOffset(target))) {
                    this.currentXorY = (this.configurator.elementOffset(elements[i + 1]) - this.configurator.targetOffset(target));
                } 
                if (this.currentXorY < (this.configurator.elementOffset(elements[i - 1]) + this.configurator.targetOffset(target))) {
                    this.currentXorY = (this.configurator.elementOffset(elements[i - 1]) + this.configurator.targetOffset(target));
                }
                this.configurator.setIndentForTarget(target, this.currentXorY);
            }
            if (i === elements.length - 1) {
                if (this.currentXorY < (this.configurator.elementOffset(elements[i - 1]) + this.configurator.targetOffset(target))) {
                    this.currentXorY = (this.configurator.elementOffset(elements[i - 1]) + this.configurator.targetOffset(target));
                } 
                if(this.currentXorY > this.maxXorY) {
                    this.currentXorY = this.maxXorY;
                }
                this.configurator.setIndentForTarget(target, this.currentXorY);
            }
            // update line span
            this.configurator.updateLineSpan(this.elementSliderLineSpan, elements);
        }
        if(this.modelState && modelState && this.coefficientPoint && this.shiftToMinValue !== null) {
            // write new value
            this.currentValue = this.calculateValue(this.modelState);
            
            if (this.currentValue !== null) {
                const halfStep = Math.floor((this.currentValue + (modelState.step / 2)) * this.coefficientPoint) - this.shiftToMinValue;
    
                if (this.currentXorY > halfStep) {
                    this.currentValue = this.currentValue + modelState.step;
                }
            }
            
            if (this.modelState.touchsValues[i] != this.currentValue) {
                this.emitter.emit('view:touchsValues-changed', {currentValue: this.currentValue, index: i});
            }
        }
        this.setCurrentTooltipValue(this.modelState, i);
      }
    private onStop(handleMove: (event: MouseEvent) => void, handleStop: (event: MouseEvent) => void, _event: MouseEvent, i: number, target: HTMLElement) {
        this.setCurrentTooltipValue(this.modelState, i);

        if (this.currentValue !== null) {
            this.configurator.setIndentForTargetToOnStop(target, this.coefficientPoint, this.currentValue, this.shiftToMinValue);
        }

        document.removeEventListener('mousemove', handleMove);
        document.removeEventListener('mouseup', handleStop);

        this.currentValue = null;
        this.currentTouchIndex = null;
      }
      /* метод calculateValue рассчитывает текущее значение ползунка. 
    нужно высчитать из this.currentXorY текущеее значение ползунка которое
    необходимо будет передать в state.state модели через eventEmitter.
    при изменении this.currentXorY вызвать calculateValue из которой вернуть
    текущее преобразованное значение ползунка в emitter.emit, а в модели в 
    subscribe вызвать обработчик, который это значение запишет в state.state
    */
   private calculateValue(modelState: IModelState | null) {
        let currentValueX: number | null = null;
        let multi: number;
        if (modelState && this.coefficientPoint !== null) {
            currentValueX = Math.floor(this.currentXorY / this.coefficientPoint) + modelState.min;
            multi = Math.floor(currentValueX / modelState.step);
            currentValueX = modelState.step * multi;
        }
        return currentValueX;

    }
    /* метод setCurrentTooltipValue устанавливает текущее значение в тултип ползунка */
    private setCurrentTooltipValue(modelState: IModelState | null, i: number) {
        if (modelState !== null) {
            this.elementsSliderTooltipText[i].innerHTML = String(modelState.touchsValues[i]);
        }
    }
    /* метод hideTooltip скрывает туллтипы ползунков */
    private hideTooltip() {
        const allTooltips: HTMLElement[] = Array.from($(this.slider).find('.slider-tooltip'));
        allTooltips.forEach((element: HTMLElement): void => {
            element.classList.add('slider-tooltip-hide');
        });
    }
    /* метод showTooltip показывает тултипы ползунков */
    private showTooltip() {
        const allTooltips: HTMLElement[] = Array.from($(this.slider).find('.slider-tooltip'));
        allTooltips.forEach((element: HTMLElement): void => {
            element.classList.remove('slider-tooltip-hide');
        });
    }
}