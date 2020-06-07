import { EventEmitter } from '../eventEmitter';
import {createElement} from '../functions/createElement';
import { IModelState } from '../interfaces/iModelState';
import { IThumbsState } from '../interfaces/IThumbsState';
import { IConfigurator } from '../interfaces/iConfigurator';

export class Thumbs {
    private slider: HTMLElement
    private emitter: EventEmitter
    public state: IThumbsState
    public configurator: IConfigurator | null

    constructor(element: HTMLElement, eventEmitter: EventEmitter) {
        this.slider = element,
        this.emitter = eventEmitter,
        this.configurator = null

        this.state = {
            thumbs: [],
            coefficientPoint: 0,
            shiftToMinValue: 0,
            currentThumbIndex: null,
            currentValue: 0,
            currentValueAxis: 0,
            startValueAxis: 0,
            maxValueAxis: 0
        };
    }
 /* функция CreateSlider добавляет бегунки в родительский элемент слайдера */
    createThumbs(amount: number): void {
        new Array(amount)
            .fill(1)
            .forEach(() => {
                const thumb: HTMLElement = createElement('div', 'slider-touch');
                
                this.slider.append(thumb);
                this.state.thumbs.push(thumb);
            })
    }
    /* изменяет количество отрисованных на шкале бегунков */
    changeAmountThumbs(modelState: IModelState, configurator: IConfigurator, scale: HTMLElement, activeRange: HTMLElement, setCurrentTooltipValue: (modelState: IModelState, i: number) => void): void {
        if (this.state.thumbs.length < modelState.amount) {
            const amount: number = modelState.amount - this.state.thumbs.length;

            this.createThumbs(amount);
            this.listenNewThumbsEvents(amount, modelState, configurator, scale, activeRange, setCurrentTooltipValue);
            this.setValueToNewThumb(amount, modelState);
            }
        if (this.state.thumbs.length > modelState.amount) {
            const excessAmount: number =  this.state.thumbs.length - modelState.amount;
            const allThumbs: HTMLElement[] = Array.from($(this.slider).find('.slider-touch'));

            new Array(excessAmount)
                .fill(1)
                .forEach((_element: number, i: number) => {
                    modelState.thumbsValues.splice(-1, 1);
                    this.state.thumbs.splice(-1, 1);
                    const newLength = allThumbs.length - i;
                    allThumbs[newLength - 1].remove();
                })
            this.emitter.emit('view:amountThumbs-changed', modelState.thumbsValues);
        }
    }
    listenThumbsEventsWhenChangingOrientation(modelState: IModelState, configurator: IConfigurator, scale: HTMLElement, activeRange: HTMLElement, setCurrentTooltipValue: (modelState: IModelState, i: number) => void): void {
        this.configurator = configurator;
        this.state.thumbs.forEach((element: HTMLElement, i: number) => {
            const start: (event: MouseEvent) => void = (event) => this.onStart(modelState, event, i, scale, activeRange, setCurrentTooltipValue);
            element.removeEventListener("mousedown", start);
            element.addEventListener("mousedown", start);
        });
    }
    /* навешивает обработчик событий 'mousedown' на каждый созданный бегунок */
    listenThumbsEvents(modelState: IModelState,configurator: IConfigurator, scale: HTMLElement, activeRange: HTMLElement, setCurrentTooltipValue: (modelState: IModelState, i: number) => void): void {
        this.configurator = configurator;
        this.state.thumbs.forEach((element: HTMLElement, i: number) => {
            const start: (event: MouseEvent) => void = (event) => this.onStart(modelState, event, i, scale, activeRange, setCurrentTooltipValue);
            element.addEventListener('mousedown', start);
        });
    }
    /* навешивает обработчик событий 'mousedown' на каждый добавленный бегунок */
    listenNewThumbsEvents(amount: number, modelState: IModelState, configurator: IConfigurator, scale: HTMLElement, activeRange: HTMLElement, setCurrentTooltipValue: (modelState: IModelState, i: number) => void): void {
        this.configurator = configurator;
        new Array(amount)
            .fill(1)
            .forEach((_element: number, i: number) => {
                const index = this.state.thumbs.length - (amount - i);
                const start: (event: MouseEvent) => void = (event) => this.onStart(modelState, event, index, scale, activeRange, setCurrentTooltipValue);
                this.state.thumbs[this.state.thumbs.length - (amount - i)].addEventListener('mousedown', start);
            })
    }
    /* слушает событие 'resize' на странице со слайдером */
    listenSizeWindow(scale: HTMLElement, activeRange: HTMLElement, modelState: IModelState, configurator: IConfigurator): void {
        const onResize = () => this.setNewValuesForThumbs(scale, activeRange, modelState, configurator);
        window.addEventListener('resize', onResize);
    }
    listenSizeWindowWhenChangingOrientation(modelState: IModelState, configurator: IConfigurator, scale: HTMLElement, activeRange: HTMLElement): void {
        this.configurator = configurator;
        const onResize = () => this.setNewValuesForThumbs(scale, activeRange, modelState, configurator);
        window.removeEventListener('resize', onResize);
        window.addEventListener('resize', onResize);
    }
    /* устанавливает значение для каждого добавленного бегунка */
    setValueToNewThumb(amount: number, modelState: IModelState): void {
        if (this.state.thumbs.length === modelState.thumbsValues.length) {
            return
        }
        new Array(amount)
            .fill(1)
            .forEach((_element: number, i: number) => {
                modelState.thumbsValues[this.state.thumbs.length - (amount - i)] = (modelState.thumbsValues[(this.state.thumbs.length - 1) - (amount - i)] + (modelState.step));
            })
        this.emitter.emit('view:amountThumbs-changed', modelState.thumbsValues); 
    }
    /* расставляет бегунки по слайдеру в зависимости от полученных по-умолчанию значений */
    setValuesThumbs(modelState: IModelState, activeRange: HTMLElement, scale: HTMLElement, configurator: IConfigurator): void {
        configurator.setInPlaceThumb(this.state.thumbs, modelState, activeRange, scale);
    }
    /* расставляет бегунки по слайдеру в зависимости от полученных новых значений */
    setNewValuesForThumbs(scale: HTMLElement, activeRange: HTMLElement, modelState: IModelState, configurator: IConfigurator): void {
        this.state.coefficientPoint = configurator.calculateCoefficientPoint(scale, modelState.max, modelState.min);

        this.state.shiftToMinValue = Math.ceil(this.state.coefficientPoint * modelState.min);
        configurator.setInPlaceNewThumb(this.state.thumbs, this.state.currentThumbIndex, this.state.coefficientPoint, modelState, this.state.shiftToMinValue, activeRange);
    }
    /* метод рассчитывает текущее значение бегунка */
    calculateValue(modelState: IModelState, currentValueAxis: number): number {
        let currentValue: number = Math.floor(currentValueAxis / this.state.coefficientPoint) + modelState.min;
        const multi: number = Math.floor(currentValue / modelState.step);
        return currentValue = modelState.step * multi;
    }
    /* метод рассчитывает значение места бегунка на шкале */
    calculateValueOfPlaceOnScale(modelState: IModelState, i: number): void {
        this.state.currentValue = this.calculateValue(modelState, this.state.currentValueAxis);
        const halfStep = Math.floor((this.state.currentValue + (modelState.step / 2)) * this.state.coefficientPoint) - this.state.shiftToMinValue;

        if (this.state.currentValueAxis > halfStep) {
            this.state.currentValue = this.state.currentValue + modelState.step;
        }
        if (modelState.thumbsValues[i] != this.state.currentValue) {
            this.emitter.emit('view:thumbsValues-changed', {currentValue: this.state.currentValue, index: i});
        }
    }
    /* рассчитывает потенциальное значение бегунка на месте клика на шкале */
    calculateValueOfPlaceClickOnScale(modelState: IModelState, currentValueAxis: number): number {
        const currentValue: number | null = this.calculateValue(modelState, currentValueAxis);
            if (this.state.currentValue !== null) {
                const halfStep = Math.floor((this.state.currentValue + (modelState.step / 2)) * this.state.coefficientPoint) - this.state.shiftToMinValue;
    
                if (this.state.currentValueAxis > halfStep) {
                    this.state.currentValue = this.state.currentValue + modelState.step;
                }
            }
        return currentValue;
    }
    /* метод для установки ближайшего ползунка на место клика по шкале слайдера */
    setThumbToNewPosition(event: MouseEvent, modelState: IModelState, configurator: IConfigurator): [number, number | null] {
        event.preventDefault();
        const target: HTMLDivElement = event.target as HTMLDivElement;
        let clickLocationAxis = 0;
        if (target != null && target.className === 'slider-line-span') {
            clickLocationAxis = configurator.calculateClickLocation(event, target);
        } else if (target != null && target.className === 'slider-line-span-for-verticalView') {
            clickLocationAxis = configurator.calculateClickLocation(event, target);
        } else {
            clickLocationAxis = configurator.getOffsetFromClick(event);
        }
        const currentValue: number | null | undefined = this.calculateValueOfPlaceClickOnScale(modelState, clickLocationAxis);
        let nearestThumbIndex: number | null = null;
        modelState.thumbsValues.forEach((element: number, i: number) => {
            if (currentValue !== null && currentValue !== undefined) {
                if (i === 0 && element >= currentValue) {
                    nearestThumbIndex = i;
                } else if (i === modelState.thumbsValues.length - 1 && element <= currentValue) {
                    nearestThumbIndex = i;
                } else if (currentValue >= element && currentValue <= modelState.thumbsValues[i + 1]) {
                    const leftSpacing: number = currentValue - element;
                    const rightSpacing: number = modelState.thumbsValues[i + 1] - currentValue;

                    if (leftSpacing > rightSpacing) {
                        nearestThumbIndex = i + 1;
                    } else {
                        nearestThumbIndex = i;
                    }
                }
            }
        });
        if (nearestThumbIndex != null && modelState.thumbsValues[nearestThumbIndex] != this.state.currentValue) {
            this.emitter.emit('view:thumbsValues-changed', {currentValue: currentValue, index: nearestThumbIndex});
        }
        return [currentValue, nearestThumbIndex];
    }
    onStart(modelState: IModelState, event: MouseEvent, i: number, scale: HTMLElement, activeRange: HTMLElement, setCurrentTooltipValue: (modelState: IModelState, i: number) => void): void {
        this.state.currentThumbIndex = i;
        event.preventDefault();

        const elements: HTMLElement[] = this.state.thumbs;
        const target: HTMLElement = elements[i];
        const eventThumb: MouseEvent = event;
        
        if (this.configurator !== null) {
            this.state.currentValueAxis = this.configurator.getCurrentValueAxisToOnStart(target);
            this.state.startValueAxis = this.configurator.getStartValueAxisToOnStart(eventThumb, this.state.currentValueAxis);
            this.state.maxValueAxis = this.configurator.getMaxValueAxisToOnStart(scale);
        }
        this.state.currentValue = modelState.thumbsValues[i];
        
        const handleMove = (event: MouseEvent) => this.onMove(modelState, event, i, target, activeRange, setCurrentTooltipValue);
        document.addEventListener('mousemove', handleMove);

        const handleStop = (event: MouseEvent) => this.onStop(handleMove, handleStop, event, i, target, modelState, setCurrentTooltipValue);
        document.addEventListener('mouseup', handleStop);
    }
    onMove(modelState: IModelState, event: MouseEvent, i: number, target: HTMLElement, activeRange: HTMLElement, setCurrentTooltipValue: (modelState: IModelState, i: number) => void): void {
        const elements: HTMLElement[] = this.state.thumbs;
        const eventThumb: MouseEvent = event;
        if( this.configurator !== null) {
            this.state.currentValueAxis = this.configurator.getCurrentValueAxisToOnMove(eventThumb, this.state.startValueAxis);
            if (i === 0) {
                if (elements.length === 1) {
                    if (this.state.currentValueAxis > this.state.maxValueAxis) {
                        this.state.currentValueAxis = this.state.maxValueAxis;
                    }
                }
                if (elements.length != 1) {
                    const offsetNextSlider: number = this.configurator.getElementOffset(elements[i + 1]) - this.configurator.getTargetWidth(target);
                    if (this.state.currentValueAxis > offsetNextSlider) {
                        this.state.currentValueAxis = offsetNextSlider;
                    }
                }
                if (this.state.currentValueAxis < modelState.min) {
                    this.state.currentValueAxis = modelState.min;
                }

                this.configurator.setIndentForTarget(target, this.state.currentValueAxis);
            }
            if (i > 0 && i < elements.length - 1) {
                const offsetNextThumb: number = this.configurator.getElementOffset(elements[i + 1]) - this.configurator.getTargetWidth(target);
                const offsetPreviousThumb: number = this.configurator.getElementOffset(elements[i - 1]) + this.configurator.getTargetWidth(target);
                const currentValueAxis: number = this.state.currentValueAxis;

                if(currentValueAxis > offsetNextThumb) {
                    this.state.currentValueAxis = offsetNextThumb;
                }
                if(currentValueAxis < offsetPreviousThumb) {
                    this.state.currentValueAxis = offsetPreviousThumb;
                }
                this.configurator.setIndentForTarget(target, this.state.currentValueAxis);
            }
            if (i === elements.length - 1 && i != 0) {
                const offsetPreviousThumb: number = this.configurator.getElementOffset(elements[i - 1]) + this.configurator.getTargetWidth(target);
                const currentValueAxis: number = this.state.currentValueAxis;
                if(currentValueAxis < offsetPreviousThumb) {
                    this.state.currentValueAxis = offsetPreviousThumb;
                } 
                if(currentValueAxis > this.state.maxValueAxis) {
                    this.state.currentValueAxis = this.state.maxValueAxis;
                }
                this.configurator.setIndentForTarget(target, this.state.currentValueAxis);
            }
            // update line span
            this.configurator.updateActiveRange(activeRange, elements);
        }
        this.calculateValueOfPlaceOnScale(modelState, i);
        setCurrentTooltipValue(modelState, i);
    }
    onStop(handleMove: (event: MouseEvent) => void, handleStop: (event: MouseEvent) => void, _event: MouseEvent, i: number, target: HTMLElement, modelState: IModelState, setCurrentTooltipValue: (modelState: IModelState, i: number) => void): void {
        setCurrentTooltipValue(modelState, i);
        if (this.state.currentValue !== null && this.configurator !== null) {
            this.configurator.setIndentForTargetToOnStop(target, this.state.coefficientPoint, this.state.currentValue, this.state.shiftToMinValue);
        }

        document.removeEventListener('mousemove', handleMove);
        document.removeEventListener('mouseup', handleStop);

        this.state.currentValue = null;
        this.state.currentThumbIndex = null;
      }
}