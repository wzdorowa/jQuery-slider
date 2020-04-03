import {IConfigurator} from '../iConfigurator'

export const getCoefficientPoint = (configurator: IConfigurator, elementSliderLine: HTMLElement, max: number, min: number) => {
    return configurator.calculateCoefficientPoint(elementSliderLine, max, min);
}