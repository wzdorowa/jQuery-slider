import { EventEmitter } from '../eventEmitter';
import { IConfigurator } from '../iConfigurator';
import {createElement} from '../functions/createElement';
import { IModelState } from '../iModelState';

export class Tooltips {
    private parentBlock: HTMLElement
    private emitter: EventEmitter
    private configurator!: IConfigurator
    private textInTooltips!: HTMLElement[]
    private modelState!: IModelState
    private missingAmount: number | null

    constructor(element: HTMLElement, eventEmitter: EventEmitter, configurator: IConfigurator, modelState: IModelState) {
        this.parentBlock = element,
        this.emitter = eventEmitter,
        this.configurator = configurator,
        this.textInTooltips = [],
        this.modelState = modelState,
        this.missingAmount = null

    }
    /* функция createToolpips добавляет элементы тултипов в основную html-структуру слайдера */
    createTooltips(amount: number, sliders: HTMLElement[]): void {
        new Array(amount)
            .fill(1)
            .forEach((i: number) => {
                const tooltip: HTMLElement = createElement('div', 'slider-tooltip');
                const textInTooltips: HTMLElement = this.configurator.createSliderTooltipText();

                sliders[i].append(tooltip);
                tooltip.append(textInTooltips);

                this.textInTooltips.push(textInTooltips);
        })
    }
    /* устанавливает значения ползунков по-умолчанию в соответствующие им тултипы  */
    setTooltipsValues(modelState: IModelState) {
        if(modelState && this.configurator !== null) {
            modelState.touchsValues.forEach((element: number, i: number) => {
                this.textInTooltips[i].innerHTML = String(element);
            });
        }
    }
    /* изменяет количество отрисованных тултипов */
    changeAmountTooltips(modelState: IModelState): void {
        const sliders: HTMLElement[] = Array.from($(this.parentBlock).find('.slider-touch'));

        if (sliders.length < modelState.amount) {
            let amount: number = modelState.amount - sliders.length;
            this.createTooltips(amount, sliders);
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
    changeOrientation(): void {
        const tooltips: HTMLElement[] = Array.from($(this.parentBlock).find('.slider-tooltip'));
        this.textInTooltips = [];
        const textInTooltips: HTMLElement[] = this.configurator.searchElementsTooltipText(this.parentBlock);
        textInTooltips.forEach((element: HTMLElement) => {
            element.remove();
        });
        tooltips.forEach((element: HTMLElement) => {
            const tooltipText: HTMLElement = this.configurator.createSliderTooltipText();
            element.append(tooltipText);
            this.textInTooltips.push(tooltipText);
        });
    }
    /* метод устанавливает текущее значение в тултип ползунка */
    setCurrentTooltipValue(modelState: IModelState | null, i: number) {
        if (modelState !== null) {
            this.textInTooltips[i].innerHTML = String(modelState.touchsValues[i]);
        }
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