import { EventEmitter } from '../eventEmitter';
import { IConfigurator } from '../iConfigurator';
import {createElement} from '../functions/createElement';
import { IModelState } from '../iModelState';

export class Sliders {
    private parentBlock: HTMLElement
    private emitter: EventEmitter
    private configurator!: IConfigurator
    private modelState!: IModelState
    private sliders: HTMLElement[]
    private coefficientPoint: number
    private shiftToMinValue: number
    private currentSliderIndex: number | null
    private currentValue: number | null
    private currentXorY: number
    private startXorY: number
    private maxXorY: number

    constructor(element: HTMLElement, eventEmitter: EventEmitter, configurator: IConfigurator, modelState: IModelState) {
        this.parentBlock = element,
        this.emitter = eventEmitter,
        this.configurator = configurator,
        this.modelState = modelState,
        this.sliders = [],
        this.coefficientPoint = 0,
        this.shiftToMinValue = 0,
        this.currentSliderIndex = null,
        this.currentValue = 0,
        this.currentXorY = 0,
        this.startXorY = 0,
        this.maxXorY = 0

    }
 /* функция CreateSlider добавляет бегунки в родительский элемент слайдера */
    createSliders(amount: number): void {
        new Array(amount)
            .fill(1)
            .forEach(() => {
                const slider: HTMLElement = createElement('div', 'slider-touch');
                const sliderSpan: HTMLElement = createElement('span', 'slider-span');
                
                slider.append(sliderSpan);
                
                this.parentBlock.append(slider);
                this.sliders.push(slider);
            })
    }
    /* изменяет количество отрисованных на шкале бегунков */
    changeAmountSliders(modelState: IModelState): void {

        if (this.sliders.length < modelState.amount) {
            let amount: number = modelState.amount - this.sliders.length;

            this.createSliders(amount);
            this.newListenSlidersEvents(amount, this.sliders);
            this.setValueToNewSlider(amount, this.sliders, modelState);
            }
        if (this.sliders.length > modelState.amount) {
            const excessAmount: number =  this.sliders.length - modelState.amount;
            let allSliders: HTMLElement[] = Array.from($(this.parentBlock).find('.slider-touch'));

            new Array(excessAmount)
                .fill(1)
                .forEach((_element: number, i: number) => {
                    this.modelState.touchsValues.splice(-1, 1);
                    this.sliders.splice(-1, 1);
                    let newLength = allSliders.length - i;
                    allSliders[newLength - 1].remove();
                })
            this.emitter.emit('view:amountTouches-changed', modelState.touchsValues);
        }
    }
    /* навешивает обработчик событий 'mousedown' на каждый добавленный бегунок */
    newListenSlidersEvents(amount: number, sliders: HTMLElement[]) {
        new Array(amount)
            .fill(1)
            .forEach((_element: number, i: number) => {
                sliders[sliders.length - (amount - i)].addEventListener('mousedown', event => this.onStart(this.modelState, event, i));
            })
    }
    /* устанавливает значение для каждого добавленного бегунка */
    setValueToNewSlider(amount: number, sliders: HTMLElement[], modelState: IModelState) {
        new Array(amount)
            .fill(1)
            .forEach((_element: number, i: number) => {
                modelState.touchsValues[sliders.length - (amount - i)] = (modelState.touchsValues[(sliders.length - 1) - (amount - i)] + (modelState.step));
                this.emitter.emit('view:amountTouches-changed', modelState.touchsValues);  
            })
    }
    /* расставляет бегунки по слайдеру в зависимости от полученных по-умолчанию значений */
    setValuesSliders(modelState: IModelState, activeRange: HTMLElement, scale: HTMLElement) {
        if(modelState && this.configurator !== null) {
            this.configurator.calculateValueSliderTouch(this.sliders, modelState, activeRange, scale);
        }
    }
    /* расставляет бегунки по слайдеру в зависимости от полученных новых значений */
    setNewValuesForSliders(scale: HTMLElement, activeRange: HTMLElement, modelState: IModelState) {
        this.coefficientPoint = this.configurator.calculateCoefficientPoint(scale, modelState.max, modelState.min);

        this.shiftToMinValue = Math.ceil(this.coefficientPoint * this.modelState.min);
        this.configurator.calculateNewValueSliderTouch(this.sliders, this.currentSliderIndex, this.coefficientPoint, modelState, this.shiftToMinValue, activeRange);
    }
    /* метод рассчитывает текущее значение ползунка */
    calculateValue(modelState: IModelState | null, currentXorY: number) {
        let currentValueX: number | null = null;
        let multi: number;
        if (modelState && this.coefficientPoint !== null) {
            currentValueX = Math.floor(currentXorY / this.coefficientPoint) + modelState.min;
            multi = Math.floor(currentValueX / modelState.step);
            currentValueX = modelState.step * multi;
        }
        return currentValueX;
    }
    /* метод рассчитывает значение места бегунка на шкале */
    calculateValueOfPlaceOnScale(modelState: IModelState | null, i: number) {
        if(modelState && this.coefficientPoint && this.shiftToMinValue !== null) {
            this.currentValue = this.calculateValue(this.modelState, this.currentXorY);
                
                if (this.currentValue !== null) {
                    const halfStep = Math.floor((this.currentValue + (modelState.step / 2)) * this.coefficientPoint) - this.shiftToMinValue;
        
                    if (this.currentXorY > halfStep) {
                        this.currentValue = this.currentValue + modelState.step;
                    }
                }
                if (modelState.touchsValues[i] != this.currentValue) {
                    this.emitter.emit('view:touchsValues-changed', {currentValue: this.currentValue, index: i});
                }
        };
    }
    /* рассчитывает значение места клика на шкале */
    //@ts-ignore
    calculateValueOfPlaceClickOnScale(modelState: IModelState | null, currentXorY: number) {
        if(modelState && this.coefficientPoint && this.shiftToMinValue !== null) {
            let currentValue: number | null = this.calculateValue(this.modelState, currentXorY);
                
                if (this.currentValue !== null) {
                    const halfStep = Math.floor((this.currentValue + (modelState.step / 2)) * this.coefficientPoint) - this.shiftToMinValue;
        
                    if (this.currentXorY > halfStep) {
                        this.currentValue = this.currentValue + modelState.step;
                    }
                }
            return currentValue;
        };
    }
    /* метод для установки ближайшего ползунка на место клика по шкале слайдера */
    setSliderTouchToNewPosition(event: MouseEvent) {
        event.preventDefault();
        let target = event.target;
        let currentClickLocation: number = 0;
        //@ts-ignore
        if (target != null && target.className === 'slider-line-span' || target != null && target.className === 'slider-line-span-for-verticalView') {
            //@ts-ignore
            currentClickLocation = this.configurator.calculateCurrentClickLocation(event, target);
        } else {
            currentClickLocation = this.configurator.getOffsetFromClick(event);
        }
        let currentValue: number | null | undefined = this.calculateValueOfPlaceClickOnScale(this.modelState, currentClickLocation);

        //@ts-ignore
        let nearestRunnerIndex = null;
        this.modelState.touchsValues.forEach((element: number, i: number) => {
            if (currentValue !== null && currentValue !== undefined) {
                if (i === 0 && element >= currentValue) {
                    nearestRunnerIndex = i;
                } else if (i === this.modelState.touchsValues.length - 1 && element <= currentValue) {
                    nearestRunnerIndex = i;
                } else if (currentValue >= element && currentValue <= this.modelState.touchsValues[i + 1]) {
                    let leftSpacing: number = currentValue - element;
                    let rightSpacing: number = this.modelState.touchsValues[i + 1] - currentValue;

                    if (leftSpacing > rightSpacing) {
                        nearestRunnerIndex = i + 1;
                    } else {
                        nearestRunnerIndex = i;
                    }
                }
            }
        });
        if (nearestRunnerIndex != null && this.modelState.touchsValues[nearestRunnerIndex] != this.currentValue) {
            this.emitter.emit('view:touchsValues-changed', {currentValue: currentValue, index: nearestRunnerIndex});
        }
    }
    onStart(modelState: IModelState | null, event: MouseEvent, i: number, scale: HTMLElement, activeRange: HTMLElement) {
        this.currentSliderIndex = i;
        event.preventDefault();

        let elements: HTMLElement[] = this.sliders;
        let target: HTMLElement = elements[i];
        let eventTouch: MouseEvent = event;
        
        if(modelState &&  this.configurator !== null) {
            this.currentXorY = this.configurator.setCurrentXorYtoOnStart(target);
            this.startXorY = this.configurator.setStartXorYtoOnStart(eventTouch, this.currentXorY);
            this.maxXorY = this.configurator.setMaxXorYtoOnStart(scale);
            this.currentValue = modelState.touchsValues[i];
        }

        const handleMove = (event: MouseEvent) => this.onMove(this.modelState, event, i, target, activeRange);
        document.addEventListener('mousemove', handleMove);

        const handleStop = (event: MouseEvent) => this.onStop(handleMove, handleStop, event, i, target);
        document.addEventListener('mouseup', handleStop);
    }
    private onMove(modelState: IModelState | null, event: MouseEvent, i: number, target: HTMLElement, activeRange: HTMLElement) {
        let elements: HTMLElement[] = this.sliders;
        let eventTouch: MouseEvent = event;
    
        if(modelState &&  this.configurator !== null) {
            this.currentXorY = this.configurator.setCurrentXorYtoOnMove(eventTouch, this.startXorY);
            if (i === 0) {
                if (elements.length === 1) {
                    if (this.currentXorY > this.maxXorY) {
                        this.currentXorY = this.maxXorY;
                    }
                }
                if (elements.length != 1) {
                    if (this.currentXorY > (this.configurator.elementOffset(elements[i + 1]) - this.configurator.targetOffset(target))) {
                        this.currentXorY = (this.configurator.elementOffset(elements[i + 1]) - this.configurator.targetOffset(target));
                    }
                }
                if (this.currentXorY < modelState.min) {
                    this.currentXorY = modelState.min;
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
            if (i === elements.length - 1 && i != 0) {
                if (this.currentXorY < (this.configurator.elementOffset(elements[i - 1]) + this.configurator.targetOffset(target))) {
                    this.currentXorY = (this.configurator.elementOffset(elements[i - 1]) + this.configurator.targetOffset(target));
                } 
                if(this.currentXorY > this.maxXorY) {
                    this.currentXorY = this.maxXorY;
                }
                this.configurator.setIndentForTarget(target, this.currentXorY);
            }
            // update line span
            this.configurator.updateLineSpan(activeRange, elements);
        }
        this.calculateValueOfPlaceOnScale(modelState, i);
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
        this.currentSliderIndex = null;
      }
}