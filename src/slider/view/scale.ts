import { EventEmitter } from '../eventEmitter';
import { IConfigurator } from '../iConfigurator';
import {createElement} from '../functions/createElement';

export class Scale {
    private parentBlock: HTMLElement
    private emitter: EventEmitter
    private configurator!: IConfigurator
    private scale!: HTMLElement
    private activeRange!: HTMLElement 

    constructor(element: HTMLElement, eventEmitter: EventEmitter, configurator: IConfigurator) {
        this.parentBlock = element,
        this.emitter = eventEmitter,
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
    changeOrientation(): void {
        const scaleToDelete: JQuery<HTMLElement> = this.configurator.sliderLineToDelete(this.parentBlock)
        scaleToDelete.remove();

        this.createScale();
        this.listenScaleEvents();
    }
    listenScaleEvents() {
        this.scale.addEventListener('click', event => setSliderTouchToNewPosition(event));
    }
}