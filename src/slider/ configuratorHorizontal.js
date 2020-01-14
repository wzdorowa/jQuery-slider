export const configuratorHorizontal = {
    setWidthHeightSliderContainer(slider) {
        slider.classList.remove('height-vertical-slider-container');
        slider.classList.add('width-horizontal-slider-container');
    },
    createSliderTooltipText(createElement) {
        return createElement('span', 'slider-tooltip-text');
    },
    createSliderLine(createElement) {
        return createElement('div', 'slider-line');
    },
    createSliderLineSpan(createElement) {
        return createElement('span', 'slider-line-span');
    },
    searchElementsTooltipText(slider) {
        return Array.from($(slider).find('.slider-tooltip-text-for-verticalView'));
    },
    calculateCoefficientPoint(elementSliderLine, max, min) {
        return (elementSliderLine.offsetWidth / (max - min));
    },
    sliderLineToDelete(slider) {
        return $(slider).find('.slider-line-for-verticalView');
    },
    calculateValueSliderTouch(elements, getCoefficientPoint, modelState, elementSliderLineSpan) {
        for(let i = 0; i < elements.length; i++) {
            elements[i].style.top = "";
            elements[i].style.left = (Math.ceil(getCoefficientPoint(modelState) * modelState.touchsValues[i])) + 'px';
        }
        elementSliderLineSpan.style.marginTop = "";
        elementSliderLineSpan.style.height = "";

        elementSliderLineSpan.style.marginLeft = elements[0].offsetLeft + 'px';
        elementSliderLineSpan.style.width = (elements[elements.length - 1].offsetLeft - elements[0].offsetLeft) + 'px';
    },
    calculateNewValueSliderTouch(elements, currentTouchIndex, coefficientPoint, modelState, shiftToMinValue, elementSliderLineSpan) {
        for(let i = 0; i < elements.length && i != currentTouchIndex; i++) {
            elements[i].style.top = "";
            elements[i].style.left = (Math.ceil(coefficientPoint * modelState.touchsValues[i]) - shiftToMinValue) + 'px';
        }
        elementSliderLineSpan.style.marginTop = "";
        elementSliderLineSpan.style.height = "";

        elementSliderLineSpan.style.marginLeft = elements[0].offsetLeft + 'px';
        elementSliderLineSpan.style.width = (elements[elements.length - 1].offsetLeft - elements[0].offsetLeft) + 'px';
    },
    setCurrentXorYtoOnStart(target) {
        return target.offsetLeft;
    },
    setStartXorYtoOnStart(eventTouch, currentXorY) {
        return eventTouch.pageX - currentXorY;
    },
    setMaxXorYtoOnStart(elementSliderLine) {
        return elementSliderLine.offsetWidth;
    },
    setCurrentXorYtoOnMove(eventTouch, startXorY) {
        return eventTouch.pageX - startXorY;
    },
    setIndentForTarget(target, currentXorY) {
        target.style.left = currentXorY + 'px';
    },
    elementOffset(element) {
        return element.offsetLeft;
    },
    targetOffset(target) {
        return target.offsetWidth;
    },
    setIndentForTargetToOnStop(target, coefficientPoint, currentValue, shiftToMinValue) {
        target.style.left = Math.ceil(coefficientPoint * currentValue) - shiftToMinValue  + 'px';
    },
    updateLineSpan(elementSliderLineSpan, elements) {
        elementSliderLineSpan.style.marginLeft = elements[0].offsetLeft + 'px';
        elementSliderLineSpan.style.width = (elements[elements.length -1].offsetLeft - elements[0].offsetLeft) + 'px';
    },
};