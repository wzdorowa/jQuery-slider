import { EventEmitter } from '../eventEmitter';
import {createElement} from '../functions/createElement';
import { IModelState } from '../iModelState';
import { IConfigurator } from '../iConfigurator';

export class Tooltips {
    private parentBlock: HTMLElement
    private emitter: EventEmitter
    private textInTooltips!: HTMLElement[]

    constructor(element: HTMLElement, eventEmitter: EventEmitter) {
        this.parentBlock = element,
        this.emitter = eventEmitter,
        this.textInTooltips = []
    }
    /* функция createToolpips добавляет элементы тултипов в основную html-структуру слайдера */
    createTooltips(amount: number, sliders: HTMLElement[], configurator: IConfigurator): void {
        new Array(amount)
            .fill(1)
            .forEach((_element: number, i: number) => {
                const tooltip: HTMLElement = createElement('div', 'slider-tooltip');
                const textInTooltips: HTMLElement = configurator.createSliderTooltipText();

                tooltip.append(textInTooltips);
                sliders[i].append(tooltip);
                
                this.textInTooltips.push(textInTooltips);
        })
    }
    /* устанавливает значения ползунков по-умолчанию в соответствующие им тултипы  */
    setTooltipsValues(modelState: IModelState) {
        modelState.touchsValues.forEach((element: number, i: number) => {
            this.textInTooltips[i].innerHTML = String(element);
        });
    }
    /* изменяет количество отрисованных тултипов */
    changeAmountTooltips(modelState: IModelState, sliders: HTMLElement[], configurator: IConfigurator): void {
        if (sliders.length < modelState.amount) {
            let amount: number = modelState.amount - sliders.length;
            this.createTooltips(amount, sliders, configurator);
        }
        if (sliders.length > modelState.amount) {
            const excessAmount: number =  sliders.length - modelState.amount;

            new Array(excessAmount)
                .fill(1)
                .forEach(() => {
                    this.textInTooltips.splice(-1, 1);
                })
            this.emitter.emit('view:amountTouches-changed', modelState.touchsValues);
        }
    }
    /* перерисовывает  */
    changeOrientation(configurator: IConfigurator): void {
        const tooltips: HTMLElement[] = Array.from($(this.parentBlock).find('.slider-tooltip'));
        this.textInTooltips = [];
        const textInTooltips: HTMLElement[] = configurator.searchElementsTooltipText(this.parentBlock);
        textInTooltips.forEach((element: HTMLElement) => {
            element.remove();
        });
        tooltips.forEach((element: HTMLElement) => {
            const tooltipText: HTMLElement = configurator.createSliderTooltipText();
            element.append(tooltipText);
            this.textInTooltips.push(tooltipText);
        });
    }
    /* метод устанавливает текущее значение в тултип ползунка */
    setCurrentTooltipValue(modelState: IModelState, i: number) {
        this.textInTooltips[i].innerHTML = String(modelState.touchsValues[i]);
    }
    /* метод hideTooltip скрывает туллтипы ползунков */
    hideTooltip() {
        const allTooltips: HTMLElement[] = Array.from($(this.parentBlock).find('.slider-tooltip'));
        allTooltips.forEach((element: HTMLElement): void => {
            element.classList.add('slider-tooltip-hide');
        });
    }
    /* метод showTooltip показывает тултипы ползунков */
    showTooltip() {
        const allTooltips: HTMLElement[] = Array.from($(this.parentBlock).find('.slider-tooltip'));
        allTooltips.forEach((element: HTMLElement): void => {
            element.classList.remove('slider-tooltip-hide');
        });
    }
}