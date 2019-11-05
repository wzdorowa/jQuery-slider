import {Model} from './model.js';
import {View} from './view.js';

export class Controller {
    constructor(element) {
        console.log('controller created', this, element);
        this.events = {}
    }
    
}