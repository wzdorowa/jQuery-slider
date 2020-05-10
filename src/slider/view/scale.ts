import { IConfigurator } from '../iConfigurator';
import {createElement} from '../functions/createElement';
import { IModelState } from '../iModelState';

export class Scale {
    private parentBlock: HTMLElement
    private configurator!: IConfigurator
    public scale!: HTMLElement
    public activeRange!: HTMLElement 

    constructor(element: HTMLElement, configurator: IConfigurator) {
        this.parentBlock = element,
        this.configurator = configurator

    }
    /* функция createScale добавляет элементы шкалы в основную html-структуру слайдера */
    createScale(): void {
        const scale: HTMLElement = this.configurator.createSliderLine();
        const activeRange: HTMLElement = createElement('div', 'slider-line-span');

        this.parentBlock.append(scale);
        scale.append(activeRange);
        
        this.activeRange = activeRange
        this.scale = scale;
    }
    changeOrientation(setSliderTouchToNewPosition: (event: MouseEvent, modelState: IModelState) => void, modelState: IModelState): void {
        const scaleToDelete: JQuery<HTMLElement> = this.configurator.sliderLineToDelete(this.parentBlock)
        scaleToDelete.remove();

        this.createScale();
        this.listenScaleEvents(setSliderTouchToNewPosition, modelState);
    }
    listenScaleEvents(setSliderTouchToNewPosition: (event: MouseEvent, modelState: IModelState) => void, modelState: IModelState): void {
        this.scale.addEventListener('click', event => setSliderTouchToNewPosition(event, modelState));
    }
}