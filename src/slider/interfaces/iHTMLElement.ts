import {IModelState} from './iModelState';

export interface IHTMLElement extends HTMLElement {
    type: string
    value: number
    checked: boolean
    getState(): IModelState
    setNewValueMin(min: number): void
    setNewValueMax(max: number): void
    setNewValueAmount(amount: number): void
    setNewValueThumbsValues(thumbValue: number, index: number): void
    setNewValueStep(step: number): void
    setNewValueOrientation(value: string): void
    setNewValueTooltip(value: boolean): void
    subscribeToStateModel(handler: (state: IModelState) => void, isCreatedInput: boolean,
        amountInputs: () => Element[], changeAmountInputs: (state: IModelState) => void,
        setValueToInputFromModelState: (state: IModelState) => void,
        setValueToStepFromModelState: (state: IModelState) => void,
        setValueToMinInputFromModelState: (state: IModelState) => void,
        setValueMaxInputFromModelState: (state: IModelState) => void): void
}
