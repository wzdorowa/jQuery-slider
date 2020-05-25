import {createElement} from '../functions/createElement';
import { IModelState } from '../interfaces/iModelState';
import { IConfigurator } from '../interfaces/iConfigurator';

export class Tooltips {
    private parentBlock: HTMLElement
    public tooltipsElements: HTMLElement[]
    public textInTooltips!: HTMLElement[]

    constructor(element: HTMLElement) {
        this.parentBlock = element,
        this.tooltipsElements = [],
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
                sliders[sliders.length - (amount - i)].append(tooltip);
                this.tooltipsElements.push(tooltip);
                this.textInTooltips.push(textInTooltips);
            })
    }
    /* устанавливает значения ползунков по-умолчанию в соответствующие им тултипы  */
    setTooltipsValues(modelState: IModelState): void {
        modelState.touchsValues.forEach((element: number, i: number) => {
            this.textInTooltips[i].innerHTML = String(element);
        });
    }
    /* изменяет количество отрисованных тултипов */
    changeAmountTooltips(sliders: HTMLElement[], configurator: IConfigurator, modelState: IModelState): void {
        if (this.tooltipsElements.length < modelState.touchsValues.length) {
            let amount: number = modelState.touchsValues.length - this.tooltipsElements.length;
            this.createTooltips(amount, sliders, configurator);
        }
        if (this.tooltipsElements.length > modelState.touchsValues.length) {
            const excessAmount: number =  this.tooltipsElements.length - modelState.touchsValues.length;

            new Array(excessAmount)
                .fill(1)
                .forEach(() => {
                    this.tooltipsElements.splice(-1, 1);
                    this.textInTooltips.splice(-1, 1);
                })
        }
    }
    /* перерисовывает тултипы при смене ориентации */
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
    setCurrentTooltipValue(modelState: IModelState, i: number): void {
        this.textInTooltips[i].innerHTML = String(modelState.touchsValues[i]);
    }
    /* метод hideTooltip скрывает туллтипы ползунков */
    hideTooltip(): void {
        const allTooltips: HTMLElement[] = Array.from($(this.parentBlock).find('.slider-tooltip'));
        allTooltips.forEach((element: HTMLElement): void => {
            element.classList.add('slider-tooltip-hide');
        });
    }
    /* метод showTooltip показывает тултипы ползунков */
    showTooltip(): void {
        const allTooltips: HTMLElement[] = Array.from($(this.parentBlock).find('.slider-tooltip'));
        allTooltips.forEach((element: HTMLElement): void => {
            element.classList.remove('slider-tooltip-hide');
        });
    }
}