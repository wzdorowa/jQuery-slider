import { EventEmitter } from '../eventEmitter';
import {createElement} from '../functions/createElement';
import { IModelState } from '../iModelState';
import { ISlidersState } from './ISlidersState';
import { IConfigurator } from '../iConfigurator';

export class Sliders {
    private parentBlock: HTMLElement
    private emitter: EventEmitter
    public state: ISlidersState
    public configurator: IConfigurator | null

    constructor(element: HTMLElement, eventEmitter: EventEmitter) {
        this.parentBlock = element,
        this.emitter = eventEmitter,
        this.configurator = null

        this.state = {
            sliders: [],
            coefficientPoint: 0,
            shiftToMinValue: 0,
            currentSliderIndex: null,
            currentValue: 0,
            currentXorY: 0,
            startXorY: 0,
            maxXorY: 0
        };
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
                this.state.sliders.push(slider);
            })
    }
    /* изменяет количество отрисованных на шкале бегунков */
    changeAmountSliders(modelState: IModelState, configurator: IConfigurator, scale: HTMLElement, activeRange: HTMLElement, setCurrentTooltipValue: (modelState: IModelState, i: number) => void): void {
        if (this.state.sliders.length < modelState.amount) {
            let amount: number = modelState.amount - this.state.sliders.length;

            this.createSliders(amount);
            this.newListenSlidersEvents(amount, modelState, configurator, scale, activeRange, setCurrentTooltipValue);
            this.setValueToNewSlider(amount, modelState);
            }
        if (this.state.sliders.length > modelState.amount) {
            const excessAmount: number =  this.state.sliders.length - modelState.amount;
            let allSliders: HTMLElement[] = Array.from($(this.parentBlock).find('.slider-touch'));

            new Array(excessAmount)
                .fill(1)
                .forEach((_element: number, i: number) => {
                    modelState.touchsValues.splice(-1, 1);
                    this.state.sliders.splice(-1, 1);
                    let newLength = allSliders.length - i;
                    allSliders[newLength - 1].remove();
                })
            this.emitter.emit('view:amountTouches-changed', modelState.touchsValues);
        }
    }
    listenSlidersEventsForNewOtientation(modelState: IModelState, configurator: IConfigurator, scale: HTMLElement, activeRange: HTMLElement, setCurrentTooltipValue: (modelState: IModelState, i: number) => void) {
        this.configurator = configurator;
        this.state.sliders.forEach((element: HTMLElement, i: number) => {
            element.removeEventListener('mousedown', event => this.onStart(modelState, event, i, scale, activeRange, setCurrentTooltipValue));
        });
        this.state.sliders.forEach((element: HTMLElement, i: number) => {
            element.addEventListener('mousedown', event => this.onStart(modelState, event, i, scale, activeRange, setCurrentTooltipValue));
        });
    }
    /* навешивает обработчик событий 'mousedown' на каждый созданный бегунок */
    listenSlidersEvents(modelState: IModelState,configurator: IConfigurator, scale: HTMLElement, activeRange: HTMLElement, setCurrentTooltipValue: (modelState: IModelState, i: number) => void) {
        this.configurator = configurator;
        this.state.sliders.forEach((element: HTMLElement, i: number) => {
            element.addEventListener('mousedown', event => this.onStart(modelState, event, i, scale, activeRange, setCurrentTooltipValue));
        });
    }
    /* навешивает обработчик событий 'mousedown' на каждый добавленный бегунок */
    newListenSlidersEvents(amount: number, modelState: IModelState, configurator: IConfigurator, scale: HTMLElement, activeRange: HTMLElement, setCurrentTooltipValue: (modelState: IModelState, i: number) => void) {
        this.configurator = configurator;
        new Array(amount)
            .fill(1)
            .forEach((_element: number, i: number) => {
                let index = this.state.sliders.length - (amount - i);
                this.state.sliders[this.state.sliders.length - (amount - i)].addEventListener('mousedown', event => this.onStart(modelState, event, index, scale, activeRange, setCurrentTooltipValue));
            })
    }
    /* устанавливает значение для каждого добавленного бегунка */
    setValueToNewSlider(amount: number, modelState: IModelState) {
        if (this.state.sliders.length === modelState.touchsValues.length) {
            return
        }
        new Array(amount)
            .fill(1)
            .forEach((_element: number, i: number) => {
                modelState.touchsValues[this.state.sliders.length - (amount - i)] = (modelState.touchsValues[(this.state.sliders.length - 1) - (amount - i)] + (modelState.step));
            })
        this.emitter.emit('view:amountTouches-changed', modelState.touchsValues); 
    }
    /* расставляет бегунки по слайдеру в зависимости от полученных по-умолчанию значений */
    setValuesSliders(modelState: IModelState, activeRange: HTMLElement, scale: HTMLElement, configurator: IConfigurator) {
        configurator.calculateValueSliderTouch(this.state.sliders, modelState, activeRange, scale);
    }
    /* расставляет бегунки по слайдеру в зависимости от полученных новых значений */
    setNewValuesForSliders(scale: HTMLElement, activeRange: HTMLElement, modelState: IModelState, configurator: IConfigurator) {
        this.state.coefficientPoint = configurator.calculateCoefficientPoint(scale, modelState.max, modelState.min);

        this.state.shiftToMinValue = Math.ceil(this.state.coefficientPoint * modelState.min);
        configurator.calculateNewValueSliderTouch(this.state.sliders, this.state.currentSliderIndex, this.state.coefficientPoint, modelState, this.state.shiftToMinValue, activeRange);
    }
    /* метод рассчитывает текущее значение ползунка */
    calculateValue(modelState: IModelState, currentXorY: number) {
        let currentValueX: number = Math.floor(currentXorY / this.state.coefficientPoint) + modelState.min;
        let multi: number = Math.floor(currentValueX / modelState.step);
        return currentValueX = modelState.step * multi;
    }
    /* метод рассчитывает значение места бегунка на шкале */
    calculateValueOfPlaceOnScale(modelState: IModelState, i: number) {
        this.state.currentValue = this.calculateValue(modelState, this.state.currentXorY);
        const halfStep = Math.floor((this.state.currentValue + (modelState.step / 2)) * this.state.coefficientPoint) - this.state.shiftToMinValue;

        if (this.state.currentXorY > halfStep) {
            this.state.currentValue = this.state.currentValue + modelState.step;
        }
        if (modelState.touchsValues[i] != this.state.currentValue) {
            this.emitter.emit('view:touchsValues-changed', {currentValue: this.state.currentValue, index: i});
        }
    }
    /* рассчитывает значение места клика на шкале */
    //@ts-ignore
    calculateValueOfPlaceClickOnScale(modelState: IModelState, currentXorY: number): number {
        let currentValue: number | null = this.calculateValue(modelState, currentXorY);
            if (this.state.currentValue !== null) {
                const halfStep = Math.floor((this.state.currentValue + (modelState.step / 2)) * this.state.coefficientPoint) - this.state.shiftToMinValue;
    
                if (this.state.currentXorY > halfStep) {
                    this.state.currentValue = this.state.currentValue + modelState.step;
                }
            }
        return currentValue;
    }
    /* метод для установки ближайшего ползунка на место клика по шкале слайдера */
    setSliderTouchToNewPosition(event: MouseEvent, modelState: IModelState, configurator: IConfigurator) {
        event.preventDefault();
        let target = event.target;
        let currentClickLocation: number = 0;
        //@ts-ignore
        if (target != null && target.className === 'slider-line-span' || target != null && target.className === 'slider-line-span-for-verticalView') {
            //@ts-ignore
            currentClickLocation = configurator.calculateCurrentClickLocation(event, target);
        } else {
            currentClickLocation = configurator.getOffsetFromClick(event);
        }
        let currentValue: number | null | undefined = this.calculateValueOfPlaceClickOnScale(modelState, currentClickLocation);
        //@ts-ignore
        let nearestRunnerIndex: number | null = null;
        modelState.touchsValues.forEach((element: number, i: number) => {
            if (currentValue !== null && currentValue !== undefined) {
                if (i === 0 && element >= currentValue) {
                    nearestRunnerIndex = i;
                } else if (i === modelState.touchsValues.length - 1 && element <= currentValue) {
                    nearestRunnerIndex = i;
                } else if (currentValue >= element && currentValue <= modelState.touchsValues[i + 1]) {
                    let leftSpacing: number = currentValue - element;
                    let rightSpacing: number = modelState.touchsValues[i + 1] - currentValue;

                    if (leftSpacing > rightSpacing) {
                        nearestRunnerIndex = i + 1;
                    } else {
                        nearestRunnerIndex = i;
                    }
                }
            }
        });
        if (nearestRunnerIndex != null && modelState.touchsValues[nearestRunnerIndex] != this.state.currentValue) {
            this.emitter.emit('view:touchsValues-changed', {currentValue: currentValue, index: nearestRunnerIndex});
        };
        return [currentValue, nearestRunnerIndex];
    }
    onStart(modelState: IModelState, event: MouseEvent, i: number, scale: HTMLElement, activeRange: HTMLElement, setCurrentTooltipValue: (modelState: IModelState, i: number) => void) {
        this.state.currentSliderIndex = i;
        event.preventDefault();

        let elements: HTMLElement[] = this.state.sliders;
        let target: HTMLElement = elements[i];
        let eventTouch: MouseEvent = event;
        
        if (this.configurator !== null) {
            this.state.currentXorY = this.configurator.setCurrentXorYtoOnStart(target);
            this.state.startXorY = this.configurator.setStartXorYtoOnStart(eventTouch, this.state.currentXorY);
            this.state.maxXorY = this.configurator.setMaxXorYtoOnStart(scale);
        }
        this.state.currentValue = modelState.touchsValues[i];
        
        const handleMove = (event: MouseEvent) => this.onMove(modelState, event, i, target, activeRange, setCurrentTooltipValue);
        document.addEventListener('mousemove', handleMove);

        const handleStop = (event: MouseEvent) => this.onStop(handleMove, handleStop, event, i, target, modelState, setCurrentTooltipValue);
        document.addEventListener('mouseup', handleStop);
    }
    onMove(modelState: IModelState, event: MouseEvent, i: number, target: HTMLElement, activeRange: HTMLElement, setCurrentTooltipValue: (modelState: IModelState, i: number) => void) {
        let elements: HTMLElement[] = this.state.sliders;
        let eventTouch: MouseEvent = event;
        if( this.configurator !== null) {
            this.state.currentXorY = this.configurator.setCurrentXorYtoOnMove(eventTouch, this.state.startXorY);
            if (i === 0) {
                if (elements.length === 1) {
                    if (this.state.currentXorY > this.state.maxXorY) {
                        this.state.currentXorY = this.state.maxXorY;
                    }
                }
                if (elements.length != 1) {
                    if (this.state.currentXorY > (this.configurator.elementOffset(elements[i + 1]) - this.configurator.targetOffset(target))) {
                        this.state.currentXorY = (this.configurator.elementOffset(elements[i + 1]) - this.configurator.targetOffset(target));
                    }
                }
                if (this.state.currentXorY < modelState.min) {
                    this.state.currentXorY = modelState.min;
                }

                this.configurator.setIndentForTarget(target, this.state.currentXorY);
            }
            if (i > 0 && i < elements.length - 1) {
                if(this.state.currentXorY > (this.configurator.elementOffset(elements[i + 1]) - this.configurator.targetOffset(target))) {
                    this.state.currentXorY = (this.configurator.elementOffset(elements[i + 1]) - this.configurator.targetOffset(target));
                } 
                if (this.state.currentXorY < (this.configurator.elementOffset(elements[i - 1]) + this.configurator.targetOffset(target))) {
                    this.state.currentXorY = (this.configurator.elementOffset(elements[i - 1]) + this.configurator.targetOffset(target));
                }
                this.configurator.setIndentForTarget(target, this.state.currentXorY);
            }
            if (i === elements.length - 1 && i != 0) {
                if (this.state.currentXorY < (this.configurator.elementOffset(elements[i - 1]) + this.configurator.targetOffset(target))) {
                    this.state.currentXorY = (this.configurator.elementOffset(elements[i - 1]) + this.configurator.targetOffset(target));
                } 
                if(this.state.currentXorY > this.state.maxXorY) {
                    this.state.currentXorY = this.state.maxXorY;
                }
                this.configurator.setIndentForTarget(target, this.state.currentXorY);
            }
            // update line span
            this.configurator.updateLineSpan(activeRange, elements);
        }
        this.calculateValueOfPlaceOnScale(modelState, i);
        setCurrentTooltipValue(modelState, i);
    }
    onStop(handleMove: (event: MouseEvent) => void, handleStop: (event: MouseEvent) => void, _event: MouseEvent, i: number, target: HTMLElement, modelState: IModelState, setCurrentTooltipValue: (modelState: IModelState, i: number) => void) {
        setCurrentTooltipValue(modelState, i);
        if (this.state.currentValue !== null && this.configurator !== null) {
            this.configurator.setIndentForTargetToOnStop(target, this.state.coefficientPoint, this.state.currentValue, this.state.shiftToMinValue);
        }

        document.removeEventListener('mousemove', handleMove);
        document.removeEventListener('mouseup', handleStop);

        this.state.currentValue = null;
        this.state.currentSliderIndex = null;
      }
}