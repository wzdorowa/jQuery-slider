import { IModelState } from '../interfaces/iModelState';
import { IConfigurator } from '../interfaces/iConfigurator';

export class Scale {
    public slider: HTMLElement
    public scale!: HTMLElement
    public activeRange!: HTMLElement 

    constructor(element: HTMLElement) {
        this.slider = element
    }
    /* функция createScale добавляет элементы шкалы в основную html-структуру слайдера */
    createScale(configurator: IConfigurator): void {
        const scale: HTMLElement = configurator.createElementScale();
        const activeRange: HTMLElement = configurator.createElementActivRange();

        this.slider.append(scale);
        scale.append(activeRange);
        
        this.activeRange = activeRange
        this.scale = scale;
    }
    changeOrientation(setThumbToNewPosition: (event: MouseEvent, modelState: IModelState, configurator: IConfigurator) => void, modelState: IModelState, configurator: IConfigurator): void {
        const activeRangeToDelite: JQuery<HTMLElement> = configurator.searchElementActivRangeToDelete(this.slider);
        activeRangeToDelite.remove();
        const scaleToDelete: JQuery<HTMLElement> = configurator.searchElementScaleToDelete(this.slider);
        scaleToDelete.remove();
    
        this.createScale(configurator);
        this.listenScaleEvents(setThumbToNewPosition, modelState, configurator);
    }
    listenScaleEvents(setThumbToNewPosition: (event: MouseEvent, modelState: IModelState, configurator: IConfigurator) => void, modelState: IModelState, configurator: IConfigurator): void {
        this.scale.addEventListener('click', event => setThumbToNewPosition(event, modelState, configurator));
    }
}