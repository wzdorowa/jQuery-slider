import { IModelState } from './iModelState';
import { IConfigurator } from '../interfaces/iConfigurator';

export interface IViewConfig {
  state: IModelState | null,
  orientation: string,
  configurator: IConfigurator | null,
  isCreatedSlider: boolean,
};
