export class Controller {
    constructor(element, model, view) {
        console.log('controller created', this, element),
        view.createSlider()
    }
}