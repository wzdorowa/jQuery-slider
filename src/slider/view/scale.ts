import {createElement} from '../functions/createElement';
import { IModelState } from '../iModelState';
import { IConfigurator } from '../iConfigurator';

export class Scale {
    private parentBlock: HTMLElement
    public scale!: HTMLElement
    public activeRange!: HTMLElement 

    constructor(element: HTMLElement) {
        this.parentBlock = element
    }
    /* функция createScale добавляет элементы шкалы в основную html-структуру слайдера */
    createScale(configurator: IConfigurator): void {
        const scale: HTMLElement = configurator.createSliderLine();
        const activeRange: HTMLElement = createElement('div', 'slider-line-span');

        this.parentBlock.append(scale);
        scale.append(activeRange);
        
        this.activeRange = activeRange
        this.scale = scale;
    }
    changeOrientation(setSliderTouchToNewPosition: (event: MouseEvent, modelState: IModelState, configurator: IConfigurator) => void, modelState: IModelState, configurator: IConfigurator): void {
        const scaleToDelete: JQuery<HTMLElement> = configurator.sliderLineToDelete(this.parentBlock)
        scaleToDelete.remove();

        this.createScale(configurator);
        this.listenScaleEvents(setSliderTouchToNewPosition, modelState, configurator);
    }
    listenScaleEvents(setSliderTouchToNewPosition: (event: MouseEvent, modelState: IModelState, configurator: IConfigurator) => void, modelState: IModelState, configurator: IConfigurator): void {
        this.scale.addEventListener('click', event => setSliderTouchToNewPosition(event, modelState, configurator));
    }
}