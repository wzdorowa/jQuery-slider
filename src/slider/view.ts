import {configuratorHorizontal} from './configuratorHorizontal';
import {configuratorVertical} from './configuratorVertical';
import { EventEmitter } from './eventEmitter';
import {IModelState} from './iModelState';
import {IConfigurator} from './iConfigurator'

export class View {
     slider: HTMLElement
     sliderTouches: HTMLElement[]
     elementSliderLine!: HTMLElement
     elementSliderLineSpan!: HTMLElement 
     elementsSliderTooltipText: HTMLElement[]
     isCreatedSlider: boolean
     coefficientPoint: number
     shiftToMinValue: number
     startXorY: number
     maxXorY: number
     currentXorY: number
     currentValue: number | null
     modelState!: IModelState
     currentTouchIndex: number | null
     configurator!: IConfigurator
     currentOrientation: string | null
     missingAmount: number | null
     emitter: EventEmitter


    constructor(element: HTMLElement, eventEmitter: EventEmitter) {
        console.log('view created', this, element),
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
     setWidthSliderContainer(): void {
        if(this.configurator !== null) {
            this.configurator.setWidthHeightSliderContainer(this.slider);
        } 
    }
    /* функция CreateElement создает необходимый элемент с заданным классом */
     createElement(teg: string, className: string): HTMLElement {
        const element: HTMLElement = document.createElement(teg);
        element.className = className;
        return element;
    }
    /* функция CreateSlider создает основную html-структуру слайдера */
     createSlider(): void {
            for(let i = 1; i <= this.modelState.amount; i++) {
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
            }
            const sliderLine: HTMLElement = this.configurator.createSliderLine(this.createElement);
            const sliderLineSpan: HTMLElement = this.createElement('div', 'slider-line-span');
            
            this.slider.append(sliderLine);
            sliderLine.append(sliderLineSpan);
    
            this.elementSliderLineSpan = sliderLineSpan;
            this.elementSliderLine = sliderLine;
    }
     changeAmountTouchs(): void {
            if (this.sliderTouches.length < this.modelState.amount) {
                let amount: number = this.modelState.amount - this.sliderTouches.length;
                if (this.missingAmount !== null) {
                    this.missingAmount = this.missingAmount + amount;
                }
                for (let i = 1; i <= amount; i++) {
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
                }
            }
            if (this.sliderTouches.length > this.modelState.amount) {
                const excessAmount: number =  this.sliderTouches.length - this.modelState.amount;
                let allTouches: HTMLElement[] = Array.from($(this.slider).find('.slider-touch'));
    
                for (let i = 1; i <= excessAmount; i++) {
                    this.modelState.touchsValues.splice(-1, 1);
                    this.sliderTouches.splice(-1, 1);
                    this.elementsSliderTooltipText.splice(-1, 1);
                    allTouches[allTouches.length - i].remove();
                }
                this.emitter.emit('view:amountTouches-changed', this.modelState.touchsValues);
            }
    }
     changeOrientation(): void {
            const sliderTooltip: HTMLElement[] = Array.from($(this.slider).find('.slider-tooltip'));
            this.elementsSliderTooltipText = [];
            const tooltipText: HTMLElement[] = this.configurator.searchElementsTooltipText(this.slider);
            for(let i = 0; i < tooltipText.length; i++) {
                tooltipText[i].remove();
            }
            for(let i = 0; i < sliderTooltip.length; i++) {
                const sliderTooltipText: HTMLElement = this.configurator.createSliderTooltipText(this.createElement);
                sliderTooltip[i].append(sliderTooltipText);
                this.elementsSliderTooltipText.push(sliderTooltipText);
            }
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
     setValueToNewTouch() {
        let allTouches: HTMLElement[] = Array.from($(this.slider).find('.slider-touch'));
        const indexNewTouch: number = allTouches.length - 1;

            this.modelState.touchsValues[indexNewTouch] = (this.modelState.touchsValues[indexNewTouch -1] + (this.modelState.step));
            this.emitter.emit('view:amountTouches-changed', this.modelState.touchsValues);
    }
     getCoefficientPoint(): number {
        return this.coefficientPoint = this.configurator.calculateCoefficientPoint(this.elementSliderLine, this.modelState.max, this.modelState.min);
    }
    /* функция setValuesSliderTouch устанавливает полученное по-умолчанию значение
     для каждой из кнопок-ползунков */
     setValueSliderTouch() {
        let elements: HTMLElement[] = this.sliderTouches;
        if(this.modelState && this.configurator !== null && this.getCoefficientPoint !== undefined) {
            this.configurator.calculateValueSliderTouch(elements, this.getCoefficientPoint, this.modelState, this.elementSliderLineSpan);
        }
    }
     setNewValueSliderTouch() {
        let elements: HTMLElement[] = this.sliderTouches;
        console.log('elements', elements);
        this.coefficientPoint = this.getCoefficientPoint();
        console.log('this.coefficientPoint', this.coefficientPoint);

        this.shiftToMinValue = Math.ceil(this.coefficientPoint * this.modelState.min);
        console.log('this.shiftToMinValue', this.shiftToMinValue);
        this.configurator.calculateNewValueSliderTouch(elements, this.currentTouchIndex, this.coefficientPoint, this.modelState, this.shiftToMinValue, this.elementSliderLineSpan);
    }
    /* функция setTooltipsValues устанавливает значения по-умолчанию ползунков
     в соответствующие им тултипы  */
     setTooltipsValues() {
        if(this.modelState && this.configurator !== null) {
            for(let i = 0; i < this.modelState.touchsValues.length; i++) {
                this.elementsSliderTooltipText[i].innerHTML = String(this.modelState.touchsValues[i]);
            }
        }
    }
     listenSliderTouchesEvents() {
        let elements: HTMLElement[] = this.sliderTouches;
            for(let i = 0; i < elements.length; i++) {
                elements[i].addEventListener('mousedown', event => this.onStart(this.modelState, event, i));
            }
    }
     newListenSliderTouchesEvents() {
        let elements: HTMLElement[] = this.sliderTouches;
        let i: number = elements.length - 1;
        elements[i].addEventListener('mousedown', event => this.onStart(this.modelState, event, i));
    }
     onStart(modelState: IModelState | null, event: MouseEvent, i: number) {
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
     onMove(modelState: IModelState | null, event: MouseEvent, i: number, target: HTMLElement) {
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
       onStop(handleMove: (event: MouseEvent) => void, handleStop: (event: MouseEvent) => void, event: MouseEvent, i: number, target: HTMLElement) {
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
    calculateValue(modelState: IModelState | null) {
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
     setCurrentTooltipValue(modelState: IModelState | null, i: number) {
        if (modelState !== null) {
            this.elementsSliderTooltipText[i].innerHTML = String(modelState.touchsValues[i]);
        }
    }
    /* метод hideTooltip скрывает туллтипы ползунков */
     hideTooltip() {
        const allTooltips: HTMLElement[] = Array.from($(this.slider).find('.slider-tooltip'));
        for(let i = 0; i < allTooltips.length; i++) {
            allTooltips[i].classList.add('slider-tooltip-hide');
        }
    }
    /* метод showTooltip показывает тултипы ползунков */
     showTooltip() {
        const allTooltips: HTMLElement[] = Array.from($(this.slider).find('.slider-tooltip'));
        for(let i = 0; i < allTooltips.length; i++) {
            allTooltips[i].classList.remove('slider-tooltip-hide');
        }
    }
}